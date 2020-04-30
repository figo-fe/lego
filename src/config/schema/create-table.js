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
          minLength: 1,
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
      minItems: 1,
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
          fmt: {
            title: '格式化',
            type: 'string',
            enum: ['none', 'image', 'datetime', 'date', 'time', 'cny', 'audio', 'video'],
            options: {
              input_width: '120px',
            },
          },
          width: {
            title: '列宽（为空时自适应）',
            type: 'string',
          },
          fn: {
            title: '功能',
            type: 'array',
            format: 'choices',
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['search', 'sort', 'multi'],
              options: {
                enum_titles: ['搜索', '排序', '多选'],
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
            enum: ['link', 'open', 'popup', 'api', 'script'],
            options: {
              enum_titles: ['内页打开', '新窗打开', '弹窗浮层', '接口请求', '执行脚本'],
              input_width: '180px',
            },
          },
        },
      },
    },
    toolbar: {
      type: 'array',
      title: '工具栏配置',
      format: 'tabs-top',
      options: {
        collapsed: true,
      },
      items: {
        type: 'object',
        format: 'grid',
        headerTemplate: '{{ self.name }}',
        properties: {
          type: {
            title: '类型',
            type: 'string',
            enum: ['input', 'choices', 'datepicker', 'button', 'custom', 'break'],
            options: {
              enum_titles: ['输入框', '下拉框', '时间选择', '按钮', '自定义', '换行'],
              grid_columns: 3,
            },
          },
          name: {
            title: '名称',
            type: 'string',
            options: {
              grid_columns: 3,
            },
          },
          key: {
            title: 'Key（必填且不能重复）',
            description: '查询字段以"search_"开头',
            type: 'string',
            minLength: 1,
            options: {
              grid_columns: 3,
            },
          },
          width: {
            title: '宽度（为空时自适应）',
            type: 'string',
            default: '',
            options: {
              grid_columns: 3,
            },
          },
          choices_opts: {
            title: '配置',
            type: 'object',
            format: 'grid',
            options: {
              disable_collapse: true,
              grid_columns: 12,
              dependencies: {
                type: 'choices',
              },
            },
            properties: {
              source_type: {
                title: '数据源类型',
                type: 'string',
                enum: ['list', 'api'],
                options: {
                  enum_titles: ['固定列表', '接口读取'],
                  grid_columns: 4,
                },
              },
              source_data: {
                title: '数据内容',
                description: '「固定列表」以多组value:display分号隔开，「接口读取」填写函数名（见帮助）',
                type: 'string',
                options: {
                  grid_columns: 8,
                },
              },
            },
          },
          datepicker_opts: {
            title: '配置',
            type: 'object',
            format: 'grid',
            options: {
              disable_collapse: true,
              grid_columns: 12,
              dependencies: {
                type: 'datepicker',
              },
            },
            properties: {
              mode: {
                title: '模式',
                type: 'string',
                enum: ['single', 'range'],
              },
              showtime: {
                title: '选择时间',
                type: 'boolean',
              },
              format: {
                title: '格式化（Y-m-d H:i:S）',
                type: 'string',
                default: 'Y-m-d',
              },
            },
          },
          button_opts: {
            title: '配置',
            type: 'object',
            format: 'grid',
            options: {
              disable_collapse: true,
              dependencies: {
                type: 'button',
              },
            },
            properties: {
              style: {
                title: '风格',
                type: 'string',
                enum: [
                  'primary',
                  'info',
                  'success',
                  'danger',
                  'outline-primary',
                  'outline-info',
                  'outline-success',
                  'outline-danger',
                ],
                options: {
                  grid_columns: 3,
                },
              },
              url: {
                title: 'URL',
                type: 'string',
                options: {
                  grid_columns: 3,
                },
              },
              icon: {
                title: '图标（选填）',
                type: 'string',
                options: {
                  grid_columns: 3,
                },
              },
              action: {
                title: '行为',
                type: 'string',
                enum: ['link', 'open', 'popup', 'api', 'script'],
                options: {
                  enum_titles: ['内页打开', '新窗打开', '弹窗浮层', '接口请求', '执行脚本'],
                  grid_columns: 3,
                },
              },
            },
          },
          custom_opts: {
            title: '配置',
            type: 'object',
            format: 'grid',
            options: {
              disable_collapse: true,
              dependencies: {
                type: 'custom',
              },
            },
            properties: {
              html: {
                title: 'HTML',
                type: 'string',
                format: 'textarea',
                options: {
                  grid_columns: 12,
                },
              },
            },
          },
        },
      },
    },
  },
};
