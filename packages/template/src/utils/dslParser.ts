function getByPath(obj: Record<string, any>, path: string) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj)
}

export function resolveConfig(config: Record<string, any>, rootData: Record<string, any>) {
  if (!config || typeof config !== 'object') {
    return config
  }

  const resolved = {}
  for (const key in config) {
    const value = config[key]
    if (typeof value === 'string' && value.startsWith('[[') && value.endsWith(']]')) {
      const path = value.slice(2, -2).trim()
      const resolvedValue = getByPath(rootData, path)
      resolved[key] = (resolvedValue !== null) ? resolvedValue : value
    }
    else if (Array.isArray(value)) {
      resolved[key] = value.map(item => resolveConfig(item, rootData))
    }
    else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveConfig(value, rootData)
    }
    else {
      resolved[key] = value
    }
  }
  return resolved
}
