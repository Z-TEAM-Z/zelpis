import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { mergeDsl } from '../render';

export async function loadDsl(modelDir: string, dslName: string[]) {
  function resolveIndexFile(targetPath: string) {
    // If a directory is provided, resolve to an index file inside it
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      const candidates = ['index.ts', 'index.js'];
      for (const filename of candidates) {
        const candidatePath = path.join(targetPath, filename);
        if (fs.existsSync(candidatePath)) return candidatePath;
      }
    }
    // If a direct file was passed, or nothing matched, return the original
    return targetPath;
  }

  const basePath = resolveIndexFile(path.resolve(modelDir));
  const { default: baseDsl } = await import(pathToFileURL(basePath).href);

  if (!(dslName && dslName.length)) {
    return baseDsl;
  }

  const nameDslList = await Promise.all(
    dslName
      .reduce(
        (result, item) => {
          const dirname = path.resolve(result.prefix, item);
          result.list.push(dirname);
          result.prefix = dirname;
          return result;
        },
        { prefix: modelDir, list: [] as string[] },
      )
      .list.map(async (item) => {
        if (!fs.existsSync(item)) {
          return {};
        }
        const resolved = resolveIndexFile(item);
        return import(pathToFileURL(resolved).href).then((res) => res.default);
      }),
  );
  
  return mergeDsl(baseDsl, ...nameDslList);
}
