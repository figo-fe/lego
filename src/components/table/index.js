import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Pagination from 'rc-pagination';
import { SettingContext } from '../../config/context';
import { axios, toast, buildUrl, findByPath, popup, dateFormat } from '../../common/utils';

import 'rc-pagination/assets/index.css';
import './index.scss';

const icons = ['file-alt', 'podcast', 'paper-plane', 'database', 'columns', 'cube'];

const _Table = props => {
  const { config } = props;
  const checked = config && config.base && config.cols;
  const context = useContext(SettingContext);
  const defaultPageNo = (window.location.search.match(/pageNo=(\d+)/) || []).pop() || 1;
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(''); // key-ase, key-desc
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(null);
  const [pageNo, setPageNo] = useState(defaultPageNo);
  const [hack, setHack] = useState(true);

  // 初始化数据
  useEffect(() => {
    if (checked && context.baseUrl !== void 0) {
      const api = (/^(http|\/\/)/.test(config.base.api) ? '' : context.baseUrl) + config.base.api;
      axios('GET', buildUrl(api, { sort, ...search, pageNo }))
        .then(res => {
          setLoading(false);
          setTableList(findByPath(res, config.base.path) || []);

          // 分页数据
          const pageFix = window._pageFix_ || function() {};
          setPage(pageFix(res.data) || res.data.page);

          // 滚动置顶
          document.querySelector('.main-content').scrollTop = 0;

          // 绑定多选事件
          window.$('.multi-box').on('click', function() {
            if (this.className.indexOf('check') > 0) {
              this.classList.remove('fa-check-square');
              this.classList.add('fa-square');
            } else {
              this.classList.remove('fa-square');
              this.classList.add('fa-check-square');
            }
          });

          // 清除多选框状态
          window
            .$('.table-list .fa-check-square')
            .removeClass('fa-check-square')
            .addClass('fa-square');
        })
        .catch(err => {
          toast('加载失败');
          setLoading(false);
          console.log(err);
        });
    }
  }, [checked, context.baseUrl, config.base, sort, search, pageNo, hack]);

  if (!checked) return <div>data or config error...</div>;

  const { cols = [], handles = [], toolbar = [] } = config;
  const hasHandle = handles.length > 0;
  const searchBox = cols.filter(col => col.fn.indexOf('search') !== -1);

  function onClickHandle(row, handle) {
    let url = buildUrl(handle.url, row);
    url = buildUrl(url, row);
    switch (handle.action) {
      case 'open':
        window.open(url);
        break;

      case 'link':
        if (/^\/table|chart|board|form\//.test(url)) {
          props.history.push(url);
        } else {
          window.location.assign(url);
        }
        break;

      case 'api':
        url = /^(http|\/\/)/.test(url) ? url : context.baseUrl + url;
        if (window.confirm(`是否${handle.name}${row.name ? ' [' + row.name + '] ' : ''}？`)) {
          axios('POST', url)
            .then(res => {
              toast(`${handle.name}成功`);
              // 刷新当前数据
              setHack(!hack);
              console.log(res);
            })
            .catch(err => {
              toast(`${handle.name}失败\n${String(err)}`);
              console.warn(err);
            });
        }
        break;

      case 'popup':
        popup.show(url).then(() => setHack(!hack));
        break;

      case 'script':
        window.location.assign(`javascript:${url}`);
        break;

      default:
        console.log(handle);
    }
  }

  function fmt(fmt, value) {
    switch (fmt) {
      case 'image':
        return `<a href="${value}" target="_blank"><img src="${value}" style="height:120px;margin:10px 0;" /></a>`;

      case 'datetime':
        return dateFormat(value);

      case 'date':
        return dateFormat(value, 'yyyy-MM-dd');

      case 'time':
        return dateFormat(value, 'hh:mm:ss');

      case 'cny':
        return (value / 100).toFixed(2);

      case 'audio':
        return `<audio src="${value}">浏览器不支持</audio>`;

      case 'video':
        return `<video src="${value}" >浏览器不支持</video>`;

      default:
        return value;
    }
  }

  return (
    <div>
      {(searchBox.length > 0 || toolbar.length > 0) && (
        <div className='toolbar-row clearfix'>
          {toolbar.map((tool, idx) => {
            switch (tool.type) {
              case 'input':
                return (
                  <input
                    key={`${tool.key}-${idx}`}
                    name={tool.key}
                    style={{ width: tool.width ? parseInt(tool.width) : undefined }}
                    className='form-control'
                    placeholder={`请输入${tool.name}`}
                  />
                );

              case 'choices':
                if (tool.choices_opts.source_type === 'list') {
                  const list = tool.choices_opts.source_data.split(';');
                  setTimeout(() => {
                    if (loading && context.baseUrl !== void 0) {
                      new window.Choices(`#toolbar_choices_${tool.key}`, {
                        itemSelectText: '',
                        searchEnabled: list.length > 10,
                        shouldSort: false,
                      });
                    }
                  });
                  return (
                    <select
                      key={`${tool.key}-${idx}`}
                      id={`toolbar_choices_${tool.key}`}
                      name={tool.key}
                      className='form-control'>
                      {list.map(opt => {
                        const [value, display] = opt.split(':');
                        return (
                          <option key={value} value={value}>
                            {display}
                          </option>
                        );
                      })}
                    </select>
                  );
                } else {
                  setTimeout(() => {
                    const fn = tool.choices_opts.source_data;
                    if (typeof window[fn] === 'function') {
                      window[fn](
                        new window.Choices(`#toolbar_choices_${tool.key}`, {
                          silent: 'select-single',
                          items: [],
                          itemSelectText: '',
                          shouldSort: false,
                          searchEnabled: false,
                        }),
                      );
                      delete window[fn];
                    }
                  });
                  return (
                    <select
                      key={`${tool.key}-${idx}`}
                      id={`toolbar_choices_${tool.key}`}
                      name={tool.key}
                      className='form-control'
                    />
                  );
                }

              case 'datepicker':
                const { mode, showtime, format } = tool.datepicker_opts;
                setTimeout(() => {
                  if (loading && context.baseUrl !== void 0) {
                    window.flatpickr(`#toolbar_datepicker_${tool.key}`, {
                      enableTime: showtime,
                      dateFormat: format,
                      mode,
                    });
                  }
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
                          query[key] = $.map($(`.${key}-col`).filter('.fa-check-square'), el =>
                            el.getAttribute('data'),
                          ).join(',');
                        });
                      }

                      onClickHandle(query, { name: tool.name, url, action });
                    }}
                    className={`btn btn-sm btn-${style}`}>
                    {icon && <i style={{ marginRight: 6 }} className={'fas fa-' + icon} />}
                    <span>{tool.name}</span>
                  </button>
                );

              case 'custom':
                return (
                  <div
                    className='toolbar-custom'
                    key={`${tool.key}-${idx}`}
                    style={{ width: tool.width ? parseInt(tool.width) : undefined }}
                    dangerouslySetInnerHTML={{ __html: tool.custom_opts.html }}
                  />
                );

              case 'break':
                return <div key={tool.key} style={{ float: 'left', width: '100%' }} />;

              default:
                return null;
            }
          })}
          {searchBox.map(item => (
            <input
              key={item.key}
              name={`search_${item.key}`}
              className='form-control'
              placeholder={`输入${item.name}`}
            />
          ))}
          {searchBox.length > 0 && (
            <button
              onClick={() => {
                const query = {};
                document.querySelectorAll('.toolbar-row .form-control').forEach(input => {
                  if (input.name.indexOf('search_') === 0) {
                    query[input.name.slice(7)] = input.value;
                  }
                });
                setSearch(query);
              }}
              className='btn btn-sm btn-success'>
              查询
            </button>
          )}
        </div>
      )}
      <table className='table-list'>
        <thead className='table-thead'>
          <tr>
            {cols.map(col => {
              let key = col.key;
              let showSort = false;
              let sortIcon = 'sort';

              if (col.fn.indexOf('sort') >= 0) {
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
                    showSort && setSort(sort === `${key}-desc` ? `${key}-asc` : `${key}-desc`);
                  }}>
                  {col.fn.indexOf('multi') >= 0 && (
                    <i
                      className='far fa-square'
                      onClick={evt => {
                        const el = evt.target;
                        const $ = window.$;
                        if (el.className.indexOf('check') > 0) {
                          el.className = 'far fa-square';
                          $(`.multi-${key}-col`)
                            .removeClass('fa-check-square')
                            .addClass('fa-square');
                        } else {
                          el.className = 'far fa-check-square';
                          $(`.multi-${key}-col`)
                            .removeClass('fa-square')
                            .addClass('fa-check-square');
                        }
                        evt.stopPropagation();
                      }}
                    />
                  )}
                  <span>{col.name || key}</span>
                  {showSort && <em title='排序' className={'fas fa-' + sortIcon} />}
                </th>
              );
            })}
            {hasHandle && (
              <th width={handles.map(word => word.name).join('').length * 14 + handles.length * 35 + 20}>操作</th>
            )}
          </tr>
        </thead>
        <tbody className='table-tbody'>
          {tableList.length === 0 ? (
            <tr>
              <td colSpan={cols.length + (hasHandle ? 1 : 0)}>{loading ? '加载中...' : '暂无数据'}</td>
            </tr>
          ) : (
            tableList.map((row, idx) => (
              <tr key={idx}>
                {cols.map(item => {
                  let content = fmt(item.fmt, row[item.key] === void 0 ? '--' : row[item.key]);
                  if (typeof window._colFix_ === 'function') {
                    content = window._colFix_(item.key, content, row) || content;
                  }

                  if (item.fn.indexOf('multi') >= 0) {
                    content =
                      `<i class="far fa-square multi-box multi-${item.key}-col" data="${encodeURIComponent(
                        row[item.key],
                      )}"></i>` + content;
                  }
                  return <td key={item.key} dangerouslySetInnerHTML={{ __html: content }} />;
                })}
                {hasHandle && (
                  <td>
                    {handles.map((handle, i) => (
                      <span onClick={() => onClickHandle(row, handle)} key={i} className='handle'>
                        <i className={'fas fa-' + (handle.icon || icons[i])} />
                        <em>{handle.name}</em>
                      </span>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {page && page.total > page.pageSize && (
        <div className='pages'>
          <Pagination
            onChange={pn => setPageNo(pn)}
            total={page.total || 0}
            showTotal={all => `共${all}条数据`}
            pageSize={page.pageSize || 20}
            defaultCurrent={+pageNo}
            prevIcon={<i className='fas fa-chevron-left' />}
            nextIcon={<i className='fas fa-chevron-right' />}
          />
        </div>
      )}
    </div>
  );
};
export const Table = withRouter(_Table);
