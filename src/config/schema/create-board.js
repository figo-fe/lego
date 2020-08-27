export const createBoard = {
  title: '创建面板',
  type: 'object',
  format: 'grid',
  options: {
    disable_collapse: true,
  },
  properties: {
    name: {
      title: '名称',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 4,
      },
    },
    mode: {
      title: '样式',
      type: 'string',
      enum: ['tiled', 'tab'],
      options: {
        enum_titles: ['平铺区块', '标签切换'],
        grid_columns: 4,
      },
    },
    desc: {
      title: '备注',
      type: 'string',
      options: {
        grid_columns: 4,
      },
    },
    list: {
      title: '区块列表',
      type: 'array',
      format: 'tabs-top',
      minItems: 1,
      options: {
        disable_collapse: true,
      },
      items: {
        type: 'object',
        title: '区块',
        format: 'grid',
        headerTemplate: '{{ self.name }}',
        properties: {
          name: {
            type: 'string',
            title: '区块名称',
            options: {
              grid_columns: 6,
            },
          },
          height: {
            type: 'number',
            title: '高度',
            default: 400,
            options: {
              grid_columns: 6,
            },
          },
          mods: {
            type: 'array',
            title: '模块列表',
            format: 'table',
            items: {
              title: '模块',
              type: 'object',
              properties: {
                module: {
                  type: 'string',
                  title: '模块URL',
                },
                grid: {
                  type: 'number',
                  title: 'Grid',
                  enum: [3, 4, 6, 8, 12],
                  options: {
                    input_width: '150px',
                  },
                },
                height: {
                  type: 'number',
                  title: '高度（单位px）',
                  options: {
                    input_width: '150px',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
