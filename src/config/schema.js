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
      url: '//mall02.sogoucdn.com/image/2019/03/08/20190308130338_4522.jpg'
    }
  ]
};
export const createForm = {
  title: '创建表单',
  type: 'object',
  format: 'grid',
  properties: {
    name: {
      title: '表单名称',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 2
      }
    },
    api: {
      title: '提交接口',
      description: '提交格式为 data: {JSONString}',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 5
      }
    },
    origin: {
      title: '数据接口',
      description: '编辑页数据接口，支持自定义参数（选填）',
      type: 'string',
      options: {
        inputAttributes: {
          placeholder: '如 /detail/?id={{id}}&state={{state}}'
        },
        grid_columns: 5
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

// 全局配置
const uploadFnDemo = `/**
 * 实现 window.FileUploader
 * 
 * file 文件对象
 * cbs 定义回调
 * 
 * cbs.progress: 更新进度, int, 值为0-100（success时自动设为100）
 * cbs.fail: 失败回调, string, 值为失败说明
 * cbs.success: 成功回调, string, 值为文件URL
 */
window.FileUploader = function (file, cbs) {
  setTimeout(() => {
    cbs.progress(30);
  }, 500);

  setTimeout(() => {
    cbs.success('//www.sogo.com/web/index/images/logo_440x140.v.4.png');
  }, 2e3);
};`;
const sideMenu = `[
  {
    "name": "一级菜单",
    "url": "/v1/link/",
    "icon": "gift"
  },
  {
    "name": "一级菜单",
    "url": "/v1/link/",
    "sub": [
      {
        "name": "二级菜单",
        "url": "/v2/link/"
      }
    ]
  }
]`;
export const setting = {
  title: '全局配置',
  type: 'object',
  format: 'grid',
  properties: {
    name: {
      title: '系统名称',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 5
      }
    },
    baseUrl: {
      title: '接口前缀',
      type: 'string',
      minLength: 1,
      options: {
        grid_columns: 7,
        inputAttributes: {
          placeholder: '如 https:/domain.com/api/ 或 /api/'
        }
      }
    },
    sideMenu: {
      title: '左侧菜单配置',
      type: 'string',
      format: 'json',
      default: sideMenu,
      options: {
        grid_columns: 12
      }
    },
    uploadFn: {
      title: '上传方法实现',
      type: 'string',
      format: 'javascript',
      default: uploadFnDemo,
      options: {
        grid_columns: 12
      }
    }
  }
};
