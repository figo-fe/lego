import React, { useState, useEffect } from 'react';

export const TableToolBar = ({ search = [], toolbar = [], cols = [], onClickHandle, onSearch, onFilter }) => {
  const [init, setInit] = useState(false);
  const [filter, setFilter] = useState(cols.map(({ key }) => key));
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const $ = window.$;

    // 点击空白区域 收起筛选列
    $('body').on('click.hideFilterPop', evt => {
      const isOut = $(evt.target).parents('#toolbar_filter_button').length === 0;
      const isSelf = evt.target.id === 'toolbar_filter_button';
      if (isOut && !isSelf) {
        setShowFilter(false);
      }
    });

    setInit(true);

    return () => {
      $('body').off('click.hideFilterPop');
    };
  }, []);

  const renderTool = (tool, idx) => {
    switch (tool.type) {
      case 'input':
        return (
          <input
            key={`${tool.key}-${idx}`}
            name={tool.key}
            style={{ width: tool.width ? parseInt(tool.width) : undefined }}
            className='form-control'
            placeholder={`请输入${tool.name}`}
            id={`toolbar_input_${tool.key}`}
          />
        );

      case 'choices':
        const { source_type } = tool.choices_opts; // list, api
        const list = source_type === 'list' ? tool.choices_opts.source_data.split(';') : [];

        if (!init) {
          setTimeout(() => {
            const _choices = new window.Choices(`#toolbar_choices_${tool.key}`, {
              shouldSort: false,
              itemSelectText: '',
              searchEnabled: list.length > 10,
              choices: list.map(item => {
                const [value, label] = item.split(':');
                return { value, label };
              }),
            });

            // 自定义更新数据
            if (source_type === 'api') {
              const fn = tool.choices_opts.source_data;
              typeof window[fn] === 'function' && window[fn](_choices);
              delete window[fn];
            }
          });
        }
        return (
          <select
            key={`${tool.key}-${idx}`}
            id={`toolbar_choices_${tool.key}`}
            name={tool.key}
            className='form-control'
          />
        );

      case 'datepicker':
        const { mode, showtime, format } = tool.datepicker_opts;
        setTimeout(() => {
          window.flatpickr(`#toolbar_datepicker_${tool.key}`, {
            enableTime: showtime,
            dateFormat: format,
            mode,
          });
        });
        return (
          <input
            key={`${tool.key}-${idx}`}
            name={tool.key}
            id={`toolbar_datepicker_${tool.key}`}
            style={{ width: tool.width ? parseInt(tool.width) : (mode === 'range' ? 2 : 1) * 120 }}
            className='form-control'
            autoComplete='off'
          />
        );

      case 'button':
        const { style, url, icon, action } = tool.button_opts;
        return (
          <button
            key={`${tool.key}-${idx}`}
            id={`toolbar_button_${tool.key}`}
            className={`btn btn-sm btn-${style}`}
            style={{ width: tool.width ? parseInt(tool.width) : undefined, marginRight: 10 }}
            onClick={() => {
              const query = {};
              const multiReg = url.match(/{{multi-[^}]+}}/g);
              const $ = window.$;

              document.querySelectorAll('.toolbar-row .form-control').forEach(input => {
                query[input.name] = input.value;
              });

              if (multiReg) {
                multiReg.forEach(k => {
                  const key = k.match(/{{(multi-[^}]+)}}/).pop();
                  const selected = $(`.${key}-col`).filter('.fa-check-square');
                  query[key] = $.map(selected, el => $(el).attr('data')).join(',');
                });
              }

              onClickHandle(query, { name: tool.name, url, action });
            }}>
            {icon && <i style={{ marginRight: 6 }} className={'fas fa-' + icon} />}
            <span>{tool.name}</span>
          </button>
        );

      case 'custom':
        return (
          <div
            className='toolbar-custom'
            key={`${tool.key}-${idx}`}
            id={`toolbar_custom_${tool.key}`}
            style={{ width: tool.width ? parseInt(tool.width) : undefined }}
            dangerouslySetInnerHTML={{ __html: tool.custom_opts.html }}
          />
        );

      case 'break':
        return <div key={tool.key} style={{ float: 'left', width: '100%' }} />;

      default:
        return null;
    }
  };

  return (
    <div className='toolbar-row clearfix'>
      <button
        className='btn btn-sm btn-info'
        id='toolbar_filter_button'
        style={{ marginRight: 10, position: 'relative' }}
        onClick={() => setShowFilter(!showFilter)}>
        <i style={{ marginRight: 8 }} className='fas fa-th' />
        <i className='fas fa-angle-down' />
        {showFilter && (
          <div className='toolbar-filter-pop'>
            {cols.map(({ key, name }) => (
              <div
                key={key}
                className='filter-item'
                onClick={evt => {
                  let res = [];
                  if (filter.indexOf(key) >= 0) {
                    res = filter.filter(item => item !== key);
                  } else {
                    res = filter.concat(key);
                  }
                  setFilter(res);
                  onFilter(res);
                  evt.stopPropagation();
                }}>
                <i
                  style={{ width: 14, marginRight: 5 }}
                  className={'far fa-' + (filter.indexOf(key) >= 0 ? 'check-square' : 'square')}></i>
                <span>{name || key}</span>
              </div>
            ))}
          </div>
        )}
      </button>
      {toolbar.map((tool, idx) => renderTool(tool, idx))}
      {search.map(item => (
        <input
          key={item.key}
          name={`search_${item.key}`}
          className='form-control'
          id={`toolbar_search_${item.key}`}
          placeholder={`输入${item.name}`}
        />
      ))}
      {search.length > 0 && (
        <button
          onClick={() => {
            const query = {};
            document.querySelectorAll('.toolbar-row .form-control').forEach(input => {
              if (input.name.indexOf('search_') === 0) {
                query[input.name.slice(7)] = input.value;
              }
            });
            onSearch(query);
          }}
          className='btn btn-sm btn-success'>
          查询
        </button>
      )}
    </div>
  );
};
