
import { MenuType, ModuleType } from '../../../types/DSL'

export default {
  headerMenu: [
    {
      key: 'productManagement',
      name: '商品管理(iframe)',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.IFRAME,
      iframeConfig: {
        path: 'https://www.pinduoduo.com',
      },
    },
    {
      key: 'analysis',
      name: '数据分析',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.SIDEBAR,
      sidebarConfig: {
        menu: [
          {
            key: 'overview',
            name: '总览',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.CUSTOM,
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'thirdParty',
            name: '第三方',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.IFRAME,
            iframeConfig: {
              path: 'https://www.jd.com',
            },
          },
        ],
      },
    },
  ],
  name: '拼多多',
  key: 'pdd',
  description: '拼多多电商系统',
  homePage: '/schema?projKey=pdd&key=productManagement',
}
