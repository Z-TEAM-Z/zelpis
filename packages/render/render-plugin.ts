import path from 'node:path';
import process from 'node:process';
import type { Plugin } from 'vite';

const PLUGIN_NAME = 'zelpis-render-plugin';

const VIRTUAL_MODULE_ID = 'virtual:zelpis/render-config';

interface Entry {
  basePath: string;
  entryPath: string;
  dslPath?: string;
}

interface RenderPluginOption {
  baseDir?: string;
  entrys: Entry[];
}

function parseOption(option: RenderPluginOption) {
  option.entrys.forEach((entry) => {
    const baseDir = option.baseDir || process.cwd();
    entry.entryPath = path.resolve(baseDir, entry.entryPath);
    entry.dslPath = entry.dslPath
      ? path.resolve(baseDir, entry.dslPath)
      : path.resolve(path.dirname(entry.entryPath), 'model');
  });
  return option;
}

export function renderPlugin(option: RenderPluginOption): Plugin {
  const resolveVirtualModuleId = `\0${VIRTUAL_MODULE_ID}`;

  const parsedConfig = parseOption(option);

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    config(config) {
      // @ts-expect-error any
      config.$zelpis ||= {};
      // @ts-expect-error any
      config.$zelpis.renderConfig = parsedConfig;
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return { id: resolveVirtualModuleId, moduleSideEffects: 'no-treeshake' };
      }
    },
    load(id) {
      if (id === resolveVirtualModuleId) {
        return `export default ${JSON.stringify(parsedConfig)};`;
      }
    },
  };
}
