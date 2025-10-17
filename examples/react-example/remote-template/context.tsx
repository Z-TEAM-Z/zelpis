import { createContext, useContext } from 'react'

const renderContext = createContext({})

export const RenderContextProvider = renderContext.Provider

export function useRenderContext(): any {
  return useContext(renderContext)
}
