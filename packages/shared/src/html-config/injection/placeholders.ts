export const STANDARD_PLACEHOLDERS = {
  APP_BODY_START: createPlaceholder('app-body-start'),
  APP_INJECT_SCRIPT: createPlaceholder('app-inject-script'),
} as const

function createPlaceholder(name: string): string {
  return `<!-- zelpis:${name} -->`
}

export const ZELPIS_DATA_ATTR = 'data-zelpis-inject' as const
