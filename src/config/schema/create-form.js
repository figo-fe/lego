// 创建表单
export const formJsonDemo = {
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
  title: '表单配置',
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
      title: '提交API',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 3,
      },
    },
    origin: {
      title: '数据API',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    desc: {
      title: '表单备注',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    ext: {
      title: '表单扩展',
      type: 'string',
      format: 'javascript',
      options: {
        grid_columns: 12,
      },
    },
  },
};
