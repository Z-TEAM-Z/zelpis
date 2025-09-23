
import { MenuType, ModuleType } from '../../../types/DSL'

export default {
  headerMenu: [
    {
      key: 'orderManagement',
      name: '订单管理(iframe)',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.IFRAME,
      iframeConfig: {
        path: 'https://www.taobao.com',
      },
    },
    {
      key: 'operating',
      name: '运营活动',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.SIDEBAR,
      sidebarConfig: {
        menu: [
          {
            key: 'coupon',
            name: '优惠券',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.CUSTOM,
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'activity',
            name: '活动',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.CUSTOM,
            customConfig: {
              path: '/todo',
            },
          },
        ],
      },
    },
  ],
  name: '淘宝',
  description: '淘宝电商系统',
  key: 'taobao',
  homePage: '/schema?projKey=taobao&key=productManagement',
}
