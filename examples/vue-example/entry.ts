// import { boot } from '@zelpis/core'
// import App from './app.vue'
// import { router } from './router'

// export default boot({
//   // type: 'csr',
//   framework: 'vue',
//   Component: App as any,
//   mount(app) {
//     app.use(router)
//   },
// })
import { renderTemplate } from '../../packages/template/src/index.ts'
import dsl from './dsl.json'

renderTemplate({ templateId: 'project_dashboard_v1', dsl })
