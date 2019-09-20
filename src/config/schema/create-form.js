// 创建表单
const jsonDemo = {
  shop: '搜狗自营',
  name: '搜狗翻译笔',
  desc: '高清录音 语音转文字 同声传译 录音速记 微型便携',
  show: true,
  price: 398,
  cate: '智能产品',
  time: '2019-08-01 18:26:42',
  state: '未开售',
  imgs: [
    {
      name: '翻译宝',
      desc: '高清录音 语音转文字',
      color: '蓝色',
      url: '//mall02.sogoucdn.com/image/2019/03/08/20190308130338_4522.jpg',
    },
  ],
};
export const createForm = {
  title: '创建表单',
  type: 'object',
  format: 'grid',
  options: {
    disable_collapse: true,
  },
  properties: {
    name: {
      title: '表单名称',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 3,
      },
    },
    api: {
      title: '提交接口',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 3,
      },
    },
    origin: {
      title: '数据源',
      type: 'string',
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
    json: {
      title: '数据示例',
      description: '请填写数据示例，系统根据数据结构自动生成schema',
      type: 'string',
      format: 'json',
      default: JSON.stringify(jsonDemo, null, 2),
      options: {
        grid_columns: 12,
      },
    },
  },
};
