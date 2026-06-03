#!/usr/bin/env node
/**
 * 批量为所有 Markdown 文件添加 frontmatter
 * 自动从 git 历史提取创建和修改日期
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = 'content';

// 获取文件的 git 创建日期
function getGitCreationDate(filePath) {
  try {
    const result = execSync(
      `git log --follow --format=%aI -- "${filePath}" | tail -1`,
      { encoding: 'utf8', cwd: process.cwd() }
    ).trim();
    return result ? result.split('T')[0] : null;
  } catch {
    return null;
  }
}

// 获取文件的 git 最后修改日期
function getGitModifiedDate(filePath) {
  try {
    const result = execSync(
      `git log -1 --format=%aI -- "${filePath}"`,
      { encoding: 'utf8', cwd: process.cwd() }
    ).trim();
    return result ? result.split('T')[0] : null;
  } catch {
    return null;
  }
}

// 处理单个文件
function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 检查是否已有 frontmatter
  if (content.startsWith('---')) {
    console.log(`⏭️  Skipping (has frontmatter): ${filePath}`);
    return;
  }
  
  // 提取标题（第一个 # 行）
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
  
  // 获取 git 日期
  const created = getGitCreationDate(filePath);
  const modified = getGitModifiedDate(filePath);
  
  // 构建 frontmatter
  let frontmatter = '---\n';
  frontmatter += `title: ${title}\n`;
  if (created) {
    frontmatter += `date: ${created}\n`;
  }
  if (modified && modified !== created) {
    frontmatter += `lastmod: ${modified}\n`;
  }
  frontmatter += '---\n\n';
  
  // 写入文件
  const newContent = frontmatter + content;
  fs.writeFileSync(fullPath, newContent);
  
  console.log(`✅ Added frontmatter: ${filePath}`);
  if (created) console.log(`   Created: ${created}`);
  if (modified) console.log(`   Modified: ${modified}`);
}

// 递归遍历目录
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 跳过特定目录
      if (file === '.obsidian' || file === '.git' || file === 'templates') {
        continue;
      }
      walkDir(fullPath, callback);
    } else if (file.endsWith('.md')) {
      callback(fullPath);
    }
  }
}

// 主函数
console.log('📝 Adding frontmatter to all markdown files...\n');

let count = 0;
walkDir(CONTENT_DIR, (filePath) => {
  try {
    processFile(filePath);
    count++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Done! Processed ${count} files.`);
console.log('\nNext steps:');
console.log('1. Review the changes in your Obsidian vault');
console.log('2. Commit the changes: git add content/ && git commit -m "chore: add frontmatter to all notes"');
console.log('3. Push to trigger deployment');
