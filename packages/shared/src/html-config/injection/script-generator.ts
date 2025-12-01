import { dedent } from 'ts-dedent'
import { ZELPIS_DATA_ATTR } from './placeholders'

/**
 * 生成注入脚本
 */
export function getInjectScript(entryPath: string, { props }: any): string {
  return dedent`
    <script type="module" defer src="${entryPath}" ${ZELPIS_DATA_ATTR}="entry"></script>
    <script ${ZELPIS_DATA_ATTR}="hydrate">
      window.$zelpis = {hydrateData:${safeJsonStringify(props)}};
    </script>
  `
}

/**
 * 安全地序列化 JSON（防止 XSS）
 */
function safeJsonStringify(data: any): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
