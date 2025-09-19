export function mergeDsl(target: Record<string, any>, ...source: Record<string, any>[]) {
  const result = { ...target } as Record<string, any>;
  source.forEach((item) => {
    Object.assign(result, item);
  });
  return result;
}
