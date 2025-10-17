const EMPTY = Symbol('empty')

export function once<T extends (...args: any[]) => any>(callback: T): T {
  let result = EMPTY

  return ((...args: any[]) => {
    if (result !== EMPTY) {
      return result
    }
    return result = callback(...args)
  }) as any
}
