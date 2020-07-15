import React, { useState, useRef, useEffect, useContext } from 'react';
import { Wrap, Button, SchemaForm } from '../../components';
import { axios, toast, parseUrl, execJs, buildUrl, isInFrame, kv, buildApi } from '../../common/utils';
import { SettingContext } from '../../config/context';
import { FORM } from '../../config/apis';
import { langs, lang } from '@lang';

export const FormUse = props => {
  const debug = kv('debug');
  const context = useContext(SettingContext);
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);
  const formDataRef = useRef({
    api: '',
    origin: '',
    schema: '',
  });

  useEffect(() => {
    const id = props.match.params.id;
    let fn, script;

    axios('GET', FORM, { id }).then(res => {
      let { api, origin, schema, ext, state = 0 } = res.data;
      if (state === 0) {
        toast(langs[lang]['form_invalid']);
        formDataRef.current.schema = `{"title":"Invalid","properties":{}}`;
      } else {
        formDataRef.current = { api, origin, schema };
        [fn, script] = execJs(ext);
      }
      setLoading(false);
    });

    return () => {
      try {
        // 跳出时卸载JS
        setLoading(true);
        console.log(`unmount ${fn}`);
        delete window._editor_;
        delete window._onDataReady_;
        delete window._onDataError_;
        delete window._submitFix_;
        delete window._afterSubmit_;
        delete window.formUploader; // Jodit当前表单上传配置
        delete window.joditConfig; // Jodit当前表单配置
        delete window[fn];
        script.remove();
      } catch (e) {
        console.warn(e);
      }
    };
  }, [props.match.params.id]);

  useEffect(() => {
    const params = parseUrl();
    const { origin } = formDataRef.current;
    const editable = context.baseUrl !== undefined && !loading && params.do === 'edit' && origin;

    if (editable) {
      const originTpl = buildApi(context.baseUrl, origin);
      const originUrl = buildUrl(originTpl, params);

      axios('GET', originUrl)
        .then(res => {
          if (res.code === 0) {
            try {
              // 回填表单
              if (typeof window._onDataReady_ === 'function') {
                window._onDataReady_(formRef.current, res.data);
              } else {
                formRef.current.setValue(res.data);
              }
            } catch (err) {
              toast(err.desc || err.msg);
              console.warn(err);
            }
          }
        })
        .catch(err => {
          console.log(err);
          if (typeof window._onDataError_ === 'function') {
            window._onDataError_(formRef.current, err);
          }
        });
    }

    if (isInFrame) {
      setTimeout(() => {
        window.parent.postMessage(
          JSON.stringify({
            type: 'LEGO_POPUP_HEIGHT',
            height: document.querySelector('.lego-card').offsetHeight,
          }),
        );
      });
    }
  }, [context.baseUrl, loading]);

  function doSubmit() {
    const editor = formRef.current;
    const validates = editor.validate();
    let params = parseUrl();
    if (validates.length > 0) {
      toast(
        [
          `${langs[lang]['form_validate_fail']}<br />`,
          `${validates.map(err => err.path + ': ' + err.message).join('<br />')}`,
        ].join(''),
      );
    } else {
      const api = buildApi(context.baseUrl, formDataRef.current.api);
      const opts = {};

      // 自定义提交数据
      if (typeof window._submitFix_ === 'function') {
        params = window._submitFix_(Object.assign(params, editor.getValue()));
        if (!params) {
          console.warn(`Form: Function window._submitFix_ return invalid value`);
          return;
        }
        // 自定义提交类型(Content-Type)
        if (/json$/.test(params._contentType)) {
          opts.type = 'json';
        }
      } else {
        params.data = JSON.stringify(editor.getValue());
      }

      // 消除干扰参数
      delete params.do;
      delete params.debug;
      delete params._contentType;

      axios('POST', buildUrl(api), params, opts)
        .then(res => {
          if (res.code === 0) {
            toast(langs[lang]['submit_success']);
            if (isInFrame) {
              // 关闭弹窗
              setTimeout(() => {
                try {
                  window.parent._LEGO_UTILS_.popup.hide(true);
                } catch (err) {
                  console.warn(err);
                }
              }, 2e3);
            }
          }

          // 提交后执行方法
          if (typeof window._afterSubmit_ === 'function') {
            window._afterSubmit_(params, res);
          }
        })
        .catch(err => {
          toast(err.msg || err.desc);
        });
    }
  }

  function doConsole() {
    const editor = formRef.current;
    let params = parseUrl();

    // 自定义提交数据
    if (typeof window._submitFix_ === 'function') {
      params = window._submitFix_(Object.assign(params, editor.getValue()));
    } else {
      params.data = JSON.stringify(editor.getValue());
    }

    // 消除干扰参数
    delete params.do;
    delete params.debug;
    delete params._contentType;

    console.log(params);
  }

  return (
    <Wrap loading={loading}>
      <div className='lego-card'>
        <SchemaForm schema={formDataRef.current.schema} onReady={editor => (formRef.current = editor)} />
        <div className='btns-row'>
          <Button onClick={doSubmit} value={langs[lang]['submit']} extClass='btn-primary' />
          {debug && <Button onClick={doConsole} value='console.log' extClass='btn-outline-primary' />}
          {!isInFrame && props.history.length > 1 && (
            <Button
              onClick={() => props.history.goBack()}
              value={langs[lang]['back']}
              extClass='btn-outline-secondary'
            />
          )}
        </div>
      </div>
    </Wrap>
  );
};
