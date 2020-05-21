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

    // 高度自适应
    if (height === 'auto') {
      editor.setOption('maxLines', opts.maxLines || 150);
    }

    // 回调ace实例
    if (typeof onReadyRef.current === 'function') {
      onReadyRef.current(editor);
    }

    return () => {
      editor.destroy();
    };
  }, [code, type, opts, height]);

  return <div style={{ height }} ref={container}></div>;
};
