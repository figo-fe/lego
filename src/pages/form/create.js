import React, { useCallback, useState } from 'react';
import Wrap from '../../components/wrap';
import { initEditor, json2schema, axios, toast } from '../../common/utils';
import { createForm } from '../../config/schema';
import { FORM } from '../../config/apis';

export default () => {
  const [step, setStep] = useState(1);
  const [schemaShow, setSchemaShow] = useState(false);
  const [schemaCode, setSchemaCode] = useState('');

  const configRef = useCallback(node => {
    configRef.current = initEditor(node, createForm, {
      disable_collapse: true
    });
  }, []);

  const previewRef = useCallback(
    node => {
      if (node) {
        const { json, name } = configRef.current.getValue();
        const schema = json2schema(json, name);
        if (schema) {
          previewRef.current = {
            editor: initEditor(node, schema, {
              startval: JSON.parse(json)
            }),
            node
          };
          setSchemaCode(schema);
        }
      } else {
        // 销毁实例 释放内存
        if (previewRef.current && previewRef.current.editor) {
          previewRef.current.editor.destroy();
          previewRef.current = null;
        }
      }
    },
    [configRef]
  );

  const schemaRef = useCallback(node => {
    const ace = window.ace;
    if (node) {
      setTimeout(() => {
        schemaRef.current = ace.edit(node, { mode: 'ace/mode/json' });
        schemaRef.current.setTheme('ace/theme/monokai');
      });
    }
  }, []);

  function doNext() {
    const _editor = configRef.current;
    const validates = _editor.validate();
    if (validates.length > 0) {
      toast(
        `表单填写有误：<br />${validates
          .map(err => err.path + ': ' + err.message)
          .join('<br />')}`
      );
    } else {
      setStep(2);
    }
  }

  function doUpdate() {
    if (schemaRef.current && previewRef.current) {
      const { node, editor } = previewRef.current;
      if (editor) {
        editor.destroy();
        const { json } = configRef.current.getValue();
        const schema = schemaRef.current.getValue();
        previewRef.current.editor = initEditor(node, JSON.parse(schema), {
          startval: JSON.parse(json)
        });
      }
    }
  }

  function doConsole() {
    console.log(previewRef.current.editor.getValue());
  }

  function doSave() {
    const schema = schemaRef.current.getValue();
    const config = configRef.current.getValue();

    axios('POST', FORM, {
      name: config.name,
      api: config.api,
      origin: config.origin,
      desc: config.desc,
      schema: JSON.stringify(JSON.parse(schema))
    })
      .then(() => {
        toast('保存成功');
      })
      .catch(err => {
        toast(err.msg);
      });
  }

  function toHelp() {
    console.log(123);
  }

  return (
    <Wrap>
      <div className="lego-card">
        <div style={{ display: step !== 1 && 'none' }} ref={configRef} />
        {step === 2 && (
          <div className="form-view">
            <div ref={previewRef} />
            <div className={'schema-box' + (schemaShow ? ' schema-show' : '')}>
              <div ref={schemaRef} className="schema-code">
                {JSON.stringify(schemaCode, null, 4)}
              </div>
              <div
                className="switch-btn"
                title="编辑schema"
                onClick={() => setSchemaShow(!schemaShow)}
              >
                <i
                  className={'fa fa-angle-' + (schemaShow ? 'right' : 'left')}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="btns-row">
            <button
              onClick={doNext}
              type="button"
              className="btn btn-primary btn-sm"
            >
              下一步
            </button>
            <button
              onClick={toHelp}
              type="button"
              className="btn btn-outline-primary btn-sm"
            >
              帮助
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="btns-row">
            <button
              onClick={doSave}
              type="button"
              className="btn btn-success btn-sm"
            >
              保存
            </button>
            <button
              onClick={doConsole}
              type="button"
              className="btn btn-outline-primary btn-sm"
            >
              console.log
            </button>
            <button
              onClick={doUpdate}
              type="button"
              className="btn btn-outline-primary btn-sm"
            >
              更新表单
            </button>
            <button
              onClick={() => setStep(1)}
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
