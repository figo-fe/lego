import React, { useState, useRef, useEffect, useContext } from 'react';
import { Wrap, Button, SchemaForm } from '../../components';
import { axios, toast, parseUrl, execJs, buildUrl, isInFrame } from '../../common/utils';
import { SettingContext } from '../../config/context';
import { FORM } from '../../config/apis';

export const FormUse = props => {
  const context = useContext(SettingContext);
  const [state, setState] = useState({
    api: '',
    origin: '',
    schema: '{}',
    loading: true,
  });
  const formRef = useRef(null);

  useEffect(() => {
    const id = props.match.params.id;
    let fn, script;

    axios('GET', FORM, { id }).then(res => {
      let { api, origin, schema, ext, state = 0 } = res.data;
      if (state === 0) {
        toast('表单已失效');
        setState({
          schema: '{"title":"无效表单","properties":{},"options":{"disable_collapse":true}}',
          loading: false,
        });
      } else {
        setState({ api, origin, schema, loading: false });
        [fn, script] = execJs(ext);
      }
    });

    return () => {
      try {
        // 跳出时卸载JS
        console.log(`unmount ${fn}`);
        delete window.onDataReady;
        delete window.__editor__;
        delete window[fn];
        script.remove();
      } catch (e) {
        console.warn(e);
      }
    };
  }, [props.match.params.id]);

  useEffect(() => {
    const params = parseUrl();
    // do = edit且配置数据源时进入编辑模式
    if (params && params.do === 'edit' && state.origin && context.baseUrl !== void 0) {
      const origin = (/^(http|\/\/)/.test(state.origin) ? '' : context.baseUrl) + state.origin;
      const originUrl = buildUrl(origin, params);

      axios('GET', originUrl)
        .then(res => {
          if (res.code === 0) {
            try {
              formRef.current.setValue(res.data);

              // 通知ext
              if (typeof window.onDataReady === 'function') {
                window.onDataReady(res.data);
              }
            } catch (err) {
              console.warn(err);
            }
          }
        })
        .catch(err => console.log(err));
    }
  }, [state.origin, context.baseUrl]);

  function doSubmit() {
    const editor = formRef.current;
    const validates = editor.validate();
    const params = parseUrl();
    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
    } else {
      const api = (/^(http|\/\/)/.test(state.api) ? '' : context.baseUrl) + state.api;

      // 消除干扰参数
      delete params.do;

      // 自定义提交数据
      if (typeof window.__submitFix__ === 'function') {
        Object.assign(params, window.__submitFix__(editor.getValue()) || {});
      } else {
        params.data = JSON.stringify(editor.getValue());
      }

      axios('POST', buildUrl(api), params)
        .then(res => {
          if (res.code === 0) {
            toast('提交成功');
          }
        })
        .catch(err => {
          toast(err.msg);
        });
    }
  }

  function doConsole() {
    console.log(formRef.current.getValue());
  }

  return (
    <Wrap loading={state.loading}>
      <div className='lego-card'>
        <SchemaForm
          schema={JSON.parse(state.schema)}
          onReady={editor => (formRef.current = window.__editor__ = editor)}
        />
        <div className='btns-row'>
          <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
          <Button onClick={doConsole} value='console.log' extClass='btn-outline-primary' />
          {!isInFrame && (
            <Button onClick={() => props.history.goBack()} value='返回' extClass='btn-outline-secondary' />
          )}
        </div>
      </div>
    </Wrap>
  );
};
