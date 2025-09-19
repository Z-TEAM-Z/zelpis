import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { resolvePackageJSON } from 'pkg-types';
import { dedent } from 'ts-dedent';
import { createServer as createViteServer } from 'vite';
import { loadDsl } from '../../shared/load-dsl';

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

function getInjectScript(entryPath: string, { props, rendered }: any) {
  return dedent`
    <script type="module" defer src="${entryPath}"></script>
    <script>
      window.$zelpis = { hydrateData: ${JSON.stringify(props)}, rendered: ${JSON.stringify(rendered)} };
    </script>
  `;
}

async function createServer() {
  const pkgDirPath = path.dirname(await resolvePackageJSON());

  const app = express();

  const viteConfigPath = getViteConfigPath(pkgDirPath);

  const viteServer = await createViteServer({
    configFile: viteConfigPath,
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  app.use(viteServer.middlewares);

  // @ts-expect-error any
  const { $zelpis } = viteServer.config;

  const { renderConfig } = $zelpis;

  // const renderConfig = await viteServer.ssrLoadModule('virtual:zelpis/render-config').then(
  //   (mod) => mod.default,
  //   () => console.debug('virtual:zelpis/render-config not found'),
  // );

  // HTML 模板
  const htmlTemplate = fs.readFileSync(path.resolve(pkgDirPath, 'index.html'), 'utf-8');

  renderConfig.entrys.forEach((entry: any) => {
    const { basePath, entryPath } = entry;

    app.get<{ dslName: string[] }>(`${basePath}{/*dslName}`, async (req, res) => {
      const entryFilePath = path.resolve(entryPath);
      const url = req.url;
      const { dslName } = req.params;

      const dsl = await loadDsl(entry.dslPath, dslName);

      try {
        const template = await viteServer.transformIndexHtml(url, htmlTemplate, req.originalUrl);
        const {
          default: { render },
        } = await viteServer
          .ssrLoadModule(entryFilePath)
          .catch(() => ({ default: { render: () => ({ html: '<div id="app"></div>' }) } }));

        const props = { dsl };

        const rendered = await render(props);

        const html = template
          .replace('<!-- app-head -->', rendered.head ?? '')
          .replace('<!-- app-html -->', rendered.html ?? '')
          .replace(
            '<!-- app-inject-script -->',
            getInjectScript(entryFilePath, {
              props,
              rendered,
            }),
          );

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
      } catch (e: any) {
        viteServer.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });
  });

  const port = viteServer.config.server.port;

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

createServer().catch(() => void 0);
