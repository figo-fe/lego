import React, { useCallback, useState } from 'react';
import Wrap from '../../components/wrap';
import { initEditor, json2schema } from '../../common/utils';
import { createForm } from '../../config/schemas';

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
        const { json } = configRef.current.getValue();
        const schema = json2schema(json);
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
      alert(
        `表单填写有误\n${validates.map(
          err => err.path + ': ' + err.message + '\n'
        )}`
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
        previewRef.current.editor = initEditor(
          node,
          JSON.parse(schemaRef.current.getValue())
        );
      }
    }
  }

  function doConsole() {
    console.log(previewRef.current.editor.getValue());
  }

  function doSave() {
    const schema = schemaRef.current.getValue();
    console.log(JSON.stringify(JSON.parse(schema)));
  }

  return (
    <Wrap>
      <div className="lego-card">
        <div style={{ display: step !== 1 && 'none' }} ref={configRef} />
        {step === 2 && (
          <div className="form-preview">
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
          </div>
        )}
        {step === 2 && (
          <div className="btns-row">
            <button
              onClick={doSave}
              type="button"
              className="btn btn-success btn-sm"
            >
              保存配置
            </button>
            <button
              onClick={doConsole}
              type="button"
              className="btn btn-outline-primary btn-sm"
            >
              打印(console.log)
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
