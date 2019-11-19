import React from 'react';
import { Link } from 'react-router-dom';
import './guide.scss';

export const GuideHome = () => (
  <div className='guide-main'>
    <div className='guide-home'>
      <h1>使用LEGO快速搭建后台</h1>
      <div className='subtitle'>LEGO拥有丰富的内建模块，可在数分钟内搭建强大的后台界面</div>
      <div className='entry'>
        <Link to='/htm/form/create' className='item'>
          <p>
            <i className='fas fa-list-alt'></i>
          </p>
          <h2>创建表单</h2>
          <p className='desc'>以JSON数据为模型自动创建表单，支持日期、上传、编辑器等多种表单模型</p>
        </Link>
        <Link to='/htm/table/create' className='item'>
          <p>
            <i className='fas fa-border-all'></i>
          </p>
          <h2>创建列表</h2>
          <p className='desc'>提供API和表头，一键生成列表页，支持字段排序、搜索、分页等列表常用功能</p>
        </Link>
        <div className='item'>
          <p>
            <i className='fas fa-signal'></i>
          </p>
          <h2>创建图表</h2>
          <p className='desc'>通过简单配置即可生成折线图、柱状图、饼状图等多种数据图表</p>
        </div>
      </div>
      <div className='info lnks'>
        帮助文档：<Link to='/htm/help/general'>通用说明</Link>
        <Link to='/htm/help/form'>创建表单</Link>
        <Link to='/htm/help/table'>创建列表</Link>
        <Link to=''>创建图表</Link>
      </div>
      <div className='info'>Driven by React, JSON-Editor, Koa, Sqlite3. Powered by hanlongfei@sogou-inc.com</div>
    </div>
  </div>
);

export { FormHelp } from './form-help';
export { TableHelp } from './table-help';
export { GeneralDesc } from './general';
