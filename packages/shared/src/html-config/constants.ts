// 正则表达式
export const HTML_TAG_REGEX = /<html/i
export const HTML_LANG_REGEX = /<html[^>]*\slang=/i
export const HEAD_OPEN_REGEX = /<head[^>]*>/i
export const HEAD_CLOSE_REGEX = /<\/head>/i
export const BODY_OPEN_REGEX = /<body[^>]*>/i
export const BODY_CLOSE_REGEX = /<\/body>/i
export const TITLE_REGEX = /<title>.*?<\/title>/i
export const META_CHARSET_REGEX = /<meta[^>]+charset=/i
export const META_VIEWPORT_REGEX = /<meta[^>]+name="viewport"/i
export const META_DESCRIPTION_REGEX = /<meta[^>]+name="description"/i
export const META_KEYWORDS_REGEX = /<meta[^>]+name="keywords"/i
export const HTML_CLOSE_REGEX = /<\/html>/i
export const HTML_LANG_REPLACE_REGEX = /(<html[^>]*\s)lang="[^"]*"/i
export const BODY_REPLACE_REGEX = /<body([^>]*)>/i
export const BODY_FULL_REGEX = /<body([^>]*)>([\s\S]*?)<\/body>/i
export const META_CHARSET_REPLACE_REGEX = /(<meta[^>]+)charset="[^"]*"/i
export const META_VIEWPORT_REPLACE_REGEX = /(<meta[^>]+name="viewport"[^>]+)content="[^"]*"/i
export const META_DESCRIPTION_REPLACE_REGEX = /(<meta[^>]+name="description"[^>]+)content="[^"]*"/i
export const META_KEYWORDS_REPLACE_REGEX = /(<meta[^>]+name="keywords"[^>]+)content="[^"]*"/i

// 默认模板
export const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zelpis App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`
