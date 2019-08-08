import React, { useState, useCallback, useEffect } from 'react';
import Wrap from '../../components/wrap';
import { axios, toast, parseUrl, initEditor } from '../../common/utils';
import { FORM } from '../../config/apis';

export default props => {
  const [state, setState] = useState({ loading: true });

  const formRef = useCallback(
    node => {
      const id = props.match.params.id;
      if (node) {
        axios('GET', FORM, { id }).then(res => {
          let { api, origin, schema, state } = res.data;
          if (state === 0) {
            toast('表单已失效');
            schema = JSON.stringify({
              title: '无效表单',
              properties: {},
              options: {
                disable_collapse: true
              }
            });
          } else {
            setState({ api, origin, loading: false });
          }

          formRef.current = initEditor(node, JSON.parse(schema));
        });
      } else {
        setState(s => Object.assign({}, s, { loading: true }));
        formRef.current.destroy();
      }
    },
    [props.match.params.id]
  );

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
            } catch (err) {
              console.warn(err);
            }
          }
        })
        .catch(err => console.warn(err));
    }
  }, [state.origin, formRef]);

  function doSubmit() {
    const editor = formRef.current;
    const validates = editor.validate();
    const params = parseUrl();

    if (validates.length > 0) {
      toast(
        `表单填写有误：<br />${validates
          .map(err => err.path + ': ' + err.message)
          .join('<br />')}`
      );
    } else {
      axios('POST', state.api, {
        ...params,
        data: JSON.stringify(editor.getValue())
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
      <div className="lego-card">
        <div className="form-view" ref={formRef} />
        {!state.loading && (
          <div className="btns-row">
            <button
              onClick={doSubmit}
              type="button"
              className="btn btn-primary btn-sm"
            >
              提交
            </button>
            <button
              onClick={doConsole}
              type="button"
              className="btn btn-outline-primary btn-sm"
            >
              console.log
            </button>
            <button
              onClick={doBack}
              type="button"
              className="btn btn-outline-secondary btn-sm"
            >
              返回
            </button>
          </div>
        )}
      </div>
    </Wrap>
  );
};
