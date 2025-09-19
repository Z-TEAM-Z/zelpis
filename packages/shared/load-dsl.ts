import fs from 'node:fs';
import path from 'node:path';
import { mergeDsl } from '../render';

export async function loadDsl(modelDir: string, dslName: string[]) {
  const { default: baseDsl } = await import(path.resolve(modelDir));

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
        return import(path.resolve(modelDir, item)).then((res) => res.default);
      }),
  );

  return mergeDsl(baseDsl, ...nameDslList);
}
