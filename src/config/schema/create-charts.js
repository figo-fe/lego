export const createCharts = {
  title: '创建图表',
  type: 'object',
  format: 'grid',
  options: {
    disable_collapse: true,
  },
  properties: {
    name: {
      title: '名称',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    theme: {
      title: '颜色主题',
      type: 'string',
      format: 'choices',
      enum: ['default', 'light', 'dart'],
      options: {
        grid_columns: 3,
        choices_options: {
          searchEnabled: false,
        },
      },
    },
    desc: {
      title: '备注',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    list: {
      title: '图表集',
      type: 'array',
      format: 'tabs-top',
      options: {
        disable_collapse: true,
      },
      items: {
        title: '图表',
        type: 'object',
        format: 'grid',
        headerTemplate: '{{self.name}}',
        properties: {
          name: {
            type: 'string',
            title: '名称',
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
          xAxis: {
            type: 'string',
            title: '横坐标',
            options: {
              inputAttributes: {
                placeholder: '填写path取值或用逗号分隔',
              },
              grid_columns: 3,
            },
          },
          refresh: {
            type: 'number',
            title: '定时刷新(秒)',
            enum: [0, 5, 15, 30, 60],
            options: {
              grid_columns: 3,
              choices_options: {
                searchEnabled: false,
              },
            },
          },
          grid: {
            type: 'number',
            format: 'number',
            title: 'Grid',
            default: 6,
            options: {
              grid_columns: 3,
            },
          },
          height: {
            type: 'number',
            format: 'number',
            title: '高度',
            default: 200,
            options: {
              grid_columns: 3,
            },
          },
          toolbox: {
            title: '工具栏',
            type: 'array',
            format: 'select',
            items: {
              type: 'string',
              enum: ['saveAsImage', 'restore', 'dataZoom', 'magicType'],
              enum_titles: ['1', '2', '3', '4'],
            },
            enum_titles: [1, 2, 3, 4],
            options: {
              grid_columns: 6,
            },
          },
          series: {
            type: 'array',
            format: 'table',
            title: '系列',
            options: {
              disable_collapse: true,
            },
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: '名称',
                  options: {
                    input_width: '150px',
                  },
                },
                path: {
                  type: 'string',
                  title: '路径',
                  options: {
                    inputAttributes: {
                      placeholder: '如 data.series.pv',
                    },
                  },
                },
                type: {
                  type: 'string',
                  title: '类型',
                  enum: ['bar', 'line', 'pie'],
                  options: {
                    enum_titles: ['折线图', '柱状图', '饼状图'],
                    input_width: '160px',
                    choices_options: {
                      searchEnabled: false,
                    },
                  },
                },
                color: {
                  type: 'string',
                  title: '颜色（可选）',
                  options: {
                    input_width: '150px',
                    inputAttributes: {
                      placeholder: '如 #d48265',
                    },
                  },
                },
                label: {
                  type: 'boolean',
                  title: '显示数值',
                  enum: [true, false],
                  options: {
                    enum_titles: ['显示', '隐藏'],
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
