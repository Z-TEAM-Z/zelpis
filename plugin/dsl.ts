import type { FSWatcher } from 'chokidar'
import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import chokidar from 'chokidar'
import type { Plugin, ViteDevServer } from 'vite'
import { createFilter, normalizePath, type FilterPattern } from 'vite'

type Options = Partial<{
  modelDir: string
  exclude: FilterPattern
  include: FilterPattern
  isDev: boolean
}>


const defaultOptions: Options = {
  modelDir: 'src/model',
  exclude: [''],
  include: [/\.[cm]?[jt]s$/,],
  isDev: false,
}

export default function (options: Options = {}) {
  options = { ...defaultOptions, ...options }

  const virtualModuleId = '@zelpis/render/dsl/'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  
  const { modelDir, exclude, include, isDev } = options as Required<Options>
  const filter = createFilter(include, exclude)

  const modelPath = resolve(process.cwd(), modelDir)

  let virtualFileContentMap:Record<string, string> = {
    
  }
  let viteDevServer: ViteDevServer | null = null

  function generateModelGetter() {
    const files = globSync(normalizePath(`${modelPath}/**/*`)).filter(file => filter(file))

    const entries = files.map(file => {
      const relativePath = file.replace(modelPath, '').replace(/\\/g, '/').replace(/^\//, '')
      const moduleName = relativePath.replace(/\.[cm]?[jt]s$/, '')
      const name = moduleName.split('/').pop() || 'default'

      return {
        moduleName,
        name,
        relativePath,
        file
      }
    })


    const imports = entries.reduce((imports, cur) => {
      imports[cur.name] = `import ${cur.name} from '${normalizePath(cur.file)}'`

      return imports
    }, {} as Record<string, string>)


    entries.forEach((entry) => {

      virtualFileContentMap[entry.name] = `
        ${imports[entry.name]}

        export default ${entry.name}
      `
    })
  }


  function invalidateVirtualModule() {
    if (!viteDevServer)
      return


    const module = viteDevServer.moduleGraph.getModuleById(resolvedVirtualModuleId)
    if (!module)
      return

    viteDevServer.moduleGraph.invalidateModule(module)

    viteDevServer.ws.send({
      type: 'update',
      updates: [{
        type: 'js-update',
        path: virtualModuleId,
        acceptedPath: virtualModuleId,
        timestamp: Date.now()
      }]
    })


  }

  generateModelGetter()

  if (process.env.NODE_ENV === 'development' || isDev) {
    const watcher: FSWatcher = chokidar.watch(modelPath)

    function onFileChange(){
      generateModelGetter()
      invalidateVirtualModule()
    }

    watcher.on('add', onFileChange)

    watcher.on('unlink', onFileChange)

    watcher.on('change', onFileChange)
  }
  return {
    name: 'zelpis-render-helper',
    configureServer(server) {
      viteDevServer = server
    },
    resolveId(id) {
      if (id.startsWith(virtualModuleId)) {
        return '\0' + id 
      }
    },
    load(id) {
      if (id.startsWith(resolvedVirtualModuleId)) { 
        return virtualFileContentMap[id.replace(resolvedVirtualModuleId, '')]
      }
    },
  } as Plugin
}
