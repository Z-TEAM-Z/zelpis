
import { MenuType, ModuleType } from '../../../types/DSL' 

export default {
  headerMenu: [
    {
      key: 'videoManagement',
      name: '视频管理(iframe)',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.IFRAME,
      iframeConfig: {
        path: 'https://www.bilibili.com',
      },
    },
    {
      key: 'courseManagement',
      name: '课程管理',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.SIDEBAR,
      sidebarConfig: {
        menu: [
          {
            key: 'pdf',
            name: 'PDF',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.CUSTOM,
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'doc',
            name: 'DOC',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.IFRAME,
            iframeConfig: {
              path: 'https://www.douyin.com',
            },
          },

        ],
      },
    },
  ],
  name: 'B站课堂',
  description: 'B站课堂课程管理系统',
  key: 'bilibili',
  homePage: `/iframe?projKey=bilibili&key=videoManagement&path=${encodeURI('https://www.bilibili.com')}`,
}
