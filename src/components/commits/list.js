import React, { useEffect, useRef, useState } from 'react';
import DiffMatchPatch from 'diff-match-patch';
import { Table } from '../table';
import { toast, axios, popup } from '../../common/utils';

import './commits.scss';

export const CommitList = ({ show = false, type, id, onClose }) => {
  const elementRef = useRef(null);
  const [nativeShow, setNativeShow] = useState(show);
  const codeSplit = '\n\n---------------------------------扩展---------------------------------\n\n';

  const host = process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:8081';
  const apiPrefix = `//${host}/lego-api/`;
  const config = useRef({
    base: {
      name: '修改记录',
      api: `${apiPrefix}log/list?mod_type=${type}&data_id=${id}&pn={{pageNo}}`,
      path: 'data.list',
    },
    cols: [
      { key: 'id', name: 'ID', width: '80', fn: ['multi'] },
      { key: 'time', name: 'Time', width: '200', fn: [] },
      { key: 'operator', name: 'Operator', width: '', fn: [] },
    ],
    handles: [
      {
        key: 'view',
        name: '查看',
        icon: 'eye',
        url: 'view_config({{id}})',
        action: 'script',
      },
      {
        key: 'recover',
        name: '恢复',
        icon: 'sync-alt',
        url: `${apiPrefix}log/recover?id={{id}}`,
        action: 'api',
      },
    ],
    toolbar: [
      {
        type: 'button',
        name: '查看版本差异',
        key: 'diff_button',
        button_opts: {
          style: 'info btn-sm',
          action: 'script',
          url: 'diff_code("{{multi-id}}")',
        },
      },
    ],
  });

  useEffect(() => {
    if (show) {
      setNativeShow(true);
      setTimeout(() => {
        elementRef.current.style.transform = 'translateX(0)';
      }, 50);
    } else {
      if (elementRef.current) {
        elementRef.current.style.transform = 'translateX(100%)';
        setTimeout(() => {
          setNativeShow(false);
        }, 200);
      }
    }
  }, [show]);

  window.diff_code = ids => {
    const arr = ids.split(',');

    if (arr.length === 2) {
      const [id1, id2] = arr;
      Promise.all([axios('GET', `${apiPrefix}log?id=${id1}`), axios('GET', `${apiPrefix}log?id=${id2}`)]).then(
        ([id1Res, id2Res]) => {
          const c1 = JSON.parse(id1Res.data.config);
          const c2 = JSON.parse(id2Res.data.config);
          const dmp = new DiffMatchPatch();
          let code1, code2;

          if (c1.schema && c2.schema) {
            c1.schema = JSON.parse(c1.schema);
            c2.schema = JSON.parse(c2.schema);
          }

          if (c1.config && c2.config) {
            c1.config = JSON.parse(c1.config);
            c2.config = JSON.parse(c2.config);
          }

          code1 = JSON.stringify(c1, null, 2);
          code2 = JSON.stringify(c2, null, 2);

          if (c1.ext && c2.ext) {
            code1 += codeSplit + c1.ext;
            code2 += codeSplit + c2.ext;
          }

          const diffs = dmp.diff_main(code2, code1);

          dmp.diff_cleanupSemantic(diffs);

          const html = dmp.diff_prettyHtml(diffs).replace(/&para;/g, '');
          popup.show(`<div class="commits-diff"><pre class="commits-code">${html}</pre></div>`, 650, 600);
        },
      );
    } else {
      toast('请选择2个要对比的版本');
    }
  };

  window.view_config = id => {
    axios('GET', `${apiPrefix}log`, { id }).then(res => {
      if (res.code === 0) {
        const code = res.data.config ? JSON.parse(res.data.config) : null;
        let html;

        if (code && code.schema) {
          code.schema = JSON.parse(code.schema);
        }
        if (code && code.config) {
          code.config = JSON.parse(code.config);
        }

        html = JSON.stringify(code, null, 2);

        if (code && code.ext) {
          html += codeSplit + code.ext;
        }

        popup.show(
          `<div class="commits-diff"><textarea readonly="true" class="commits-code">${html}</textarea></div>`,
          650,
          600,
        );
      }
    });
  };

  if (!nativeShow) return null;

  return (
    <div className='commits-wp'>
      <div className='commits-main' ref={elementRef}>
        <i className='commits-close fa fa-times' onClick={onClose} />
        <div className='commits-title'>修改记录</div>
        <div className='commits-list'>
          <Table config={config.current} />
        </div>
      </div>
    </div>
  );
};
