import React from 'react';
import { Link } from 'react-router-dom';
import { Wrap } from '../../components';

export const FormHelp = () => (
  <Wrap>
    <div className='guide-help'>
      <div className='guide-node'>
        <h2 className='help-title help-title-main'>
          <span>创建表单</span>
        </h2>
        <div className='help-content'>
          <p>
            以JSON数据为模型，自动生成表单，并提供高度扩展和定制。为使表单拥有更好的体验和丰富的功能，需编写少量代码，下面详细介绍如何使用。
          </p>
        </div>
      </div>

      <div className='guide-node' id='step-1'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#step-1'>
            <i className='fas fa-link'></i>
          </a>
          <span>第一步：构造数据结构，填写表单基本信息</span>
        </h2>
        <div className='help-content'>
          <p>后台开发人员首先要明确表单的内容、功能和数据结构，自行构造出JSON数据</p>
          <ul>
            <li>
              <label>表单名称</label>
              <p>表单的名称，比如编辑商品、游戏配置等</p>
            </li>
            <li>
              <label>提交API</label>
              <p>
                表单以<code>POST</code>
                方式提交到此API（支持<Link to='/help/general#url-variable'>URL变量</Link>
                ），支持完整路径和相对路径，填写相对路径时会自动拼接系统设置里的「接口前缀」
              </p>
            </li>
            <li>
              <label>数据API</label>
              <p>
                编辑表单时回填数据的API（支持<Link to='/help/general#url-variable'>URL变量</Link>
                ），数据结构必须与表单相匹配，否则会发生不可预期的错误。
              </p>
            </li>
            <li>
              <label>数据示例</label>
              <p>
                数据示例是生成表单的<b>核心</b>
                ，请自行设计JSON数据结构和内容，尽量使用真实值，系统会根据类型生成相应的表单（如日期、文件上传等），亦可在后续步骤中完善。
              </p>
            </li>
            <li>
              <label>表单备注</label>
              <p>表单备注信息，可记录表单用途、注意事项等，方便后期查阅</p>
            </li>
          </ul>
          <blockquote>填写以上内容后，点击页面底部「下一步」，预览生成的表单并进行完善。</blockquote>
        </div>
      </div>
      <div className='guide-node' id='step-2'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#step-2'>
            <i className='fas fa-link'></i>
          </a>
          <span>第二步：预览、完善和保存表单</span>
        </h2>
        <div className='help-content'>
          <ul>
            <li>
              <label>预览</label>
              <p>系统根据用户提供的数据示例自动生成表单，如果此时表单符合你的需求，可跳过下面步骤，直接保存。</p>
            </li>
            <li>
              <label>完善和扩展</label>
              <p>当表单不符合需求时，通过两方面进行完善：</p>
              <ul>
                <li>
                  1. 通过「<Link to='/help/general#json-schema'>JSON-Schema</Link>
                  」，点击表单右上角蓝色箭头查看和编辑生成的JSON-Schema，参考
                  <a target='_blank' rel='noopener noreferrer' href='https://github.com/json-editor/json-editor'>
                    JSON-Editor文档
                  </a>
                  进行编辑， 完成后点击「更新至表单」进行预览。
                </li>
                <li>
                  2. 通过「表单扩展」，编写JavaScript进行扩展。
                  <br />
                  2.1 <code>window._editor_</code>可获取编辑器实例，参考
                  <a target='_blank' rel='noopener noreferrer' href='https://github.com/json-editor/json-editor'>
                    JSON-Editor文档
                  </a>
                  对表单进行扩展。
                  <br />
                  2.2 声明<code>window._onDataReady_</code>自定义数据回填
                  ，此方法在获取到回填数据后执行，接受两个参数：editor实例和回填数据。
                  <br />
                  2.3 声明<code>window._submitFix_</code>
                  自定义提交数据，此方法参数为表单数据，可自行实现对数据的改造和校验，如：
                  <pre>{`window._submitFix_ = function(data){
  if (condiction1) {
    // 自行对表单数据改造，获得想要的格式和内容
    return {
      k1: data.k1 * 100,
      k2: format(data.k2)
    }
  } else {
    // 返回false表明数据非法
    _LEGO_UTILS_.toast('xxx填写有误')
    return false
  }
}`}</pre>
                  Content-Type默认为<code>application/x-www-form-urlencoded</code>，可按需修改：
                  <pre>{`window._submitFix_ = function(data){
  return {
    _contentType: 'json', // 指定content-type为application/json
    data: data
  }
}`}</pre>
                  <br />
                  2.4 声明<code>window.formUploader</code>可定制当前表单上传方法，参数同<code>window.fileUploader</code>
                  （见<Link to='/help/general#file-upload'>文件上传</Link>）
                </li>
              </ul>
              <p></p>
              <blockquote>
                常见问题和使用技巧见<a href='#supplement'>附录</a>
              </blockquote>
            </li>
            <li>
              <label>测试和保存</label>
              <p>
                完善表单后，需进行试用和测试。点击「console.log」在浏览器打印表单数据，核对无误后点击「保存」完成创建。
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className='guide-node' id='supplement'>
        <h2 className='help-title help-title-sub'>
          <a className='hash' href='#supplement'>
            <i className='fas fa-link'></i>
          </a>
          <span>附：</span>
        </h2>
        <div className='help-content'>
          <p>
            <b>1. 如何进入表单编辑模式？</b>
            <br />
            只要在表单URL上追加参数<code>do=edit</code>即可，例如 <code>http://lego.com/htm/form/use/1?do=edit</code>
            ，编辑模式下系统会请求<b>数据API</b>进行数据回填。
          </p>
        </div>
      </div>
    </div>
  </Wrap>
);
