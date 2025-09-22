module.exports = {
  name: '淘宝',
  desc: '淘宝电商系统',
  homePage: '/todo?proj_key=taobao&key=product',
  menu: [
    {
      key: 'order',
      menuType: 'module',
      moduleType: 'iframe',
      iframeConfig: {
        path: 'https://www.taobao.com/',
      },
    },
    {
      key: 'operating',
      name: '运营管理',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'coupon',
            name: '优惠券',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'limited',
            name: '限量购',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'festival',
            name: '节日活动',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
        ],
      },
    },
  ],
};
