import React from 'react';
import { Wrap } from '../../components';
import { Link } from 'react-router-dom';

export const SettingHelp = () => (
  <Wrap>
    <div className='guide-help'>
      <div className='guide-node'>
        <h2 className='help-title help-title-main'>
          <span>系统设置</span>
        </h2>
        <div className='help-content'>
          <p>设置系统名称、运行模式、权限、菜单等基础配置</p>
          <ul>
            <li>
              <label>系统名称</label>
              <p>必填，后台系统的名称，显示在左侧菜单和页面标题处</p>
            </li>
            <li>
              <label>接口前缀</label>
              <p>可选，填写此值后，配置模块接口时如果是相对地址，系统会自动以此为前缀进行拼接。</p>
            </li>
            <li>
              <label>权限/菜单接口</label>
              <p>
                可选，填写后可根据接口返回值定制左侧菜单、控制LEGO编辑权限，定制方法见「权限/菜单配置」部分。通过配置根目录
                <code>.env</code>可实现登录态校验和登录功能。
              </p>
            </li>
            <li>
              <label>运行模式</label>
              <p>独立模式会显示左侧菜单，嵌入模式仅显示主内容区域，当作为iframe嵌入到其他页面时自动切换为嵌入模式。</p>
            </li>
            <li>
              <label>权限/菜单配置</label>
              <ul>
                <li>
                  <p>未配置权限/接口菜单时，直接配置菜单内容，格式如下：</p>
                  <pre>{`[
  {
    "name": "一级菜单",
    "url": "/v1/link/",
    "icon": "gift"
  },
  {
    "name": "一级菜单",
    "sub": [
      {
        "name": "二级菜单",
        "url": "/v2/link/"
      }
    ]
  }
]`}</pre>
                </li>
                <li>
                  <p>
                    当配置权限/接口菜单时，通过定义<code>main</code>函数定制权限和菜单，见示例：
                  </p>
                  <pre>{`function main(data) {
  // data为权限接口返回数据
  if (data.condition1) {
    return {
      admin: true, // 是否为管理员，管理员可对LEGO进行编辑，默认为false
      menu: [] // 格式同上
    }
  } else {
    return {
      admin: false,
      menu: [] // 格式同上
    }
  }
}`}</pre>
                </li>
              </ul>
            </li>
            <li>
              <label>上传方法</label>
              <p>
                见<Link to='/help/general#file-upload'>通用说明-文件上传</Link>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Wrap>
);
