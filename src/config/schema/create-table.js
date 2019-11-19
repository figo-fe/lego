export const createTable = {
  title: '创建列表',
  type: 'object',
  format: 'grid',
  options: {
    disable_collapse: true,
  },
  properties: {
    base: {
      type: 'object',
      title: '基础配置',
      format: 'grid',
      properties: {
        name: {
          title: '名称',
          type: 'string',
          options: {
            grid_columns: 3,
          },
        },
        api: {
          type: 'string',
          title: '数据源',
          options: {
            grid_columns: 3,
          },
        },
        path: {
          type: 'string',
          title: '数据路径',
          default: 'data.list',
          options: {
            grid_columns: 3,
          },
        },
        desc: {
          title: '备注',
          type: 'string',
          options: {
            grid_columns: 3,
          },
        },
      },
    },
    cols: {
      type: 'array',
      title: '列表字段',
      format: 'table',
      options: {
        collapsed: true,
      },
      items: {
        title: '列',
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          name: {
            title: '名称',
            type: 'string',
          },
          width: {
            title: '列宽（为空时自适应）',
            type: 'string',
          },
          fn: {
            title: '功能',
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['search', 'sort'],
              options: {
                enum_titles: ['搜索', '排序'],
              },
            },
          },
        },
      },
    },
    handles: {
      title: '数据操作',
      type: 'array',
      format: 'table',
      options: {
        collapsed: true,
      },
      items: {
        type: 'object',
        properties: {
          name: {
            title: '名称',
            type: 'string',
          },
          icon: {
            title: '图标（选填）',
            type: 'string',
          },
          url: {
            title: 'URL',
            type: 'string',
          },
          action: {
            title: '行为',
            type: 'string',
            enum: ['open', 'api'],
            options: {
              enum_titles: ['新窗打开', '接口请求'],
            },
          },
        },
      },
    },
  },
};
