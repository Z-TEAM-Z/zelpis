import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadDsl } from '@zelpis/render/dsl/server'
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
  const htmlEntrys: string[] = []

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    buildEnd() {
      htmlEntrys.forEach((item) => {
        const relativePath = path.relative(htmlTempDir, item)
        const firstSegment = relativePath.split(path.sep)[0]
        const htmlRootDir = path.basename(firstSegment || '', '.html')
        const dslEntryDir = path.resolve(htmlTempDir, htmlRootDir)

        if (fs.existsSync(dslEntryDir) && dslEntryDir !== htmlTempDir) {
          fs.rmSync(dslEntryDir, { force: true, recursive: true })
        }

        fs.rmSync(item, { force: true })
      })
    },
    async config(config) {
      config.build ||= {}
      config.build.rollupOptions ||= {}

      const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8')

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

          if (!fs.existsSync(entryDir)) {
            fs.mkdirSync(entryDir, { recursive: true })
          }

          fs.writeFileSync(
            entry,
            htmlTemplate
              .replace('<!-- app-html -->', '<div id="app"></div>')
              .replace('<!-- app-inject-script -->', getInjectScript(item.entryPath, { props: { dsl: content } })),
          )

          if (dslName !== '.') {
            htmlEntrys.push(entry)
          }

          input[`${name ? `${name}/` : ''}${dslName}`] = entry
        })

        return input
      }, {})

      config.build.rollupOptions.input = inputObj
    },
  }
}
