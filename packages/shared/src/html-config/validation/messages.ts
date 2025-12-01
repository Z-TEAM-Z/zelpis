export const VALIDATION_MESSAGES = {
  EMPTY_HTML: 'HTML is empty',
  PARSE_FAILED: 'Failed to parse HTML',
  MISSING_DOCTYPE: 'Missing DOCTYPE declaration (recommended: <!DOCTYPE html>)',
  MISSING_HTML: 'Missing <html> tag',
  MISSING_HEAD: 'Missing <head> tag',
  MISSING_BODY: 'Missing <body> tag',
  MISSING_CHARSET: 'Missing charset meta tag (recommended: <meta charset="UTF-8">)',
  MISSING_VIEWPORT: 'Missing viewport meta tag (recommended for responsive design)',
  MISSING_TITLE: 'Missing <title> tag',
  UNSAFE_JAVASCRIPT: 'Potentially unsafe "javascript:void" pattern detected',
  UNSAFE_EVAL: 'Potentially unsafe "eval()" call detected in script',
  WRONG_TAG_ORDER: '<head> tag should come before <body> tag',
} as const
