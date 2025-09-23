import { MenuType, ModuleType } from '../../types/DSL'

export default {
  headerMenu: [
    {
      key: 'videoManagement',
      name: '视频管理',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.CUSTOM,
      customConfig: {
        path: '/todo',
      },
    },
    {
      key: 'userManagement', 
      name: '用户管理',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.CUSTOM,
      customConfig: {
        path: '/todo',
      },
    },
  ],
  name: '课程系统',
  description: '课程管理系统',
  homePage: '/dashboard',
  icon: 'dashboard',
  key: 'course',
}
