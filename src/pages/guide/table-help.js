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
          <p>根据后端提供的API生成支持分页、搜索、多选、排序的数据列表。</p>
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
            ，系统据此读取数据，可按需添加搜索、排序、多选功能（查询实现依赖后端接口）。
          </p>
          <blockquote>
            搜索：在数据接口添加查询参数，用URL变量表示，例如<code>{'&search_key={{key}}'}</code>，{'{{key}}'}
            将被替换为对应的查询值；
            <br />
            排序：在数据接口添加查询参数，用URL变量表示，例如<code>{'&order={{sort}}'}</code>，{'{{sort}}'}将按照
            {'{key}-{asc|desc}'}格式进行替换（仅支持单列排序）
            <br />
            多选：需配合工具栏-按钮使用，详见工具栏-按钮配置。
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
          <ul>
            <li>
              可添加多个操作，支持内页打开、新窗打开、弹窗浮层、接口请求和
              <Link to='/help/general#exec-script'>执行脚本</Link>，可配置
              <Link to='/help/general#icon-font'>IconFont</Link>
              ，支持
              <Link to='/help/general#url-variable'>URL变量</Link>
              ，变量数据从行数据和页面URL参数中读取，行数据优先级更高。
            </li>
            <li>
              接口请求会有二次确认弹窗，取消需在url结尾增加参数<code>handle_confirm=0</code>
            </li>
            <li>
              图标留空时会自动添加图标，不显示图标请填<code>none</code>
            </li>
            <li>
              <p>
                显隐控制用来控制操作的显示情况，值为与非表达式，可直接使用<code>data</code>（当前行数据）和
                <code>account</code>（用户信息admin, user, group）变量，如：
              </p>
              <pre>{`data.display == 'show' && account.group == 'editor'`}</pre>
            </li>
          </ul>
        </div>
      </div>
      <div className='guide-node' id='handle'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#handle'>
            <i className='fas fa-link'></i>
          </a>
          <span>工具栏配置</span>
        </h2>
        <div className='help-content'>
          <p>用来定制表头上方工具栏，可添加输入框、下拉框、时间选择器、按钮等组件。</p>
          <ul>
            <li>类型：选择工具类型</li>
            <li>名称：填写工具名称</li>
            <li>
              Key：此工具唯一键，当工具为查询字段时，Key必须以<code>search_</code>开头（URL变量中无需search_）
            </li>
            <li>宽度：工具占位宽度</li>
            <li>
              <strong>配置</strong>
              <ul>
                <li>
                  <p>
                    下拉框：
                    <br />
                    「固定列表」以多组value:display[:true]分号隔开，<code>:true</code>（可选）表示默认选中，如
                    <code>选项1:value1;选项2:value2:true;选项3:value3</code>默认选中选项2
                    <br />
                    「接口读取」填写函数名，并在扩展中实现，如：
                  </p>
                  <pre>{`window._updateChoices_ = function(choices_instance){
  // async_function 为异步获取数据伪函数
  async_function().then(function(data){
    // 使用实例的setChoices方法设置选项，格式如下：
    choices_instance.setChoices([
      {
        value: value1,
        label: name1
      },
      {
        value: value2,
        label: name2
        selected: true // 选中
      }
    ])
  })

}`}</pre>
                </li>
                <li>时间选择：支持单选和时间范围模式，选择时间默认为关，可配置输出格式。</li>
                <li>
                  按钮：支持8种风格，按钮功能和行为同「数据操作」，可配合列的多选功能实现多选操作，通过URL变量
                  <code>{'{{multi-key}}'}</code>获取以逗号分隔的多选数据。
                </li>
                <li>
                  自定义：自定义HTML，可通过<Link to='/help/general#path-map'>PathMap</Link>获取列表接口数据，如
                  <code>{`{{table.type}}`}</code>，
                </li>
              </ul>
            </li>
          </ul>
          <blockquote>工具栏保存后不可修改类型，可删除后重新添加。</blockquote>
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
          </p>
          <pre>{`{
  "code": 0,
  "data": {
    "pageInfo": {
      "total": 2192,
      "size": 30
    }
  }
}`}</pre>
          <p>则定义修正方法：</p>
          <pre>
            {`window._pageFix_ = function (data) {
  return {
    total: data.pageInfo.total,
    pageSize: data.pageInfo.size
  }
}`}
          </pre>
          <p>若接口分页数据为如下标准结构，则无需修正：</p>
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
