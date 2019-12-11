import React from 'react';
import { Link } from 'react-router-dom';
import { Wrap } from '../../components';

export const ChartHelp = () => (
  <Wrap>
    <div className='guide-help'>
      <div className='guide-node'>
        <h2 className='help-title help-title-main'>
          <span>创建图表</span>
        </h2>
        <div className='help-content'>
          <p>
            仅需简单配置，即可快速生成表现力丰富的数据图表，支持折线图、柱状图、饼状图，支持定时刷新，可在单页展示多个图表实例，方便对比分析。
          </p>
        </div>
      </div>

      <div className='guide-node' id='step-1'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#step-1'>
            <i className='fas fa-link'></i>
          </a>
          <span>第一步：填写基本信息</span>
        </h2>
        <div className='help-content'>
          <p>填写图表名称、配色和备注等基本信息，按照你的需要填写即可。</p>
        </div>
      </div>
      <div className='guide-node' id='step-2'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#step-2'>
            <i className='fas fa-link'></i>
          </a>
          <span>第二步：配置图表</span>
        </h2>
        <div className='help-content'>
          <p>可配置多个图表，通过排版和组合方便的查看、对比、分析数据。需要特别说明的是：</p>
          <ul>
            <li>
              <label>数据源</label>
              <p>
                获取数据的API，支持<Link to='/help/general#url-variable'>URL变量</Link>
              </p>
            </li>
            <li>
              <label>横坐标</label>
              <p>
                横坐标支持两种方式：
                <br />
                1. 如果横坐标为常量，可直接填写，并用逗号分隔，如：<code>周一,周二,周三,周四,周五,周六,周日</code>
                <br />
                2. 如果横坐标从数据源读取，有两种方式取值，请看以下数据示例：
                <br />
                <pre>{`{
  "code": 0,
  "data": {
    "dau": [
      {
        "uv": 2100,
        "pv": 10021,
        "day": "2020-01-01"
      },
      {
        "uv": 2100,
        "pv": 10021,
        "day": "2020-01-02"
      },
      {
        "uv": 2100,
        "pv": 10021,
        "day": "2020-01-03"
      },
      {
        "uv": 2100,
        "pv": 10021,
        "day": "2020-01-04"
      },
      {
        "uv": 2100,
        "pv": 10021,
        "day": "2020-01-05"
      }
    ],
    "xAxis": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  }
}`}</pre>
                2.1 如果接口直接返回横坐标数据，填写对应Path即可，如<code>data.xAxis</code>
                <br />
                2.2 如果横坐标是数据列表中的字段，可使用<Link to='/help/general#path-map'>PathMap</Link>取值，如
                <code>data.dau..day</code>
              </p>
            </li>
            <li>
              <label>工具栏</label>
              <p>可在图表右上角添加实用工具：saveAsImage 保存为图片，dataZoom 区域缩放，magicType 切换图表类型</p>
            </li>
            <li>
              <label>系列</label>
              <p>
                一个图表可添加多个系列，按照你的需要填写名称、路径（支持
                <Link to='/help/general#path-map'>PathMap</Link>）、类型等。
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Wrap>
);
