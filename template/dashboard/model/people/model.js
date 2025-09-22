module.exports = {
  model: 'people',
  name: '人员管理系统',
  menu: [
    {
      key: 'user',
      name: '人员管理',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/people/user',
        schema: {
          type: 'Object',
          properties: {
            user_id: {
              type: 'string',
              label: '用户ID',
              tableOptions: {
                width: 350,
                'show-overflow-tooltips': true,
              },
              detailPanelOptions: {},
            },
            username: {
              type: 'string',
              label: '账号',
              tableOptions: {
                width: 200,
              },
              searchOptions: {
                comType: 'input',
              },
              createFormOptions: {
                comType: 'input',
              },
              detailPanelOptions: {},
            },
            password: {
              type: 'string',
              label: '密码',
              detailPanelOptions: {},
            },
            nickname: {
              type: 'string',
              label: '昵称',
              tableOptions: {
                width: 200,
              },
              searchOptions: {
                comType: 'input',
              },
              createFormOptions: {
                comType: 'input',
              },
              editFormOptions: {
                comType: 'input',
              },
              detailPanelOptions: {},
            },
            desc: {
              type: 'string',
              label: '描述',
              createFormOptions: {
                comType: 'textarea',
              },
              editFormOptions: {
                comType: 'textarea',
              },
              detailPanelOptions: {},
            },
            sex: {
              type: 'number',
              label: '性别',
              tableOptions: {
                width: 150,
              },
              searchOptions: {
                comType: 'select',
                enumList: [
                  {
                    label: '全部',
                    value: -999,
                  },
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 2,
                  },
                ],
              },
              createFormOptions: {
                comType: 'select',
                enumList: [
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 2,
                  },
                ],
              },
              editFormOptions: {
                comType: 'select',
                enumList: [
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 2,
                  },
                ],
              },
            },
            create_time: {
              type: 'string',
              label: '创建时间',
              tableOptions: {},
              searchOptions: {
                comType: 'dateRange',
              },
            },
          },
          required: ['sex', 'username', 'nickname'],
        },
        tableConfig: {
          headerButtons: [
            {
              label: '新增用户',
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
              type: 'primary',
            },
            {
              label: '修改',
              eventKey: 'showComponent',
              eventOptions: {
                comName: 'editForm',
              },
              type: 'warning',
            },
            {
              label: '删除',
              eventKey: 'remove',
              eventOptions: {
                params: {
                  user_id: 'schema::user_id',
                },
              },
              type: 'danger',
            },
          ],
        },
        componentConfig: {
          createForm: {
            title: '新增用户',
            saveBtnText: '保存',
          },
          editForm: {
            mainKey: 'user_id',
            title: '修改用户',
            saveBtnText: '保存',
          },
          detailPanel: {
            mainKey: 'user_id',
            title: '用户详情',
          },
        },
      },
    },
  ],
};
