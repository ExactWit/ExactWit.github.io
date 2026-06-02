#!/usr/bin/env node
import { installPlugins, parsePluginSource } from "./gitLoader.js"
import fs from "fs"
import path from "path"
import YAML from "yaml"

const CONFIG_YAML_PATH = path.join(process.cwd(), "quartz.config.yaml")
const DEFAULT_CONFIG_YAML_PATH = path.join(process.cwd(), "quartz.config.default.yaml")

function resolveConfigPath(): string {
  if (fs.existsSync(CONFIG_YAML_PATH)) return CONFIG_YAML_PATH
  if (fs.existsSync(DEFAULT_CONFIG_YAML_PATH)) return DEFAULT_CONFIG_YAML_PATH
  return CONFIG_YAML_PATH
}

function readPluginsFromYaml(): string[] {
  const configPath = resolveConfigPath()
  if (!fs.existsSync(configPath)) {
    console.log("No config file found.")
    return []
  }

  const raw = fs.readFileSync(configPath, "utf-8")
  const json = YAML.parse(raw) as { plugins?: { source: string; enabled?: boolean }[] }
  
  if (!json.plugins || !Array.isArray(json.plugins)) {
    return []
  }

  // Filter enabled plugins with GitHub sources
  return json.plugins
    .filter((p) => p.enabled !== false && typeof p.source === "string" && p.source.startsWith("github:"))
    .map((p) => p.source as string)
}

async function main() {
  const externalPlugins = readPluginsFromYaml()

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source: string) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
