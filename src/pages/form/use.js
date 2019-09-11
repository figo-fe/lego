import React, { useState, useRef, useEffect } from 'react';
import { Wrap, Button, SchemaForm } from '../../components';
import { axios, toast, parseUrl, execJs } from '../../common/utils';
import { FORM } from '../../config/apis';

export default props => {
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
        schema = JSON.stringify({
          title: '无效表单',
          properties: {},
          options: {
            disable_collapse: true,
          },
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
        delete window._dataReady_;
        delete window._editor_;
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
    if (params && params.do === 'edit' && state.origin) {
      const originUrl = state.origin.replace(/=\{\{[^}]+\}\}/g, str => {
        const key = str.slice(3, -2);
        return `=${params[key] || ''}`;
      });

      axios('GET', originUrl)
        .then(res => {
          if (res.code === 0) {
            try {
              formRef.current.setValue(res.data);

              // 通知ext
              if (typeof window._dataReady_ === 'function') {
                window._dataReady_(res.data);
              }
            } catch (err) {
              console.warn(err);
            }
          }
        })
        .catch(err => console.log(err));
    }
  }, [state.origin]);

  function doSubmit() {
    const editor = formRef.current;
    const validates = editor.validate();
    const params = parseUrl();

    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
    } else {
      axios('POST', state.api, {
        ...params,
        data: JSON.stringify(editor.getValue()),
      })
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

  function doBack() {
    props.history.goBack();
  }

  return (
    <Wrap>
      <div className='lego-card'>
        {state.loading ? (
          'loading...'
        ) : (
          <>
            <SchemaForm
              schema={JSON.parse(state.schema)}
              onReady={editor => (formRef.current = window._editor_ = editor)}
            />
            <div className='btns-row'>
              <Button onClick={doSubmit} value='提交' extClass='btn-primary' />
              <Button onClick={doConsole} value='console.log' extClass='btn-outline-primary' />
              <Button onClick={doBack} value='返回' extClass='btn-outline-secondary' />
            </div>
          </>
        )}
      </div>
    </Wrap>
  );
};
