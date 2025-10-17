import { boot } from '@zelpis/core'
import App from './app.vue'
import { router } from './router'

export default boot({
  // type: 'csr',
  framework: 'vue',
  Component: App as any,
  mount(app) {
    app.use(router)
  },
})
