import { createContext, useContext } from 'react';

const renderContext = createContext({});

export const RenderContextProvider = renderContext.Provider;

export function useRenderContext() {
  return useContext(renderContext);
}
