#!/usr/bin/env node
/**
 * 构建时生成 Navigation 页面的「最近更新」列表
 * 扫描 content/ 下所有内容库（含 CI checkout 的 remote 仓库），写入 nav.md
 */

import fs from "fs/promises"
import path from "path"
import { execSync } from "child_process"
import { slugifyFilePath, simplifySlug } from "@quartz-community/utils"

const CONTENT_DIR = "./content"
const NAV_FILE = "./content/nav.md"
const START_MARKER = "<!-- RECENT_NOTES_START -->"
const END_MARKER = "<!-- RECENT_NOTES_END -->"
const MAX_NOTES = 10

const LIB_LABELS = {
  cg: "CG",
  ai: "AI",
  math: "Math",
  notes: "Notes",
}

const SKIP_DIRS = new Set(["templates", ".obsidian", "private"])
const SKIP_FILES = new Set(["index.md", "nav.md"])

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const data = {}
  for (const line of match[1].split("\n")) {
    const colonIndex = line.indexOf(":")
    if (colonIndex <= 0) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean)
    }

    data[key] = value
  }

  return data
}

function runGit(args) {
  try {
    return execSync(args, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return ""
  }
}

async function hasGitRepo(dir) {
  try {
    await fs.access(path.join(dir, ".git"))
    return true
  } catch {
    return false
  }
}

async function getGitDates(fullPath, relativePath) {
  const parts = relativePath.split(/[/\\]/)
  const libName = parts[0]
  const libRoot = path.join(CONTENT_DIR, libName)
  const relInLib = parts.slice(1).join("/")

  if (libName && (await hasGitRepo(libRoot))) {
    const modified = runGit(
      `git -C "${libRoot}" log -1 --format=%cI -- "${relInLib.replace(/\\/g, "/")}"`,
    )
    const created = runGit(
      `git -C "${libRoot}" log --follow --diff-filter=A --format=%aI --reverse -1 -- "${relInLib.replace(/\\/g, "/")}"`,
    )
    if (modified) return { modified, created: created || modified }
  }

  const modified = runGit(`git log -1 --format=%cI -- "${fullPath.replace(/\\/g, "/")}"`)
  const created = runGit(
    `git log --follow --diff-filter=A --format=%aI --reverse -1 -- "${fullPath.replace(/\\/g, "/")}"`,
  )
  if (modified) return { modified, created: created || modified }

  try {
    const stat = await fs.stat(fullPath)
    const iso = stat.mtime.toISOString()
    return { modified: iso, created: iso }
  } catch {
    return null
  }
}

function toSlug(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/")
  return simplifySlug(slugifyFilePath(normalized))
}

function isFolderIndex(relativePath, frontmatter) {
  const normalized = relativePath.replace(/\\/g, "/")
  if (normalized.endsWith("/index.md")) return true
  if (frontmatter.title && frontmatter.title.toLowerCase() === "index") return true

  const parts = normalized.split("/")
  const fileName = parts.at(-1).replace(/\.md$/, "")
  const folderName = parts.at(-2)
  return folderName && fileName.toLowerCase() === folderName.toLowerCase()
}

function getDescription(content, frontmatter) {
  if (typeof frontmatter.description === "string" && frontmatter.description.trim()) {
    return frontmatter.description.trim()
  }

  const body = content.replace(/^---[\s\S]*?---/, "").trim()
  const text = body
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*`\[\]()!|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!text) return ""
  return text.length > 90 ? `${text.slice(0, 90)}…` : text
}

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "今天"
  if (diffDays === 1) return "昨天"
  if (diffDays < 7) return `${diffDays} 天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

async function scanDirectory(dir, basePath = "") {
  const results = []

  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue
      results.push(...(await scanDirectory(fullPath, relativePath)))
      continue
    }

    if (!entry.name.endsWith(".md") || SKIP_FILES.has(entry.name)) continue

    const content = await fs.readFile(fullPath, "utf-8")
    const frontmatter = parseFrontmatter(content)

    if (frontmatter.noindex === true || frontmatter.noindex === "true") continue
    if (isFolderIndex(relativePath, frontmatter)) continue

    const dates = await getGitDates(fullPath, relativePath)
    if (!dates) continue

    const slug = toSlug(relativePath)
    const library = relativePath.split(/[/\\]/)[0]?.toLowerCase() || "notes"

    results.push({
      title: frontmatter.title || entry.name.replace(/\.md$/, ""),
      slug,
      href: `./${slug}`,
      date: dates.modified,
      library,
      tags: Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : frontmatter.tags
          ? [frontmatter.tags]
          : [],
      description: getDescription(content, frontmatter),
    })
  }

  return results
}

function renderRecentSection(notes) {
  if (notes.length === 0) {
    return `<div class="recent-empty">暂无笔记。内容库更新并部署后会自动出现在这里。</div>`
  }

  const items = notes
    .map((note) => {
      const tag = note.tags[0] || LIB_LABELS[note.library] || note.library.toUpperCase()
      const dateLabel = formatRelativeDate(note.date)
      const description = note.description
        ? `<p class="recent-desc">${escapeHtml(note.description)}</p>`
        : ""

      return `
      <li class="recent-item">
        <a href="${note.href}" class="recent-link">
          <span class="recent-main">
            <span class="recent-title">${escapeHtml(note.title)}</span>
            <span class="recent-tag">${escapeHtml(tag)}</span>
          </span>
          <span class="recent-meta">${dateLabel}</span>
        </a>
        ${description}
      </li>`
    })
    .join("\n")

  const latest = notes[0]
  const browseHref = latest.library ? `./${latest.library}/` : "./cg/"

  return `
<ul class="recent-list">
${items}
</ul>
<div class="recent-actions">
  <a class="recent-primary" href="${latest.href}">阅读最新：${escapeHtml(latest.title)}</a>
  <a class="recent-secondary" href="${browseHref}">浏览 ${LIB_LABELS[latest.library] || latest.library} 库</a>
</div>`
}

async function injectRecentNotes() {
  console.log("Scanning content for recent notes...")
  const allNotes = await scanDirectory(CONTENT_DIR)
  allNotes.sort((a, b) => new Date(b.date) - new Date(a.date))
  const recentNotes = allNotes.slice(0, MAX_NOTES)

  console.log(`Found ${allNotes.length} notes, using top ${recentNotes.length}`)

  let navContent = await fs.readFile(NAV_FILE, "utf-8")
  const start = navContent.indexOf(START_MARKER)
  const end = navContent.indexOf(END_MARKER)

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Markers not found in ${NAV_FILE}`)
  }

  const section = renderRecentSection(recentNotes)
  navContent =
    navContent.slice(0, start + START_MARKER.length) +
    section +
    navContent.slice(end)

  await fs.writeFile(NAV_FILE, navContent)

  recentNotes.forEach((note, index) => {
    console.log(`  ${index + 1}. ${note.title} (${note.library}) - ${note.date.slice(0, 10)}`)
  })

  console.log(`Updated ${NAV_FILE}`)
}

injectRecentNotes().catch((error) => {
  console.error("Failed to inject recent notes:", error)
  process.exit(1)
})
