import React from 'react';
import { langs, lang } from '@lang';
import { dateFormat, extendOnKey } from '../../common/utils';

export default ({ list, cols, handles, loading, search = {}, account = {}, onClickHandle }) => {
  const hasHandle = handles.length > 0;
  const icons = [
    'file-alt',
    'podcast',
    'paper-plane',
    'bookmark',
    'database',
    'columns',
    'cube',
    'bullseye',
    'calendar',
  ];

  // 格式化列
  function fmt(fmt, value) {
    switch (fmt) {
      case 'image':
        return `<a href="${value}" target="_blank"><img src="${value}" style="height:100px;margin:8px 0;" /></a>`;

      case 'datetime':
        return dateFormat(value);

      case 'date':
        return dateFormat(value, 'yyyy-MM-dd');

      case 'time':
        return dateFormat(value, 'hh:mm:ss');

      case 'cny':
        return (value / 100).toFixed(2);

      case 'audio':
        return `<div style="height:35px"><audio style="height:35px;outline:none" controls="controls" src="${value}">浏览器不支持</audio></div>`;

      case 'video':
        return `<div style="height:150px;margin:10px 0"><video style="width:200px;height:150px;outline:none" controls="controls" src="${value}" >浏览器不支持</video></div>`;

      default:
        return value;
    }
  }

  return (
    <tbody className='table-tbody'>
      {list.length === 0 ? (
        <tr>
          <td colSpan={cols.length + (hasHandle ? 1 : 0)}>
            {loading ? langs[lang]['loading'] : langs[lang]['no_data']}
          </td>
        </tr>
      ) : (
        list.map((row, idx) => (
          <tr key={idx}>
            {cols.map(item => {
              let content = row[item.key];

              if (typeof window._colFix_ === 'function') {
                content = window._colFix_(item.key, content, extendOnKey(row, search, 'search')) || content || '--';
              }

              content = fmt(item.fmt, content);

              if (item.fn.indexOf('multi') >= 0) {
                content =
                  `<i class="far fa-square multi-box multi-${item.key}-col" data="${encodeURIComponent(
                    row[item.key],
                  )}"></i>` + content;
              }
              return <td key={item.key} dangerouslySetInnerHTML={{ __html: content || '--' }} />;
            })}
            {hasHandle && (
              <td>
                {handles.map((handle, i) => {
                  // 根据权限、用户、数据控制操作显示
                  let showHandle = true;

                  if (handle.show) {
                    try {
                      // eslint-disable-next-line no-new-func
                      showHandle = new Function('data, account', `return ${handle.show}`)(row, account);
                    } catch (err) {
                      console.warn(String(err));
                      showHandle = false;
                    }
                  }

                  if (!(showHandle === false)) {
                    return (
                      <span onClick={() => onClickHandle(row, handle)} key={i} className='handle'>
                        {handle.icon !== 'none' && <i className={'fas fa-' + (handle.icon || icons[i])} />}
                        <em>{handle.name}</em>
                      </span>
                    );
                  } else {
                    return null;
                  }
                })}
              </td>
            )}
          </tr>
        ))
      )}
    </tbody>
  );
};
