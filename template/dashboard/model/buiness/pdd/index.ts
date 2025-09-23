import { defineDsl } from '../../../../../packages/render/index.ts';
export default defineDsl({
  name: '拼多多',
  desc: '拼多多电商系统',
  homePage: '/todo?proj_key=pdd&key=product',
  menu: [
    {
      key: 'product',
      name: '商品管理(拼多多)',
    },
    {
      key: 'client',
      name: '客户管理(拼多多)',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/product',
      },
    },
    {
      key: 'data',
      name: '数据分析',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'shop-setting',
            name: '店铺设置',
            menuType: 'group',
            subMenu: [
              {
                key: 'info-setting',
                name: '店铺信息配置',
                menuType: 'module',
                moduleType: 'custom',
                customConfig: {
                  path: '/todo',
                },
              },
              {
                key: 'quality-setting',
                name: '店铺资质配置',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                  path: 'http://www.baidu.com',
                },
              },
              {
                key: 'setting-icon',
                name: '标签',
                menuType: 'module',
                moduleType: 'schema',
                schemaConfig: {
                  api: '/api/proj/product',
                  schema: {
                    type: 'object',
                    properties: {
                      product_id: {
                        type: 'string',
                        label: '商品ID',
                        tableOptions: {
                          width: 300,
                          'show-overflow-toolrip': true,
                        },
                      },
                      product_name: {
                        type: 'string',
                        label: '商品名称',
                        tableOptions: {
                          width: 200,
                        },
                      },
                      price: {
                        type: 'number',
                        label: '商品价格',
                        tableOptions: {
                          width: 200,
                        },
                      },
                      inventory: {
                        type: 'number',
                        label: '商品库存',
                        tableOptions: {
                          width: 200,
                        },
                      },
                      create_time: {
                        type: 'string',
                        label: '创建时间',
                        tableOptions: {},
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            key: 'analysis',
            name: '电商罗盘',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'sider-search',
            name: '信息查询',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
              path: 'http://www.baidu.com',
            },
          },
        ],
      },
    },
    {
      key: 'search',
      name: '信息查询',
      menuType: 'module',
      moduleType: 'iframe',
      iframeConfig: {
        path: 'http://www.baidu.com',
      },
    },
  ],
});
