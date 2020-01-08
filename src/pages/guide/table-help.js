import React from 'react';
import { Link } from 'react-router-dom';
import { Wrap } from '../../components';

export const TableHelp = () => (
  <Wrap>
    <div className='guide-help'>
      <div className='guide-node'>
        <h2 className='help-title help-title-main'>
          <span>创建列表</span>
        </h2>
        <div className='help-content'>
          <p>根据后端提供的API生成支持分页、搜索、排序的数据列表。</p>
        </div>
      </div>
      <div className='guide-node' id='base'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#base'>
            <i className='fas fa-link'></i>
          </a>
          <span>基础配置</span>
        </h2>
        <div className='help-content'>
          <p>
            填写列表基本信息，<code>数据源</code>指数据来源API（支持
            <Link to='/help/general#url-variable'>URL变量</Link>
            ），<code>数据路径</code>根据后端返回的JSON数据结构填写，以此定位列表数据。
          </p>
        </div>
      </div>
      <div className='guide-node' id='field'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#field'>
            <i className='fas fa-link'></i>
          </a>
          <span>列表字段</span>
        </h2>
        <div className='help-content'>
          <p>
            用来定义各列数据，点击<code>+列</code>添加一列，填写API中对应的<code>key</code>
            ，系统据此读取数据，如果后端支持搜索或排序，开发者可按需勾选相应功能。
          </p>
          <blockquote>
            搜索时，系统会在数据接口添加<code>{'{key}={搜索value}'}</code>
            参数；排序时，系统会在数据接口添加<code>{'sort={key}-{asc|desc}'}</code>参数（仅支持单列排序）
          </blockquote>
        </div>
      </div>
      <div className='guide-node' id='handle'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#handle'>
            <i className='fas fa-link'></i>
          </a>
          <span>数据操作</span>
        </h2>
        <div className='help-content'>
          添加数据操作如编辑、删除等，支持内页打开、新窗打开、弹窗浮层、接口请求和
          <Link to='/help/general#exec-script'>执行脚本</Link>，可配置
          <Link to='/help/general#icon-font'>IconFont</Link>
          ，支持
          <Link to='/help/general#url-variable'>URL变量</Link>
          ，变量数据从行数据和页面URL参数中读取，行数据优先级更高。
        </div>
      </div>
      <div className='guide-node' id='extend'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#extend'>
            <i className='fas fa-link'></i>
          </a>
          <span>列表扩展</span>
        </h2>
        <div className='help-content'>
          <p>当配置无法满足需求时，通过JavaScript进行扩展。</p>
          <p>
            1. 修正列数据：声明<code>window._colFix_</code>
            对数据进行修正。
            <br />
            例如某列数据<code>{`{"price": 1500, "img": "http://xx.com/img/123.jpg"}`}</code>
            ，price单位为分，预展示以元为单位的价格并显示图片，按如下方式修正：
          </p>
          <pre>
            {`window._colFix_ = function (key, value, row) {
  switch (key) {
    case 'price':
      return (value / 100) + '元';

    case 'img':
      return '<img src="'+ value +'" width="100" height="80" />'
  }
}`}
          </pre>
          <blockquote>
            可通过<code>switch-case</code>同时修正多列数据，若使用ES6语法，请确保LEGO运行在支持的浏览器中。
          </blockquote>
          <p>
            2. 修正分页数据：声明<code>window._pageFix_</code>对分页数据进行修正并返回<b>数据总数 total</b>和
            <b>分页大小 pageSize</b>。<br />
            例如接口分页数据为：
            <pre>{`{
  "code": 0,
  "data": {
    "pageInfo": {
      "total": 2192,
      "size": 30
    }
  }
}`}</pre>
          </p>
          <p>
            则定义修正方法：
            <pre>
              {`window._pageFix_ = function (data) {
  return {
    total: data.pageInfo.total,
    pageSize: data.pageInfo.size
  }
}`}
            </pre>
          </p>
          若接口分页数据为如下标准结构，则无需修正：
          <pre>{`{
  "code": 0,
  "data": {
    "page": {
      "total": 2192,
      "pageSize": 30
    }
  }
}`}</pre>
        </div>
      </div>
    </div>
  </Wrap>
);
