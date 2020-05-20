import React, { useLayoutEffect, useState, useRef } from 'react';
import { initEditor, toast, findSchemaByPath, updateSchemaByPath } from '../../common/utils';
import { CodePopup } from '../../components';
import SchemaEditor from './schema-editor';

import './index.scss';

export const SchemaForm = ({ schema, startval, show = true, editable = false, onReady, onSchemaUpdate }) => {
  const formRef = useRef(null);
  const editPathRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const [schemaShow, setSchemaShow] = useState(false); // 显示编辑schema弹窗
  const [editSchema, setEditSchema] = useState(null); // 单个表单schema

  useLayoutEffect(() => {
    if (schema) {
      const opts = startval ? { startval } : {};
      const editor = initEditor(formRef.current, schema, opts);
      if (editor && typeof onReadyRef.current === 'function') {
        onReadyRef.current(editor);
      }
      return () => {
        editor && editor.destroy();
      };
    }
  }, [schema, startval]);

  // 编辑单个表单
  function onFormEdit(evt) {
    const { target } = evt;
    const { schematype, schemapath } = target.dataset;
    if (editable && schemapath && /string|integer|number|boolean/.test(schematype)) {
      const formSchema = findSchemaByPath(schema, schemapath);
      editPathRef.current = schemapath;
      setEditSchema(formSchema);
    }
  }

  // 保存单个表单
  function onFormUpdate(formSchema) {
    onSchemaUpdate(updateSchemaByPath(schema, editPathRef.current, formSchema));
    setEditSchema(null);
  }

  if (!schema) return null;

  return (
    <div className={'form-view' + (editable ? ' form-edit' : '')}>
      <div style={{ display: show ? 'block' : 'none' }} ref={formRef} className='schema-form' onClick={onFormEdit} />
      {editable && (
        <div className='btn btn-sm btn-outline-info switch-edit' title='编辑Schema' onClick={() => setSchemaShow(true)}>
          <i className='fa fa-code' /> 编辑Schema
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
      {editable && schemaShow && (
        <CodePopup
          height={600}
          initCode={JSON.stringify(schema, null, 2)}
          onClose={() => setSchemaShow(false)}
          onSubmit={code => {
            try {
              if (typeof onSchemaUpdate === 'function') {
                onSchemaUpdate(JSON.parse(code));
                setSchemaShow(false);
              }
            } catch (err) {
              toast(String(err));
            }
          }}
        />
      )}
    </div>
  );
};
