import React from 'react';
import { Link } from 'react-router-dom';

export const TableHelp = () => (
  <div className='guide-main'>
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
            <Link to='/htm/help/general#url-variable'>URL变量</Link>
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
          添加数据操作如编辑、删除等，支持新窗打开或接口请求，可配置
          <Link to='/htm/help/general#icon-font'>IconFont</Link>
          ，支持
          <Link to='/htm/help/general#url-variable'>URL变量</Link>，变量数据从行数据和页面URL参数中读取。
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
            修正列数据：声明<code>{'window.__colFix__ = function(key, value){ return value }'}</code>
            对列数据进行修正使其满足要求。
          </p>
          <blockquote>
            <p>
              例如某列的key=price，value=1500（单位分），以<b>价格（元）</b>为列展示，按以下方式配置：
            </p>
            <pre>
              {`window.__colFix__ = function (key, value) {
  switch (key) {
    case 'price':
      return value / 100;

    default:
      return value;
  }
}`}
            </pre>
            <p>
              可同时修正多列数据，注意<b>必须保留default分支</b>，否则数据无法正常显示。
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
);
