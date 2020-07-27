import React, { useCallback, useEffect, useContext } from 'react';
import { Wrap, Button } from '../../components';
import { initEditor, axios, toast } from '../../common/utils';
import { SettingContext } from '../../config/context';
import { setting } from '../../config/schema';
import { SETTING, BASENAME } from '../../config/apis';

export const Setting = () => {
  const context = useContext(SettingContext);

  const configRef = useCallback(node => {
    configRef.current = initEditor(node, setting, { disable_collapse: true });
  }, []);

  useEffect(() => {
    if (context.name) {
      const { name, baseUrl, permissionApi, homeUrl, sideMenu, uploadFn } = context;

      // 注意增加配置时，要兼容LEGO老版本
      configRef.current.setValue({ name, baseUrl, permissionApi, homeUrl, sideMenu, uploadFn });
    }
  }, [context, configRef]);

  function doSave() {
    const _editor = configRef.current;
    const validates = _editor.validate();

    if (validates.length > 0) {
      toast(`表单填写有误：<br />${validates.map(err => err.path + ': ' + err.message).join('<br />')}`);
    } else {
      const { name, baseUrl, permissionApi, homeUrl, sideMenu, uploadFn } = _editor.getValue();

      axios('POST', SETTING, {
        name,
        baseUrl,
        permissionApi,
        sideMenu,
        uploadFn,
        config: JSON.stringify({ homeUrl }),
      })
        .then(() => {
          toast('保存成功，即将刷新页面');
          setTimeout(() => {
            window.location.reload();
          }, 2e3);
        })
        .catch(err => {
          toast(err.msg);
          console.log(err);
        });
    }
  }

  return (
    <Wrap>
      <div className='lego-card'>
        <div ref={configRef} />
        <div className='btns-row'>
          <Button key='save' value='保存' onClick={doSave} extClass='btn-success' />
          <Button
            key='help'
            onClick={() => window.open(`${BASENAME}/help/setting`)}
            value='帮助'
            extClass='btn-outline-primary'
          />
          <Button
            key='log'
            onClick={() => window.open(`${BASENAME}/log/list`)}
            value='操作日志'
            extClass='btn-outline-info'
          />
          <span className='btn btn-sm text-muted float-right mr-0'>Version {process.env.REACT_APP_VERSION}</span>
        </div>
      </div>
    </Wrap>
  );
};
