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
    title: key,
    options: {
      grid_columns: 3
    }
  }),
  boolean: key => ({
    type: 'boolean',
    title: key,
    enum: [true, false],
    options: {
      enum_titles: ['是', '否'],
      grid_columns: 3
    }
  }),
  string: function(key, data) {
    const schema = {};
    schema.type = 'string';
    schema.title = key;
    schema.options = {
      grid_columns: 3
    };

    switch (true) {
      case /\.(jpe?g|png|gif)$/.test(data):
        schema.format = 'upload';
        schema.links = [
          {
            rel: '',
            href: '{{self}}',
            mediaType: 'image'
          }
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
            mediaType: 'video/mp4'
          }
        ];
        break;

      case /^[12]\d{3}-\d{2}-\d{2} [\d:]{8}$/.test(data):
        schema.format = 'datetime';
        break;

      default:
        schema.format = 'text';
        break;
    }
    return schema;
  },
  object: function(key, data) {
    const schema = {};
    schema.title = key;
    schema.type = 'object';
    schema.format = 'grid';
    schema.properties = {};
    for (var k in data) {
      schema.properties[k] = dataHandle[getType(data[k])](k, data[k]);
    }
    return schema;
  },
  array: function(key, data) {
    const schema = {};
    schema.type = 'array';
    schema.title = key;
    schema.items = {};
    if (data[0] !== undefined) {
      schema.items = dataHandle[getType(data[0])](key, data[0]);
    }
    return schema;
  }
};

export default json => {
  try {
    const data = typeof json == 'string' ? JSON.parse(json) : json;
    return dataHandle[getType(data)]('表单标题', data);
  } catch (err) {
    console.warn(err);
    return {
      title: '数据解析出错，请返回重试',
      properties: {}
    };
  }
};
