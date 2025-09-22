module.exports = {
  model: 'dashboard',
  name: '电商系统',
  menu: [
    {
      key: 'product',
      name: '商品管理',
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
              editFormOptions: {
                comType: 'input',
                disabled: true,
              },
              detailPanelOptions: {},
            },
            product_name: {
              type: 'string',
              label: '商品名称',
              maxLength: 10,
              minLength: 3,
              tableOptions: {
                width: 200,
              },
              // searchOptions: {
              //   comType: 'dynamicSelect',
              //   api: '/api/proj/product_enum/list',
              // },
              createFormOptions: {
                comType: 'input',
                default: '测试新增',
              },
              editFormOptions: {
                comType: 'input',
              },
              detailPanelOptions: {},
            },
            price: {
              type: 'number',
              label: '商品价格',
              maximum: 1000,
              minimum: 30,
              tableOptions: {
                width: 200,
              },
              searchOptions: {
                comType: 'select',
                enumList: [
                  {
                    label: '全部',
                    value: -1,
                  },
                  {
                    label: '0-40',
                    value: 40,
                  },
                  {
                    label: '40-140',
                    value: 140,
                  },
                  {
                    label: '10-340',
                    value: 340,
                  },
                ],
              },
              createFormOptions: {
                comType: 'inputNumber',
              },
              editFormOptions: {
                comType: 'inputNumber',
              },
              detailPanelOptions: {},
            },
            inventory: {
              type: 'number',
              label: '商品库存',
              tableOptions: {
                width: 200,
              },
              searchOptions: {
                comType: 'input',
              },
              createFormOptions: {
                comType: 'select',
                enumList: [
                  {
                    label: '100',
                    value: 100,
                  },
                  {
                    label: '1000',
                    value: 1000,
                  },
                  {
                    label: '10000',
                    value: 10000,
                  },
                ],
              },
              editFormOptions: {
                comType: 'inputNumber',
              },
              detailPanelOptions: {},
            },
            create_time: {
              type: 'string',
              label: '创建时间',
              tableOptions: {},
              searchOptions: {
                comType: 'dateRange',
              },
              detailPanelOptions: {},
            },
            required: ['product_name'],
          },
        },
        tableConfig: {
          headerButtons: [
            {
              label: '新增商品',
              eventKey: 'showComponent',
              eventOptions: {
                comName: 'createForm',
              },
              type: 'primary',
              plain: true,
            },
          ],
          rowButtons: [
            {
              label: '查看详情',
              eventKey: 'showComponent',
              eventOptions: {
                comName: 'detailPanel',
              },
            },
            {
              label: '修改',
              eventKey: 'showComponent',
              eventOptions: {
                comName: 'editForm',
              },
            },
            {
              label: '删除',
              eventKey: 'remove',
              type: 'danger',
              eventOptions: {
                params: {
                  product_id: 'schema::product_id',
                },
              },
            },
          ],
        },
        componentConfig: {
          createForm: {
            title: '新增商品',
            saveBtnText: '保存商品',
          },
          editForm: {
            mainKey: 'product_id',
            title: '修改商品',
            saveBtnText: '修改商品',
          },
          detailPanel: {
            mainKey: 'product_id',
            title: '商品详情',
          },
        },
      },
    },
    {
      key: 'order',
      name: '订单管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
    {
      key: 'client',
      name: '客户管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
  ],
};
