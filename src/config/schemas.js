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
      default: '{"img":"//www.baidu.com/img/baidu_resultlogo@2.png"}',
      options: {
        grid_columns: 12
      }
    }
  }
};
