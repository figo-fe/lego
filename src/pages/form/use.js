import React, { useState, useCallback, useEffect } from 'react';
import Wrap from '../../components/wrap';
import { axios, toast, parseUrl, initEditor } from '../../common/utils';
import { FORM } from '../../common/apis';

export default props => {
  const [state, setState] = useState({});

  const formView = useCallback(
    node => {
      const { id } = props.match.params;
      if (node) {
        axios('GET', FORM, { id }).then(res => {
          const { api, origin, schema } = res.data;
          setState({ api, origin });
          formView.current = initEditor(node, JSON.parse(schema));
        });
      }
    },
    [props.match.params]
  );

  // useEffect(() => {
  //   const params = parseUrl();
  //   if (params && state.origin) {
  //     const originUrl = state.origin.replace(/=\{\{[^}]+\}\}/g, str => {
  //       const key = str.slice(3, -2);
  //       return `=${params[key] || ''}`;
  //     });

  //     axios('POST', originUrl, params)
  //       .then(res => {
  //         if (res.code === 0) {
  //           try {
  //             formView.current.setValue(res.data);
  //           } catch (err) {
  //             console.warn(err);
  //           }
  //         }
  //       })
  //       .catch(err => console.warn(err));
  //   }
  // }, [state, props.match.params]);

  function doSubmit() {
    const editor = formView.current;
    const validates = editor.validate();

    if (validates.length > 0) {
      toast(
        `表单填写有误：<br />${validates
          .map(err => err.path + ': ' + err.message)
          .join('<br />')}`
      );
    } else {
      axios('POST', state.api, {
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

  function doBack() {
    props.history.goBack();
  }

  return (
    <Wrap>
      <div className="lego-card">
        <div className="form-view" ref={formView} />
        <div className="btns-row">
          <button
            onClick={doSubmit}
            type="button"
            className="btn btn-primary btn-sm"
          >
            提交
          </button>
          <button
            onClick={doBack}
            type="button"
            className="btn btn-outline-secondary btn-sm"
          >
            返回
          </button>
        </div>
      </div>
    </Wrap>
  );
};
