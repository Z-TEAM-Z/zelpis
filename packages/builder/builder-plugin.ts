import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadDsl } from '@zelpis/render/dsl/server'
import { resolveHtmlTemplate } from '@zelpis/render/plugins'
import glob from 'fast-glob'
import { resolvePackageJSON } from 'pkg-types'
import { dedent } from 'ts-dedent'

const PLUGIN_NAME = 'zelpis-builder-plugin'

interface BuilderPluginOption {}

function getInjectScript(entryPath: string, { props }: any): string {
  return dedent`
    <script type="module" defer src="${entryPath}"></script>
    <script>
      window.$zelpis = {hydrateData:${JSON.stringify(props)}};
    </script>
  `
}

interface DslEntry {
  name: string
  segments: string[]
  filePath: string
  content: Record<string, any>
}

async function getDslEntrys(dslPath: string): Promise<DslEntry[]> {
  const dslEntrys = await Promise.all(
    glob.globSync('**/index.{ts,js,json}', { cwd: dslPath, stats: true }).map(async (item: any) => {
      const filePath = path.resolve(dslPath, item.path)
      const name = path.dirname(item.path)
      const segments = name.split('/').filter(seg => seg !== '.')
      return {
        name,
        segments,
        filePath,
        content: await loadDsl(dslPath, segments),
      }
    }),
  )

  return dslEntrys as DslEntry[]
}

export async function buildPlugin(_option?: BuilderPluginOption): Promise<Plugin> {
  const htmlTempDir = path.dirname(await resolvePackageJSON())

  // 用于备份和恢复
  const fileBackups = new Map<string, string | null>() // 路径 -> 原始内容（null表示原本不存在）
  const createdDirs = new Set<string>() // 记录新创建的目录

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    buildEnd() {
      // 恢复/删除文件
      fileBackups.forEach((originalContent, filePath) => {
        if (originalContent === null) {
          // 原本不存在的文件，直接删除
          if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { force: true })
          }
        }
        else {
          // 原本存在的文件，恢复其内容
          fs.writeFileSync(filePath, originalContent, 'utf-8')
        }
      })

      // 清理新创建的空目录（从最深层开始）
      const sortedDirs = Array.from(createdDirs).sort((a, b) => b.length - a.length)
      sortedDirs.forEach((dir) => {
        if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
          fs.rmSync(dir, { force: true, recursive: true })
        }
      })
    },
    async config(config) {
      config.build ||= {}
      config.build.rollupOptions ||= {}

      if (!fs.existsSync(htmlTempDir)) {
        fs.mkdirSync(htmlTempDir, { recursive: true })
      }

      const zelpisConfig = config.zelpis

      if (!zelpisConfig) {
        throw new Error('Zelpis render config not found')
      }

      const { entrys } = zelpisConfig

      const inputObj = (
        await Promise.all(
          (entrys as any[]).map(async (item) => {
            if (item.dslPath) {
              item.dslEntrys = await getDslEntrys(item.dslPath)
            }
            return item
          }),
        )
      ).reduce<Record<string, string>>((input, item) => {
        const name = item.basePath.replace(/^\//, '');

        (item.dslEntrys as DslEntry[]).forEach((dslItem) => {
          const { name: dslName, segments, content } = dslItem
          const _segments = [name, ...segments]
          const filename = _segments.pop() || 'index'
          const entry = path.resolve(htmlTempDir, ..._segments, `${filename}.html`)
          const entryDir = path.dirname(entry)

          // 如果文件已存在，备份其内容
          if (fs.existsSync(entry)) {
            fileBackups.set(entry, fs.readFileSync(entry, 'utf-8'))
          }
          else {
            // 文件不存在，标记为 null
            fileBackups.set(entry, null)
          }

          // 如果目录不存在，创建并记录
          if (!fs.existsSync(entryDir)) {
            fs.mkdirSync(entryDir, { recursive: true })
            // 记录所有新创建的父级目录
            let currentDir = entryDir
            while (currentDir !== htmlTempDir && !fs.existsSync(currentDir)) {
              createdDirs.add(currentDir)
              currentDir = path.dirname(currentDir)
            }
            createdDirs.add(entryDir)
          }

          // 解析 HTML 模板
          const htmlTemplate = resolveHtmlTemplate({
            entry: item,
            defaultHtml:
            zelpisConfig.defaultHtml,
            rootDir: process.cwd(),
          })

          fs.writeFileSync(
            entry,
            htmlTemplate
              .replace('<!-- app-html -->', '<div id="app"></div>')
              .replace('<!-- app-inject-script -->', getInjectScript(item.entryPath, { props: { dsl: content } })),
          )

          input[`${name ? `${name}/` : ''}${dslName}`] = entry
        })

        return input
      }, {})

      config.build.rollupOptions.input = inputObj
    },
  }
}
