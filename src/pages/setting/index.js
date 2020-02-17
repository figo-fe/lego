import React, { useCallback, useEffect, useContext } from 'react';
import { Wrap } from '../../components';
import { initEditor, axios, toast } from '../../common/utils';
import { SettingContext } from '../../config/context';
import { setting } from '../../config/schema';
import { SETTING } from '../../config/apis';

export const Setting = props => {
  const configRef = useCallback(node => {
    configRef.current = initEditor(node, setting, {
      disable_collapse: true,
    });
  }, []);

  const context = useContext(SettingContext);

  useEffect(() => {
    if (context.name) {
      const { name, baseUrl, permissionApi, mode, sideMenu, uploadFn } = context;

      // 注意增加配置时，要兼容LEGO老版本
      configRef.current.setValue({ name, baseUrl, permissionApi, mode, sideMenu, uploadFn });
    }
  }, [context, configRef]);

  function doSave() {
    const _editor = configRef.current;
    const validates = _editor.validate();

    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
    } else {
      const value = _editor.getValue();
      axios('POST', SETTING, value)
        .then(() => {
          const { _menu, _admin } = context;
          props.updateSetting({ _menu, _admin, ...value });
          toast('保存成功，即将刷新页面');
          setTimeout(() => {
            window.location.reload();
          }, 2e3);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  return (
    <Wrap>
      <div className='lego-card'>
        <div ref={configRef} />
        <div className='btns-row'>
          <button onClick={doSave} type='button' className='btn btn-success btn-sm'>
            保存
          </button>
        </div>
      </div>
    </Wrap>
  );
};
