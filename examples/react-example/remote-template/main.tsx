import { RouterProvider } from 'react-router/dom'
import { RenderContextProvider } from './context'
import { router } from './router'

export function App(props: any): React.ReactElement {
  return (
    <RenderContextProvider value={props}>
      <RouterProvider router={router} />
    </RenderContextProvider>
  )
}
