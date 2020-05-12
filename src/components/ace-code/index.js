import React, { useRef, useEffect } from 'react';

export const AceCode = ({ code = '', type = 'json', onReady }) => {
  const codeRef = useRef(null);
  const aceEditor = useRef(null);

  useEffect(() => {
    const ace = window.ace;
    if (!aceEditor.current) {
      aceEditor.current = ace.edit(codeRef.current, { mode: 'ace/mode/' + type });
      aceEditor.current.setTheme('ace/theme/monokai');
      aceEditor.current.getSession().setUseWorker(false);

      if (typeof onReady === 'function') {
        onReady(aceEditor.current);
      }
    }

    aceEditor.current.setValue(code, -1);
    aceEditor.current.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type]);

  return <div style={{ height: '100%' }} ref={codeRef}></div>;
};
