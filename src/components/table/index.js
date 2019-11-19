import React, { useState, useEffect, useContext } from 'react';
import Pagination from 'rc-pagination';
import { SettingContext } from '../../config/context';
import { axios, toast, buildUrl, findByPath } from '../../common/utils';

import 'rc-pagination/assets/index.css';
import './index.scss';

const icons = ['file-alt', 'podcast', 'paper-plane', 'database', 'columns', 'cube'];

export const Table = props => {
  const { config } = props;
  const checked = config && config.base && config.cols;
  const context = useContext(SettingContext);
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(''); // key-ase, key-desc
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(null);
  const [pageNo, setPageNo] = useState(1);

  // 初始化数据
  useEffect(() => {
    if (checked && context.baseUrl !== void 0) {
      const api = (/^(http|\/\/)/.test(config.base.api) ? '' : context.baseUrl) + config.base.api;
      axios('GET', buildUrl(api, { sort, ...search, pageNo }))
        .then(res => {
          setLoading(false);
          setTableList(findByPath(res, config.base.path) || []);

          // 分页数据
          const pageFix = window.__pageFix__ || function() {};
          setPage(pageFix(res.data) || res.data.page);

          // 滚动置顶
          document.querySelector('.main-content').scrollTop = 0;
        })
        .catch(err => {
          toast('加载失败');
          console.log(err);
        });
    }
  }, [checked, context.baseUrl, config.base, sort, search, pageNo]);

  if (!checked) return <div>data or config error...</div>;

  const { cols = [], handles = [] } = config;
  const hasHandle = handles.length > 0;
  const searchBox = cols.filter(col => col.fn.indexOf('search') !== -1);

  function onClickHandle(row, handle) {
    if (handle.action === 'open') {
      window.open(buildUrl(handle.url, row));
    } else {
      if (window.confirm(`是否${handle.name}${row.name ? ' [' + (row.name || row.key) + '] ' : ''}？`)) {
        const api = (/^(http|\/\/)/.test(handle.url) ? '' : context.baseUrl) + handle.url;
        axios('POST', buildUrl(api, row))
          .then(res => {
            toast(`${handle.name}成功`);
            setTimeout(() => {
              window.location.reload();
            }, 2e3);
            console.log(res);
          })
          .catch(err => {
            toast(`${handle.name}失败\n${String(err)}`);
            console.warn(err);
          });
      }
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
            搜索
          </button>
        </div>
      )}
      <table className='table-list'>
        <thead className='table-thead'>
          <tr>
            {cols.map(col => {
              let key = col.key;
              let sortIcon = '';

              if (col.fn.indexOf('sort') !== -1) {
                if (sort === `${key}-asc`) {
                  sortIcon = 'caret-up';
                } else if (sort === `${key}-desc`) {
                  sortIcon = 'caret-down';
                } else {
                  sortIcon = 'sort';
                }
              }

              return (
                <th className='table-th' key={key} width={col.width ? col.width : undefined}>
                  <span>{col.name || key}</span>
                  {sortIcon && (
                    <em
                      onClick={() => setSort(sort === `${key}-desc` ? `${key}-asc` : `${key}-desc`)}
                      title='排序'
                      className={'fas fa-' + sortIcon}
                    />
                  )}
                </th>
              );
            })}
            {hasHandle && <th width={handles.length * 80}>操作</th>}
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
                  let content = row[item.key] || '--';
                  if (typeof window.__colFix__ === 'function') {
                    content = window.__colFix__(item.key, content) || content;
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
            pageSize={page.pageSize || 20}
            prevIcon={<i className='fas fa-chevron-left' />}
            nextIcon={<i className='fas fa-chevron-right' />}
          />
        </div>
      )}
    </div>
  );
};
