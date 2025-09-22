import { defineStore } from 'pinia';
import { ref } from 'vue';

interface MenuItem {
  [key: string]: any;
  menuType?: string;
  moduleType?: string;
  subMenu?: MenuItem[];
  siderConfig?: {
    menu?: MenuItem[];
  };
}

interface SearchParams {
  key: string;
  value: any;
}

export const useMenuStore = defineStore('menu', () => {
  // 菜单列表
  const menuList = ref<MenuItem[]>([]);
  
  // 设置菜单列表
  const setMenuList = (newMenuList: MenuItem[]) => {
    menuList.value = newMenuList;
  };

  /**
   * 找出菜单目录
   * @param param 搜索参数对象
   * @param param.key 搜索字段
   * @param param.value 搜索值
   * @param mList 要搜索的菜单列表
   * @returns 找到的菜单项或undefined
   */
  const findMenuItem = ({ key, value }: SearchParams, mList: MenuItem[] = menuList.value): MenuItem | undefined => {
    for (let i = 0; i < mList.length; i++) {
      const menuItem = mList[i];

      if (!menuItem) return;

      const { menuType, moduleType } = menuItem;
      if (menuItem[key] === value) {
        return menuItem;
      }
      if (menuType === 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu);
        if (mItem) return mItem;
      }
      if (moduleType === 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu);
        if (mItem) return mItem;
      }
    }
  };

  /**
   * 找出第一个菜单
   * @param mList 菜单列表
   * @returns 第一个菜单项或undefined
   */
  const findFirstMenuItem = (mList: MenuItem[] = menuList.value): MenuItem | undefined => {
    if (!mList || !mList[0]) return;
    let firstMenuItem = mList[0];
    if (firstMenuItem.subMenu) {
      firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu);
    }
    return firstMenuItem;
  };

  return { menuList, setMenuList, findMenuItem, findFirstMenuItem };
});
