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
      url: '//mall02.sogoucdn.com/image/2019/03/08/20190308130338_4522.jpg'
    }
  ]
};
export const createForm = {
  title: '填写表单配置',
  type: 'object',
  format: 'grid',
  properties: {
    method: {
      title: 'Method',
      type: 'string',
      enum: ['POST', 'GET'],
      options: {
        grid_columns: 2
      }
    },
    api: {
      title: 'API',
      type: 'string',
      options: {
        grid_columns: 10
      }
    },
    json: {
      title: '数据示例',
      description: '请填写数据示例，系统根据数据结构生成schema',
      type: 'string',
      format: 'json',
      default: JSON.stringify(jsonDemo, null, 4),
      options: {
        grid_columns: 12
      }
    }
  }
};
