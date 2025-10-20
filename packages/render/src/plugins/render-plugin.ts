import type { ZElpisConfig } from '@zelpis/builder'
import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { dedent } from 'ts-dedent'
import { mergeDsl } from '../dsl/merge'
import { resolveHtmlTemplate } from '../utils/resolve-html-template'

const PLUGIN_NAME = 'zelpis-render-plugin'

const VIRTUAL_MODULE_ID = 'virtual:zelpis/render-config'

interface RenderPluginOption {
  baseDir?: string
}

function parseOption(option: ZElpisConfig & RenderPluginOption): ZElpisConfig {
  option.entrys.forEach((entry) => {
    const baseDir = option.baseDir || process.cwd()
    entry.entryPath = path.resolve(baseDir, entry.entryPath)
    entry.dslPath = entry.dslPath
      ? path.resolve(baseDir, entry.dslPath)
      : path.resolve(path.dirname(entry.entryPath), 'model')
  })

  return option
}

export function renderPlugin(option: RenderPluginOption): Plugin {
  const resolveVirtualModuleId = `\0${VIRTUAL_MODULE_ID}`

  const parsedConfig: ZElpisConfig & RenderPluginOption = {} as any

  function getInjectScript(entryPath: string, props: Record<string, unknown>): string {
    return dedent`
      <script type="module" defer src="${entryPath}"></script>
      <script>
        window.$zelpis = { hydrateData: ${JSON.stringify(props)}};
      </script>
    `
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    config(config) {
      const zelpisConfig = parseOption({ ...option, ...config.zelpis || {} as any })
      config.zelpis = zelpisConfig
      Object.assign(parsedConfig, zelpisConfig)
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return { id: resolveVirtualModuleId, moduleSideEffects: 'no-treeshake' }
      }
    },
    load(id) {
      if (id === resolveVirtualModuleId) {
        return `export default ${JSON.stringify(parsedConfig)};`
      }
    },
    configureServer(server) {
      // 计算相对于服务器根目录的路径
      const rootDir = server.config.root || process.cwd()

      const zelpisConfig = server.config.zelpis! || {}
      if (!zelpisConfig) {
        throw new Error('Zelpis render config not found')
      }

      function resolveModuleEntry(fileOrDirPath: string): string {
        if (fs.existsSync(fileOrDirPath) && fs.statSync(fileOrDirPath).isDirectory()) {
          const tryFiles = ['index.ts', 'index.js', 'index.json']
          for (const fname of tryFiles) {
            const candidate = path.join(fileOrDirPath, fname)
            if (fs.existsSync(candidate))
              return candidate
          }
        }
        return fileOrDirPath
      }

      async function checkDslExists(modelDir: string | undefined, dslName: string[]): Promise<boolean> {
        if (!modelDir) {
          return false
        }
        if (!dslName || dslName.length === 0) {
          // 检查根目录的 index 文件
          const baseEntry = resolveModuleEntry(path.resolve(modelDir))
          return fs.existsSync(baseEntry)
        }

        // 检查嵌套的 DSL 文件
        const segmentsAccum = dslName.reduce(
          (acc, seg) => {
            const dirname = path.resolve(acc.prefix, seg)
            acc.list.push(dirname)
            acc.prefix = dirname
            return acc
          },
          { prefix: modelDir, list: [] as string[] },
        ).list

        // 检查每个路径段是否存在
        for (const p of segmentsAccum) {
          if (!fs.existsSync(p)) {
            return false
          }
        }

        // 检查最后一个路径段是否有 index 文件
        const lastPath = segmentsAccum[segmentsAccum.length - 1]
        const lastEntry = resolveModuleEntry(path.resolve(modelDir, lastPath))
        return fs.existsSync(lastEntry)
      }

      async function loadDslWithVite(modelDir: string, dslName: string[]): Promise<Record<string, any>> {
        const baseEntry = resolveModuleEntry(path.resolve(modelDir))
        const baseMod = await server.ssrLoadModule(baseEntry)
        const baseDsl = baseMod.default

        if (!(dslName && dslName.length))
          return baseDsl

        const segmentsAccum = dslName.reduce(
          (acc, seg) => {
            const dirname = path.resolve(acc.prefix, seg)
            acc.list.push(dirname)
            acc.prefix = dirname
            return acc
          },
          { prefix: modelDir, list: [] as string[] },
        ).list

        const nameDslList = await Promise.all(
          segmentsAccum.map(async (p) => {
            if (!fs.existsSync(p))
              return {}
            const itemPath = resolveModuleEntry(path.resolve(modelDir, p))
            const m = await server.ssrLoadModule(itemPath)
            return m.default ?? {}
          }),
        )

        return mergeDsl(baseDsl, ...nameDslList)
      }

      for (const entry of zelpisConfig.entrys) {
        const basePath = entry.basePath || '/'
        const entryFilePath = path.resolve(entry.entryPath)

        // 计算出相对路径
        const relativeEntryPath = `/${path.relative(rootDir, entryFilePath).replace(/\\/g, '/')}`
        // 解析 HTML 模板
        const htmlTemplate = resolveHtmlTemplate({ entry, defaultHtml: zelpisConfig.defaultHtml, rootDir })

        server.middlewares.use(async (req, res, next) => {
          try {
            if (!req.url || req.method !== 'GET')
              return next()
            const url = req.url
            // 跳过静态资源，让 Vite 处理
            if (url.includes('.') && !url.endsWith('/')) {
              return next()
            }
            // 跳过 Vite 的内部请求
            if (url.startsWith('/@')) {
              return next()
            }

            // 仅处理命中的 basePath
            if (!url.startsWith(basePath))
              return next()

            const rest = url.slice(basePath.length) || ''
            const clean = rest.split('?')[0].replace(/^\//, '')
            const dslName = clean ? clean.split('/').filter(Boolean) : []

            // 检查是否存在对应的 DSL 文件，只有存在才走我们的拦截器逻辑
            const dslExists = await checkDslExists(entry.dslPath, dslName)
            if (!dslExists) {
              return next() // 让 Vite 处理，不走我们的 SSR 逻辑
            }

            // 使用 Vite 的 ssrLoadModule 加载 DSL，避免 .ts 扩展名问题
            const dsl = await loadDslWithVite(entry.dslPath!, dslName)

            const template = await server.transformIndexHtml(url, htmlTemplate, req.originalUrl)
            // const {
            //   default: { render },
            // } = await server
            //   .ssrLoadModule(entryFilePath)
            //   .catch(() => ({ default: { render: () => ({ html: '<div id="app"></div>' }) } }))

            const props = { dsl }
            // const rendered = await render(props)

            const html = template
              // .replace('<!-- app-head -->', rendered.head ?? '')
              // .replace('<!-- app-html -->', rendered.html ?? '')
              .replace(
                '<!-- app-inject-script -->',
                getInjectScript(relativeEntryPath, props),
              )

            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          }
          catch (e: any) {
            server.ssrFixStacktrace(e)
            return next(e)
          }
        })
      }
    },
  } satisfies Plugin
}
