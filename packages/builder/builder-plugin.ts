import fs from 'node:fs';
import path, { dirname } from 'node:path';
import process from 'node:process';
import glob from 'fast-glob';
import { resolvePackageJSON } from 'pkg-types';
import { dedent } from 'ts-dedent';
import type { Plugin } from 'vite';
import { loadDsl } from '../shared/load-dsl';

const PLUGIN_NAME = 'zelpis-builder-plugin';

interface BuilderPluginOption {}

function getInjectScript(entryPath: string, { props }: any) {
  return dedent`
    <script type="module" defer src="${entryPath}"></script>
    <script>
      window.$zelpis = {hydrateData:${JSON.stringify(props)}};
    </script>
  `;
}

interface DslEntry {
  name: string;
  segments: string[];
  filePath: string;
  content: Record<string, any>;
}

async function getDslEntrys(dslPath: string) {
  const dslEntrys = await Promise.all(
    glob.globSync('**/index.{ts,js,json}', { cwd: dslPath, stats: true }).map(async (item) => {
      const filePath = path.resolve(dslPath, item.path);
      const name = path.dirname(item.path);
      const segments = name.split('/').filter((seg) => seg !== '.');
      return {
        name,
        segments,
        filePath,
        content: await loadDsl(dslPath, segments),
      };
    }),
  );

  return dslEntrys as DslEntry[];
}


export async function buildPlugin(_option?: BuilderPluginOption): Promise<Plugin> {
  const htmlTempDir = path.dirname(await resolvePackageJSON());
  const htmlEntrys: string[] = [];
  let entryMap: Record<string, string> = {};
  const htmlTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');

  return {
    name: PLUGIN_NAME,
    // apply: 'build',
    buildEnd() {
      htmlEntrys.forEach((item) => {
        const htmlRootDir = path.basename(path.relative(htmlTempDir, item).split(path.sep).shift()!, '.html');
        const dslEntryDir = path.resolve(htmlTempDir, htmlRootDir);

        if (fs.existsSync(dslEntryDir) && dslEntryDir !== htmlTempDir) {
          fs.rmSync(dslEntryDir, { force: true, recursive: true });
        }

        fs.rmSync(item, { force: true });
      });
    },
    async config(config,env) {
      config.build ||= {};
      config.build.rollupOptions ||= {};

      if (!fs.existsSync(htmlTempDir)) {
        fs.mkdirSync(htmlTempDir, { recursive: true });
      }

      // @ts-expect-error
      const $zelpis = config.$zelpis;

      const { entrys } = $zelpis.renderConfig;

      const inputObj = (
        await Promise.all(
          (entrys as any[]).map(async (item) => {
            if (item.dslPath) {
              item.dslEntrys = await getDslEntrys(item.dslPath);
            }
            return item;
          }),
        )
      ).reduce<Record<string, string>>((input, item) => {
        const name = item.basePath.replace(/^\//, '');
    
        (item.dslEntrys as DslEntry[]).forEach((dslItem) => {
          const { name: dslName, segments, content } = dslItem;
          const _segments = [name, ...segments];
          const filename = _segments.pop() || 'index';
          const entry = path.resolve(htmlTempDir, ..._segments, `${filename}.html`);
          const entryDir = path.dirname(entry);
    
          if (!fs.existsSync(entryDir)) {
            fs.mkdirSync(entryDir, { recursive: true });
          }
          if(env.command === 'build') {
            fs.writeFileSync(
              entry,
              htmlTemplate
                .replace('<!-- app-html -->', '<div id="app"></div>')
                .replace('<!-- app-inject-script -->', getInjectScript(item.entryPath, { props: { dsl: content } })),
            );
          }else{
            const entryPath = `/${path.relative(process.cwd(), item.entryPath)}`
            input[`${name}/${dslName}`] = htmlTemplate
            .replace('<!-- app-html -->', '<div id="app"></div>')
            .replace('<!-- app-inject-script -->', getInjectScript(entryPath, { props: { dsl: content } }));
            return 
          }
    
          if (dslName === '.') {
            htmlEntrys.push(entry);
          }
    
          input[`${name}/${dslName}`] = entry;
        });
    
        return input;
      }, {});
      entryMap = inputObj;
      if(env.command === 'build') {
        config.build.rollupOptions.input = inputObj;
      }
    },
    // 这个钩子只在开发模式下运行
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 根据请求的 URL 路径，查找对应的入口文件
        const entryPath = path.posix.normalize(req.url).replace(/^\//, '');

        if (entryMap[entryPath]) {
          const absoluteEntryFilePath = entryMap[entryPath];
          
          res.setHeader('Content-Type', 'text/html');
          res.end(absoluteEntryFilePath);
          return;
        }

        next(); // 如果不是我们定义的入口，继续处理下一个中间件
      });
    },
  };
}
