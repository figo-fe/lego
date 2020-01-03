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
        })
        .catch(err => {
          toast('加载失败');
          console.log(err);
        });
    }
  }, [checked, context.baseUrl, config.base, sort, search, pageNo, hack]);

  if (!checked) return <div>data or config error...</div>;

  const { cols = [], handles = [] } = config;
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
        popup.show(url);
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
      {searchBox.length > 0 && (
        <div className='search-row clearfix'>
          {searchBox.map(item => (
            <input
              key={item.key}
              name={`search_${item.key}`}
              className='form-control'
              placeholder={`输入${item.name}`}
            />
          ))}
          <button
            onClick={() => {
              const query = {};
              document.querySelectorAll('.search-row .form-control').forEach(input => {
                query[input.name.slice(7)] = input.value;
              });
              setSearch(query);
            }}
            className='btn btn-sm btn-success'>
            查询
          </button>
        </div>
      )}
      <table className='table-list'>
        <thead className='table-thead'>
          <tr>
            {cols.map(col => {
              let key = col.key;
              let showSort = false;
              let sortIcon = 'sort';

              if (/sort/.test(col.fn)) {
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
                  <span>{col.name || key}</span>
                  {showSort && <em title='排序' className={'fas fa-' + sortIcon} />}
                </th>
              );
            })}
            {hasHandle && (
              <th width={handles.map(word => word.name).join('').length * 14 + handles.length * 35 + 15}>操作</th>
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
                  let content = fmt(item.fmt, row[item.key] || '--');
                  if (typeof window._colFix_ === 'function') {
                    content = window._colFix_(item.key, content, row) || content;
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
