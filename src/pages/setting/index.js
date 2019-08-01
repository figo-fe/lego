import React, { useCallback } from 'react';
import Wrap from '../../components/wrap';
import { initEditor } from '../../common/utils';
import { setting } from '../../config/schemas';

export default () => {
  const configRef = useCallback(node => {
    configRef.current = initEditor(node, setting, {
      disable_collapse: true
    });
  }, []);

  function doSave() {}

  return (
    <Wrap>
      <div className="lego-card">
        <div ref={configRef} />
        <div className="btns-row">
          <button
            onClick={doSave}
            type="button"
            className="btn btn-success btn-sm"
          >
            保存
          </button>
        </div>
      </div>
    </Wrap>
  );
};
