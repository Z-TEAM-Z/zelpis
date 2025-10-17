import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'
import { mergeDsl } from './merge'

const jiti = createJiti('')

async function jitiImport(id: string): Promise<{ default: any }> {
  return jiti.import(id, { default: true }).then(res => ({ default: res }))
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

export async function loadDsl(modelDir: string, dslName: string[]): Promise<Record<string, any>> {
  const resolvedPath = resolveModuleEntry(path.resolve(modelDir))
  const { default: baseDsl } = await jitiImport(pathToFileURL(resolvedPath).href)

  if (!(dslName && dslName.length)) {
    return baseDsl
  }

  const nameDslList = await Promise.all(
    dslName
      .reduce(
        (result, item) => {
          const dirname = path.resolve(result.prefix, item)
          result.list.push(dirname)
          result.prefix = dirname
          return result
        },
        { prefix: modelDir, list: [] as string[] },
      )
      .list.map(async (item) => {
        if (!fs.existsSync(item)) {
          return {}
        }
        const itemPath = resolveModuleEntry(path.resolve(modelDir, item))
        return jitiImport(pathToFileURL(itemPath).href).then(res => res.default)
      }),
  )

  return mergeDsl(baseDsl, ...nameDslList)
}
