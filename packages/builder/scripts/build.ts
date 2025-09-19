import fs from 'node:fs';
import path from 'node:path';
import { resolvePackageJSON } from 'pkg-types';
import { build } from 'vite';

function getViteConfigPath(pkgDirPath: string) {
  const tsConfigPath = path.resolve(pkgDirPath, 'vite.config.ts');
  if (fs.existsSync(tsConfigPath)) {
    return tsConfigPath;
  }
  const jsConfigPath = path.resolve(pkgDirPath, 'vite.config.js');
  if (fs.existsSync(jsConfigPath)) {
    return jsConfigPath;
  }
  return false;
}

void (async () => {
  const pkgDirPath = path.dirname(await resolvePackageJSON());

  await build({
    configFile: getViteConfigPath(pkgDirPath),
  });

  // console.debug(result);
})();
