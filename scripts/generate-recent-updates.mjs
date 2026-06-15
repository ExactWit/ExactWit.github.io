#!/usr/bin/env node
/**
 * 生成最近更新笔记的 JSON 文件
 * 在构建时扫描所有内容文件，生成 static/recent-updates.json
 */

import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'

const CONTENT_DIR = './content'
const OUTPUT_FILE = './quartz/static/recent-updates.json'
const MAX_NOTES = 10

async function getGitDates(filePath) {
  try {
    const modified = execSync(`git log -1 --format=%cI "${filePath}"`, { encoding: 'utf-8' }).trim()
    const created = execSync(`git log --follow --diff-filter=A --format=%aI "${filePath}" | tail -1`, { encoding: 'utf-8' }).trim()
    return { modified, created }
  } catch (e) {
    return null
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  
  const fm = match[1]
  const data = {}
  
  // Simple YAML-like parsing
  fm.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
      }
      
      data[key] = value
    }
  })
  
  return data
}

async function scanDirectory(dir, basePath = '') {
  const results = []
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(basePath, entry.name)
      
      if (entry.isDirectory()) {
        // Skip special directories
        if (entry.name.startsWith('.') || entry.name === 'templates') continue
        results.push(...await scanDirectory(fullPath, relativePath))
      } else if (entry.name.endsWith('.md')) {
        // Skip index files and nav
        if (entry.name === 'index.md' || entry.name === 'nav.md') continue
        
        try {
          const content = await fs.readFile(fullPath, 'utf-8')
          const frontmatter = parseFrontmatter(content)
          
          // Skip files with noindex
          if (frontmatter.noindex === 'true' || frontmatter.noindex === true) continue
          
          // Get dates from frontmatter or git
          let dates = null
          if (frontmatter.date || frontmatter.lastmod) {
            dates = {
              modified: frontmatter.lastmod || frontmatter.date,
              created: frontmatter.date
            }
          } else {
            dates = await getGitDates(fullPath)
          }
          
          if (!dates) continue
          
          // Calculate slug
          let slug = relativePath.replace(/\.md$/, '')
          // Handle Chinese characters in paths
          slug = encodeURIComponent(slug).replace(/%2F/g, '/')
          
          results.push({
            title: frontmatter.title || entry.name.replace(/\.md$/, '').replace(/-/g, ' '),
            slug: slug,
            path: './' + relativePath.replace(/\.md$/, ''),
            date: dates.modified,
            created: dates.created,
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                  frontmatter.tags ? [frontmatter.tags] : [],
            folder: basePath.split('/')[0] || 'notes'
          })
        } catch (e) {
          console.error(`Error processing ${fullPath}:`, e.message)
        }
      }
    }
  } catch (e) {
    // Directory might not exist
  }
  
  return results
}

async function generateRecentUpdates() {
  console.log('🔍 Scanning content directories...')
  
  // Scan content directory and all subdirectories
  const allNotes = await scanDirectory(CONTENT_DIR)
  
  console.log(`📄 Found ${allNotes.length} notes`)
  
  // Sort by modified date (newest first)
  allNotes.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  // Take top N
  const recentNotes = allNotes.slice(0, MAX_NOTES)
  
  // Ensure output directory exists
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  
  // Write JSON file
  await fs.writeFile(OUTPUT_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: recentNotes.length,
    notes: recentNotes
  }, null, 2))
  
  console.log(`✅ Generated ${OUTPUT_FILE} with ${recentNotes.length} recent notes`)
  
  // Print summary
  recentNotes.forEach((note, i) => {
    console.log(`  ${i + 1}. ${note.title} (${note.folder}) - ${note.date.slice(0, 10)}`)
  })
}

generateRecentUpdates().catch(e => {
  console.error('❌ Error:', e)
  process.exit(1)
})
