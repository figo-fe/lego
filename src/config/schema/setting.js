// 系统设置
export const setting = {
  title: '系统设置',
  type: 'object',
  format: 'grid',
  properties: {
    name: {
      title: '系统名称',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 3,
      },
    },
    baseUrl: {
      title: '接口前缀',
      type: 'string',
      options: {
        grid_columns: 3,
        inputAttributes: {
          placeholder: '如 https:/domain.com/api/ 或 /api/',
        },
      },
    },
    permissionApi: {
      title: '权限/菜单接口',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    homeUrl: {
      title: '首页URL',
      type: 'string',
      options: {
        grid_columns: 3,
      },
    },
    sideMenu: {
      title: '权限/菜单配置',
      type: 'string',
      format: 'javascript',
      options: {
        grid_columns: 12,
      },
    },
    uploadFn: {
      title: '上传方法',
      type: 'string',
      format: 'javascript',
      options: {
        grid_columns: 12,
      },
    },
  },
};
