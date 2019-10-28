import React, { useLayoutEffect, useState, useRef } from 'react';
import { Button, AceCode } from '../../components';
import { initEditor, toast } from '../../common/utils';
import './index.scss';

export const SchemaForm = ({ schema, startval, show = true, editable = false, onReady, onSchemaUpdate }) => {
  const formRef = useRef(null);
  const aceEditor = useRef(null);
  const [schemaShow, setSchemaShow] = useState(false);

  useLayoutEffect(() => {
    if (schema) {
      const opts = startval ? { startval } : {};
      const editor = initEditor(formRef.current, schema, opts);
      if (editor && typeof onReady === 'function') {
        onReady(editor);
      }
      return () => {
        editor && editor.destroy();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, startval]);

  function updateSchema() {
    if (typeof onSchemaUpdate === 'function') {
      let schema = null;
      try {
        schema = JSON.parse(aceEditor.current.getValue());
      } catch (e) {
        toast('Schema格式有误，请检查');
      }
      schema && onSchemaUpdate(schema);
    }
  }

  if (schema) {
    return (
      <div className='form-view'>
        <div style={{ display: show ? 'block' : 'none' }} ref={formRef} className='schema-form'></div>
        {editable && (
          <div className={'schema-box' + (schemaShow ? ' schema-show' : '')}>
            <Button key='update' value='更新至表单' onClick={updateSchema} />
            <div className='switch-btn' title='编辑schema' onClick={() => setSchemaShow(!schemaShow)}>
              <i className={'fa fa-angle-' + (schemaShow ? 'right' : 'left')} />
            </div>
            <AceCode type='json' code={JSON.stringify(schema, null, 2)} onReady={ace => (aceEditor.current = ace)} />
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};
