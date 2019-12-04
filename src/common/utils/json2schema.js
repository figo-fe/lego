const dict = {
  '(name)': '名称',
  '(desc)': '描述',
  '(cate)': '分类',
  '(shop)': '商家',
  '(show)': '显示',
  '(price|sale)': '价格',
  '(url|link)': '链接',
  '(product)': '商品',
  '(hot)': '热度',
  '(order)': '排序',
  '(image|img|pic)': '图片',
  '(state|status)': '状态',
  '(start)': '开始时间',
  '(end)': '结束时间',
  '(time|datetime)': '时间',
  '(date)': '日期',
  '(range)': '范围',
  '(focus)': '焦点图',
  '(comment)': '评论',
  '(num)': '数量',
  '(color)': '颜色',
  '(game)': '游戏',
  '(pay|buy)': '支付',
  '(amt|amount)': '金额',
  '(detail)': '详情',
  '(click)': '点击',
  '(rank)': '排行',
};
const getTitle = key => {
  for (var rule in dict) {
    if (new RegExp(rule, 'i').test(key)) {
      return dict[rule];
    }
  }
  return key;
};
const getType = function(data) {
  if (typeof data == 'object') {
    return toString.call(data) === '[object Array]' ? 'array' : 'object';
  } else {
    return typeof data;
  }
};
const dataHandle = {
  number: key => ({
    type: 'number',
    format: 'number',
    title: getTitle(key),
    options: {
      grid_columns: 3,
    },
  }),
  boolean: key => ({
    type: 'boolean',
    title: getTitle(key),
    options: {
      grid_columns: 3,
    },
  }),
  string: function(key, data) {
    const schema = {};
    schema.type = 'string';
    schema.title = getTitle(key);
    schema.format = 'text';
    schema.options = {
      grid_columns: 3,
    };

    switch (true) {
      case /\.(jpe?g|png|gif)$/.test(data):
        schema.format = 'upload';
        schema.links = [
          {
            rel: '',
            href: '{{self}}',
            mediaType: 'image',
          },
        ];
        break;

      case /\.(exe|swf|zip|rar|docx?|pptx?|xlsx?)$/.test(data):
        schema.format = 'upload';
        schema.download = true;
        break;

      case /\.mp4$/.test(data):
        schema.format = 'upload';
        schema.links = [
          {
            rel: '',
            href: '{{self}}',
            mediaType: 'video/mp4',
          },
        ];
        break;

      case /^[12]\d{3}-\d{2}-\d{2} [\d:]{8}$/.test(data):
        schema.format = 'datetime-local';
        schema.options.flatpickr = {
          wrap: true,
          showClearButton: true,
          time_24hr: true,
          allowInput: false,
        };
        break;

      default:
        schema.format = 'text';
        break;
    }
    return schema;
  },
  object: function(key, data, opts = {}) {
    const schema = {};
    schema.title = getTitle(key);
    schema.type = 'object';
    schema.format = 'grid';
    schema.properties = {};
    schema.options = opts;
    for (var k in data) {
      schema.properties[k] = dataHandle[getType(data[k])](k, data[k]);
    }
    return schema;
  },
  array: function(key, data, opts = {}) {
    const schema = {};
    schema.type = 'array';
    schema.title = getTitle(key);
    schema.items = {};
    schema.options = opts;
    if (data[0] !== undefined) {
      schema.items = dataHandle[getType(data[0])](key, data[0]);
    }
    return schema;
  },
};

export default (json, name = '表单标题') => {
  try {
    const data = typeof json == 'string' ? JSON.parse(json) : json;
    return dataHandle[getType(data)](name, data, { disable_collapse: true });
  } catch (err) {
    console.warn(err);
    return {
      title: '数据解析出错，请返回重试',
      properties: {},
    };
  }
};
