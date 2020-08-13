import React from 'react';
import { langs, lang } from '@lang';

export default ({ cols, sort, handles, width, onSort = () => {}, updateMultiNum = () => {} }) => {
  const hasHandle = handles.length > 0;

  function toggleSelect(evt, key) {
    const el = evt.target;
    const $ = window.$;

    if (el.className.indexOf('check') > 0) {
      el.className = 'far fa-square';
      $(`.multi-${key}-col`).removeClass('fa-check-square').addClass('fa-square');
      updateMultiNum(0);
    } else {
      el.className = 'far fa-check-square';
      $(`.multi-${key}-col`).removeClass('fa-square').addClass('fa-check-square');
      updateMultiNum(document.querySelectorAll('.table-tbody .fa-check-square').length);
    }
    evt.stopPropagation();
  }

  return (
    <thead className='table-thead'>
      <tr>
        {cols.map(col => {
          let key = col.key;
          let showSort = false;
          let sortIcon = 'sort';

          if (col.fn.includes('sort')) {
            showSort = true;
            switch (sort) {
              case `${key}-asc`:
                sortIcon = 'caret-up';
                break;

              case `${key}-desc`:
                sortIcon = 'caret-down';
                break;

              default:
                sortIcon = 'sort';
            }
          }

          return (
            <th
              className={'table-th' + (showSort ? ' th-sort' : '')}
              key={key}
              width={col.width ? col.width : undefined}
              onClick={() => {
                showSort && onSort(sort === `${key}-desc` ? `${key}-asc` : `${key}-desc`);
              }}>
              {col.fn.includes('multi') && <i className='far fa-square' onClick={evt => toggleSelect(evt, key)} />}
              <span>{col.name || key}</span>
              {showSort && <em title={langs[lang]['order']} className={'fas fa-' + sortIcon} />}
            </th>
          );
        })}
        {hasHandle && (
          <th style={{ width }} className='table-th-handle'>
            {langs[lang]['operation']}
          </th>
        )}
      </tr>
    </thead>
  );
};
