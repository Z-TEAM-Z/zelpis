
import { MenuType, ModuleType } from '../../../types/DSL'

export default {
  headerMenu: [
    {
      key: 'traffic',
      name: '流量分析',
      menuType: MenuType.MODULE,
      moduleType: ModuleType.SIDEBAR,
      sidebarConfig: {
        menu: [
          {
            key: 'userTraffic',
            name: '用户流量',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.CUSTOM,
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'botTraffic',
            name: '机器人流量',
            menuType: MenuType.MODULE,
            moduleType: ModuleType.IFRAME,
            iframeConfig: {
              path: 'https://www.douyin.com',
            },
          },
          {
            key: 'otherTraffic',
            name: '其他流量',
            menuType: MenuType.GROUP,
            moduleType: ModuleType.IFRAME,
            children: [
              {
                key: 'otherTraffic1',
                name: '其他流量1',
                menuType: MenuType.MODULE,
                moduleType: ModuleType.SCHEMA,
                schemaConfig: {
                  componentConfig: {

                  },
                  api: 'https://www.jd.com',
                  tableConfig: {
                    headerButtons: [],
                    rowButtons: [],
                  },
                  searchConfig: {

                  },
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', label: '名称', },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    },
    {
      key: 'groupManagement',
      name: '分组管理',
      menuType: MenuType.GROUP,
      moduleType: ModuleType.IFRAME,
      children: [
        {
          key: 'userGroup',
          name: '用户分组',
          menuType: MenuType.MODULE,
          moduleType: ModuleType.SCHEMA,
          schemaConfig: {
            componentConfig: {

            },
            api: 'https://www.douyin.com',
            tableConfig: {
              headerButtons: [],
              rowButtons: [],
            },
            searchConfig: {

            },
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', label: '名称', tableOption: {
                  className: 'text-red-500',
                }, },
                age: { type: 'number', label: '年龄', },
              },
            },
          },
        },
        {
          key: 'botGroup',
          name: '机器人分组',
          menuType: MenuType.MODULE,
          moduleType: ModuleType.IFRAME,
          iframeConfig: {
            path: 'https://www.jd.com',
          },
        },
        {
          key: 'otherGroup',
          name: '其他分组',
          menuType: MenuType.GROUP,
          moduleType: ModuleType.IFRAME,
          children: [
            {
              key: 'otherGroup1',
              name: '其他分组1',
              menuType: MenuType.MODULE,
              moduleType: ModuleType.IFRAME,
              iframeConfig: {
                path: 'https://www.jd.com',
              },
            },
            {
              key: 'otherGroup2',
              name: '其他分组2',
              menuType: MenuType.MODULE,
              moduleType: ModuleType.IFRAME,
              iframeConfig: {
                path: 'https://www.jd.com',
              },
            },
          ],
        },
      ],
    },
  ],
  name: '抖音课堂',
  description: '抖音课堂课程管理系统',
  key: 'douyin',
  homePage: '/schema?projKey=douyin&key=userGroup',
} 
