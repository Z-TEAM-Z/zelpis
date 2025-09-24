import pinia from './store';
import './asserts/custom.css';

// 引入elementui
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

/**
 * vue页面的主入口，用于启动vue
 * @param app 应用实例
 * @param libs 页面依赖的第三方包
 */
export default (app: any, { libs,router }: { libs?: any[],router?: any } = {}) => {
console.log("🚀 ~ router:", router.getRoutes())

  // 应用elementui
  app.use(ElementPlus);

  // 引入 pinia
  app.use(pinia);

  app.use(router);

  // 引入第三方包
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; i++) {
      app.use(libs[i]);
    }
  }
};
