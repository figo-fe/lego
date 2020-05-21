import React, { useRef, useEffect, useContext } from 'react';
import { SchemaForm, Button } from '../../components';
import { execJs } from '../../common/utils';
import { SettingContext } from '../../config/context';
import { langs, lang } from '@lang';

export const FormView = ({ origin, params = {}, schema, ext, onSubmit, onConsole, onBack }) => {
  const context = useContext(SettingContext);
  const formRef = useRef(null);

  useEffect(() => {
    const [fn, script] = execJs(ext);

    // 编辑模式
    if (params.do === 'edit' && origin && context.baseUrl !== undefined) {
    }

    return () => {
      try {
        // 载JS
        console.log(`unmount ${fn}`);
        delete window._editor_;
        delete window._onDataReady_;
        delete window._submitFix_;
        delete window._afterSubmit_;
        delete window[fn];
        script.remove();
      } catch (e) {
        console.warn(e);
      }
    };
  }, [params, origin, ext, context.baseUrl]);

  if (!schema) return null;
  return (
    <div className='lego-card'>
      <SchemaForm schema={JSON.parse(schema)} onReady={editor => (formRef.current = editor)} />
      <div className='btns-row'>
        {onSubmit && <Button onClick={onSubmit} value={langs[lang]['submit']} extClass='btn-primary' />}
        {onConsole && <Button onClick={onConsole} value='console.log' extClass='btn-outline-primary' />}
        {onBack && <Button onClick={onBack} value={langs[lang]['back']} extClass='btn-outline-secondary' />}
      </div>
    </div>
  );
};
