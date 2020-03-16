import React from 'react';
import { Link } from 'react-router-dom';
import { Wrap } from '../../components';
import './guide.scss';

export const GuideHome = () => (
  <Wrap>
    <div className='guide-home'>
      <h1>使用LEGO快速搭建后台</h1>
      <div className='subtitle'>LEGO拥有丰富的内建模块，可在数分钟内搭建强大的后台界面</div>
      <div className='entry'>
        <Link to='/form/create' className='item'>
          <p>
            <i className='fas fa-th-list'></i>
          </p>
          <h2>创建表单</h2>
          <p className='desc'>以JSON数据为模型自动创建表单，支持日期、上传、编辑器等多种表单模型</p>
        </Link>
        <Link to='/table/create' className='item'>
          <p>
            <i className='fas fa-table'></i>
          </p>
          <h2>创建列表</h2>
          <p className='desc'>配置接口和表头，一键生成列表页，支持排序、多选、搜索、分页等列表常用功能</p>
        </Link>
        <Link to='/chart/create' className='item'>
          <p>
            <i className='fas fa-chart-line'></i>
          </p>
          <h2>创建图表</h2>
          <p className='desc'>通过简单配置生成折线图、柱状图、饼状图等多种数据图表，支持定时刷新</p>
        </Link>
        <Link to='/board/create' className='item'>
          <p>
            <i className='fas fa-tachometer-alt'></i>
          </p>
          <h2>创建面板</h2>
          <p className='desc'>任意组合已创建的列表和图表，定制具有丰富展现力的仪表盘，让你的系统绽放光彩</p>
        </Link>
      </div>
      <div className='info lnks'>
        帮助文档：<Link to='/help/general'>通用说明</Link>
        <Link to='/help/setting'>系统设置</Link>
        <Link to='/help/form'>创建表单</Link>
        <Link to='/help/table'>创建列表</Link>
        <Link to='/help/chart'>创建图表</Link>
        <Link to='/help/board'>创建面板</Link>
      </div>
      <div className='info'>Driven by React, JSON-Editor, Koa, Sqlite3. Powered by hanlongfei@sogou-inc.com</div>
    </div>
  </Wrap>
);

export { SettingHelp } from './setting-help';
export { FormHelp } from './form-help';
export { TableHelp } from './table-help';
export { ChartHelp } from './chart-help';
export { GeneralDesc } from './general';
