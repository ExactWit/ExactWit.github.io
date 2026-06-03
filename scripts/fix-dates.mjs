#!/usr/bin/env node
/**
 * 修复 frontmatter，添加缺失的 date 字段
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = 'content/CG';

// 获取文件的 git 日期
function getGitDates(filePath) {
  try {
    const created = execSync(
      `git log --follow --format=%aI -- "${filePath}" | tail -1`,
      { encoding: 'utf8' }
    ).trim();
    
    const modified = execSync(
      `git log -1 --format=%aI -- "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();
    
    return {
      created: created ? created.split('T')[0] : null,
      modified: modified ? modified.split('T')[0] : null
    };
  } catch {
    return { created: null, modified: null };
  }
}

// 解析 frontmatter
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  
  const end = content.indexOf('---', 3);
  if (end === -1) return null;
  
  const fm = content.slice(3, end).trim();
  const body = content.slice(end + 3).trim();
  
  // 解析 key-value
  const data = {};
  for (const line of fm.split('\n')) {
    const match = line.match(/^([\w-]+):\s*(.+)?$/);
    if (match) {
      data[match[1]] = match[2] || '';
    }
  }
  
  return { data, body, end };
}

// 处理单个文件
function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.log(`⏭️  No frontmatter: ${filePath}`);
    return;
  }
  
  const { data, body } = parsed;
  
  // 检查是否已有 date
  if (data.date && data.date.trim()) {
    console.log(`⏭️  Already has date: ${filePath}`);
    return;
  }
  
  // 获取 git 日期
  const dates = getGitDates(filePath);
  if (!dates.created) {
    console.log(`⏭️  No git history: ${filePath}`);
    return;
  }
  
  // 构建新的 frontmatter
  let newFm = '---\n';
  for (const [key, value] of Object.entries(data)) {
    newFm += `${key}: ${value}\n`;
  }
  newFm += `date: ${dates.created}\n`;
  if (dates.modified && dates.modified !== dates.created) {
    newFm += `lastmod: ${dates.modified}\n`;
  }
  newFm += '---\n\n';
  
  // 写入文件
  fs.writeFileSync(fullPath, newFm + body);
  
  console.log(`✅ Fixed: ${filePath}`);
  console.log(`   Created: ${dates.created}`);
  if (dates.modified !== dates.created) {
    console.log(`   Modified: ${dates.modified}`);
  }
}

// 递归遍历
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file === '.obsidian' || file === '.git' || file === 'templates') continue;
      walkDir(fullPath, callback);
    } else if (file.endsWith('.md')) {
      callback(fullPath);
    }
  }
}

// 主函数
console.log('🔧 Fixing dates in frontmatter...\n');

let count = 0;
walkDir(CONTENT_DIR, (filePath) => {
  try {
    processFile(filePath);
    count++;
  } catch (error) {
    console.error(`❌ Error: ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Done! Processed ${count} files.`);
console.log('\nNext: Commit and push CG repo to remote');
