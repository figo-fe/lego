import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Pagination from 'rc-pagination';
import { SettingContext } from '../../config/context';
import { axios, toast, buildUrl, findByPath, popup, dateFormat, buildApi, kv } from '../../common/utils';
import { TableToolBar } from './toolbar';

import 'rc-pagination/assets/index.css';
import './index.scss';

const icons = ['file-alt', 'podcast', 'paper-plane', 'database', 'columns', 'cube'];

const _Table = props => {
  const { config } = props;
  const checked = config && config.base && config.cols;
  const context = useContext(SettingContext);
  const defaultPageNo = kv('pageNo') || 1;
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(''); // key-ase, key-desc
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(null);
  const [pageNo, setPageNo] = useState(defaultPageNo);
  const [multiNum, setMultiNum] = useState(0);
  const [cols, setCols] = useState(config.cols);
  const [hack, setHack] = useState(true);

  // 初始化数据
  useEffect(() => {
    const $ = window.$;
    if (checked && context.baseUrl !== void 0) {
      const api = buildApi(context.baseUrl, config.base.api);
      axios('GET', buildUrl(api, { sort, ...search, pageNo }))
        .then(res => {
          setLoading(false);
          setTableList(findByPath(res, config.base.path) || []);

          // 分页数据
          const pageFix = window._pageFix_ || function () {};
          setPage(pageFix(res.data) || res.data.page);

          // 滚动置顶
          document.querySelector('.main-content').scrollTop = 0;

          // 绑定多选事件
          $('.multi-box').on('click', function () {
            if (this.className.indexOf('check') > 0) {
              this.classList.remove('fa-check-square');
              this.classList.add('fa-square');
            } else {
              this.classList.remove('fa-square');
              this.classList.add('fa-check-square');
            }

            // 更新已选个数
            setMultiNum($('.table-tbody .fa-check-square').length);
          });
        })
        .catch(err => {
          toast('加载失败');
          setLoading(false);
          console.log(err);
        });
    }

    return () => {
      // 取消复选框事件
      $('.multi-box').off('click');

      // 清除多选框状态
      setMultiNum(0);
      $('.table-list .fa-check-square').removeClass('fa-check-square').addClass('fa-square');
    };
  }, [checked, context.baseUrl, config.base, sort, search, pageNo, hack]);

  if (!checked) return <div>data or config error...</div>;

  function onClickHandle(row, handle) {
    let url = buildUrl(handle.url, row);
    url = buildUrl(url, row);
    switch (handle.action) {
      case 'open':
        window.open(url);
        break;

      case 'link':
        if (/^\/(form|table|chart|board)\//.test(url)) {
          props.history.push(url);
        } else {
          window.location.assign(url);
        }
        break;

      case 'api':
        url = buildApi(context.baseUrl, url);
        let isComfirm = false;
        if (/[?&]handle_confirm=0$/.test(url)) {
          isComfirm = true;
        } else if (window.confirm(`是否${handle.name}${row.name ? ' [' + row.name + '] ' : ''}？`)) {
          isComfirm = true;
        }
        if (isComfirm) {
          axios('POST', url.replace(/[?&]handle_confirm=0$/, ''))
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
        return `<div style="height:35px"><audio style="height:35px;outline:none" controls="controls" src="${value}">浏览器不支持</audio></div>`;

      case 'video':
        return `<div style="height:150px;margin:10px 0"><video style="width:200px;height:150px;outline:none" controls="controls" src="${value}" >浏览器不支持</video></div>`;

      default:
        return value;
    }
  }

  const { handles = [] } = config;
  const hasHandle = handles.length > 0;
  const searchFields = config.cols.filter(col => col.fn.indexOf('search') !== -1);

  return (
    <div>
      <TableToolBar
        cols={config.cols}
        toolbar={config.toolbar}
        search={searchFields}
        onClickHandle={onClickHandle}
        onSearch={query => {
          setPageNo(1);
          setSearch(query);
        }}
        onFilter={filter => setCols(config.cols.filter(({ key }) => filter.indexOf(key) >= 0))}
      />
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
                          $(`.multi-${key}-col`).removeClass('fa-check-square').addClass('fa-square');

                          setMultiNum(0);
                        } else {
                          el.className = 'far fa-check-square';
                          $(`.multi-${key}-col`).removeClass('fa-square').addClass('fa-check-square');

                          setMultiNum(page.pageSize);
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
                        {handle.icon !== 'none' && <i className={'fas fa-' + (handle.icon || icons[i])} />}
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
            showTotal={all => `${multiNum > 0 ? '已选' + multiNum + '，' : ''}共${all}条数据`}
            pageSize={page.pageSize || 20}
            current={+pageNo}
            prevIcon={<i className='fas fa-chevron-left' />}
            nextIcon={<i className='fas fa-chevron-right' />}
          />
        </div>
      )}
    </div>
  );
};
export const Table = withRouter(_Table);
