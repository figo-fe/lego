import React from 'react';
// import { Link } from 'react-router-dom';

export const GeneralDesc = () => (
  <div className='guide-main'>
    <div className='guide-help'>
      <div className='guide-node'>
        <h2 className='help-title help-title-main'>
          <span>通用说明</span>
        </h2>
        <div className='help-content'>
          <p>对系统通用功能和模块做统一说明，帮助开发者更好的理解和使用LEGO。</p>
        </div>
      </div>
      <div className='guide-node' id='json-schema'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#json-schema'>
            <i className='fas fa-link'></i>
          </a>
          <span>JSON-Schema</span>
        </h2>
        <div className='help-content'>
          <p>
            要了解<code>JSON Schema</code>是什么，我们首先要了解<code>JSON</code>是什么。JSON（JavaScript Object
            Notation）是一种简单的互联网数据交换格式。JSON基于JavaScript而来，它已被证明足够有用且足够简单，现在也被用于许多其他不涉及互联网数据交换的环境中。
            <b>JSON-Schema是描述JSON数据结构的声明格式</b>
            ，它本身也是用JSON编写的，可以为JSON数据提供清晰、严谨的声明，并可用于数据验证，保证数据交换的正确性。关于JSON-Schema更多内容，请查阅官网
            <a href='https://json-schema.org/' target='_blank' rel='noopener noreferrer'>
              https://json-schema.org/
            </a>
          </p>
        </div>
      </div>
      <div className='guide-node' id='url-variable'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#url-variable'>
            <i className='fas fa-link'></i>
          </a>
          <span>URL变量</span>
        </h2>
        <div className='help-content'>
          <p>
            URL变量是一种定制URL参数的方式，用在表单提交、表单回填、列表数据等模块。开发者根据需要提供带变量的URL，实现对API的定制，系统中大部分API都支持URL变量。
          </p>
          <p>
            格式如：<code>{'https://example.com/api/{{model}}/?id={{orderid}}&state={{state}}'}</code>，变量
            <code>{'{{key}}'}</code>会被替换为当前页面URL中同名参数的值，若找不到对应参数则替换为空。例如当前页URL为
            https://lego.com/htm/form/use/1?orderid=123&model=order，则API被替换为
            {'https://example.com/api/order/?id=123&state='}
          </p>
        </div>
      </div>
      <div className='guide-node' id='file-upload'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#file-upload'>
            <i className='fas fa-link'></i>
          </a>
          <span>文件上传</span>
        </h2>
        <div className='help-content'>
          <p>
            全局默认使用「系统设置-上传方法」上传文件或图片，开发者根据后端提供的上传接口实现
            <code>window.FileUploader</code>，通过<code>file</code>获取文件对象完成上传，通过<code>cbs</code>
            回调上传结果，将文件URI回传给LEGO。
          </p>
        </div>
      </div>
      <div className='guide-node' id='icon-font'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#icon-font'>
            <i className='fas fa-link'></i>
          </a>
          <span>IconFont</span>
        </h2>
        <div className='help-content'>
          <p>
            系统内置1500+
            <a href='https://fontawesome.com/icons?d=gallery&m=free' target='_blank' rel='noopener noreferrer'>
              Font Awesome
            </a>
            字体图标，可在「系统设置-左侧菜单」、「列表配置-数据操作」直接填写图标名称进行配置。
          </p>
        </div>
      </div>
    </div>
  </div>
);
