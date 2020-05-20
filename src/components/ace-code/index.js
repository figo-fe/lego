import React, { useRef, useEffect } from 'react';

export const AceCode = ({ code = '', type = 'json', onReady, opts = {}, height = '100%' }) => {
  const container = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    const ace = window.ace;
    const editor = ace.edit(container.current, Object.assign({ mode: 'ace/mode/' + type, tabSize: 2 }, opts));

    editor.setTheme('ace/theme/monokai');
    editor.getSession().setUseWorker(false);
    editor.setValue(code, 1);

    if (typeof onReadyRef.current === 'function') {
      onReadyRef.current(editor);
    }

    return () => {
      editor.destroy();
    };
  }, [code, type, opts]);

  return <div style={{ height }} ref={container}></div>;
};
