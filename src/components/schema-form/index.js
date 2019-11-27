import React, { useLayoutEffect, useState, useRef } from 'react';
import { Button, AceCode } from '../../components';
import { initEditor, toast, findSchemaByPath, updateSchemaByPath } from '../../common/utils';
import SchemaEditor from './schema-editor';
import './index.scss';

export const SchemaForm = ({ schema, startval, show = true, editable = false, onReady, onSchemaUpdate }) => {
  const formRef = useRef(null);
  const aceEditor = useRef(null);
  const editPathRef = useRef(null);
  const [schemaShow, setSchemaShow] = useState(false);
  const [editSchema, setEditSchema] = useState(null);

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
  }, [JSON.stringify(schema)]);

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

  function onFormEdit(evt) {
    const { target } = evt;
    const { schematype, schemapath } = target.dataset;
    if (editable && schemapath && /string|integer|number|boolean/.test(schematype)) {
      const formSchema = findSchemaByPath(schema, schemapath);
      editPathRef.current = schemapath;
      setEditSchema(formSchema);
    }
  }

  function onFormUpdate(formSchema) {
    updateSchemaByPath(schema, editPathRef.current, formSchema);
    onSchemaUpdate(schema);
    setEditSchema(null);
  }

  if (schema) {
    return (
      <div className={'form-view' + (editable ? ' form-edit' : '')}>
        <div
          style={{ display: show ? 'block' : 'none' }}
          ref={formRef}
          className='schema-form'
          onClick={onFormEdit}></div>
        {editable && (
          <div className={'schema-box' + (schemaShow ? ' schema-show' : '')}>
            <Button key='update' value='更新至表单' onClick={updateSchema} />
            <div className='switch-btn' title='编辑schema' onClick={() => setSchemaShow(!schemaShow)}>
              <i className={'fa fa-angle-' + (schemaShow ? 'right' : 'left')} />
            </div>
            <AceCode type='json' code={JSON.stringify(schema, null, 2)} onReady={ace => (aceEditor.current = ace)} />
          </div>
        )}
        {editable && editSchema && (
          <div className='popup-mask'>
            <div className='popup-main' style={{ width: 600, height: 350, padding: 15 }}>
              <div className='popup-hide' title='关闭' onClick={() => setEditSchema(null)}>
                <i className='fas fa-times'></i>
              </div>
              <SchemaEditor schema={editSchema} onUpdate={onFormUpdate} />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};
