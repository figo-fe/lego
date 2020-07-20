import React, { useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Pagination from 'rc-pagination';
import { SettingContext } from '../../config/context';
import { axios, toast, buildUrl, findByPath, popup, dateFormat, buildApi, kv } from '../../common/utils';
import { TableToolBar } from './toolbar';
import { langs, lang } from '@lang';

import 'rc-pagination/assets/index.css';
import './index.scss';

const icons = ['file-alt', 'podcast', 'paper-plane', 'bookmark', 'database', 'columns', 'cube', 'bullseye', 'calendar'];

const _Table = props => {
  const { config } = props;
  const checked = config && config.base && config.cols;
  const context = useContext(SettingContext);
  const defaultPageNo = kv('pageNo') || 1;
  const autoLoad = !!parseInt(kv('auto') || '1'); // 是否自动加载数据，默认为是
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [sort, setSort] = useState(''); // key-ase, key-desc
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(null);
  const [pageNo, setPageNo] = useState(defaultPageNo);
  const [multiNum, setMultiNum] = useState(0);
  const [hack, setHack] = useState(true);
  const oldPageNo = useRef(pageNo);

  // 初始化数据
  useEffect(() => {
    const $ = window.$;
    if (checked && context.baseUrl !== void 0 && (autoLoad || Object.keys(search).length > 0)) {
      const api = buildApi(context.baseUrl, config.base.api);
      axios('GET', buildUrl(api, { sort, ...search, pageNo }))
        .then(res => {
          setTableList(findByPath(res, config.base.path) || []);

          // 分页数据
          const pageFix = window._pageFix_ || function () {};
          setPage(pageFix(res.data) || res.data.page);

          // 切换分页时滚动到顶部
          if (oldPageNo.current !== pageNo) {
            oldPageNo.current = pageNo;
            document.querySelector('.main-content').scrollTop = 0;
          }

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

          // 数据设为全局，供组件使用
          window._lego_table_data_ = res.data;

          setLoading(false);
        })
        .catch(err => {
          toast(err.desc || err.msg || langs[lang]['load_fail']);
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

      // 释放数据
      delete window._lego_table_data_;
    };
  }, [checked, autoLoad, context.baseUrl, config.base, sort, search, pageNo, hack]);

  if (!checked) return <div>data or config error...</div>;

  // 在自定义扩展中强制更新
  window.forceUpdateTable = function () {
    setHack(bool => !bool);
  };

  // 将查询条件合并到数据中
  function extendBySearch(data) {
    const fixSearch = {};

    for (let k in search) {
      fixSearch['search.' + k] = search[k];
    }

    return Object.assign({}, data, fixSearch);
  }

  // 动作处理
  function onClickHandle(row, handle) {
    const url = buildUrl(handle.url, extendBySearch(row));

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
        const api = buildApi(context.baseUrl, url);
        let isComfirm = false;
        if (/[?&]handle_confirm=0$/.test(api)) {
          isComfirm = true;
        } else if (
          window.confirm(`${langs[lang]['confirm']}${handle.name}${row.name ? ' [' + row.name + '] ' : ''}？`)
        ) {
          isComfirm = true;
        }
        if (isComfirm) {
          axios('POST', api.replace(/[?&]handle_confirm=0$/, ''))
            .then(res => {
              toast(langs[lang]['handle_success']);
              // 刷新当前数据
              setHack(!hack);
              console.log(res);
            })
            .catch(err => {
              toast(err.desc || err.msg || langs[lang]['handle_fail']);
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

  function getHandleWidth(handleList) {
    let iconNum = 0; // 图标个数
    let wordNum = 0; // 文字占位数，英文算半个
    let itemNum = handleList.length; // 操作个数

    handleList.forEach(({ icon, name }) => {
      if (icon !== 'none') {
        iconNum++;
      }

      wordNum += name.length - (name.match(/\w+/g) || []).join('').length * 0.55;
    });

    // 最大宽度350，超出换行
    return Math.min(iconNum * 18 + wordNum * 14 + itemNum * 15 + 20, 350);
  }

  const { cols = [], handles = [] } = config;
  const hasHandle = handles.length > 0;
  const searchFields = config.cols.filter(col => col.fn.indexOf('search') !== -1);

  return (
    <div>
      <TableToolBar
        loading={loading}
        toolbar={config.toolbar}
        search={searchFields}
        onClickHandle={onClickHandle}
        onSearch={query => {
          setPageNo(1);
          setSearch(query);
        }}
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

                          setMultiNum($('.table-tbody .fa-check-square').length);
                        }
                        evt.stopPropagation();
                      }}
                    />
                  )}
                  <span>{col.name || key}</span>
                  {showSort && <em title={langs[lang]['order']} className={'fas fa-' + sortIcon} />}
                </th>
              );
            })}
            {hasHandle && <th width={getHandleWidth(handles)}>{langs[lang]['operation']}</th>}
          </tr>
        </thead>
        <tbody className='table-tbody'>
          {tableList.length === 0 ? (
            <tr>
              <td colSpan={cols.length + (hasHandle ? 1 : 0)}>
                {loading ? langs[lang]['loading'] : langs[lang]['no_data']}
              </td>
            </tr>
          ) : (
            tableList.map((row, idx) => (
              <tr key={idx}>
                {cols.map(item => {
                  let content = fmt(item.fmt, row[item.key] === void 0 ? '--' : row[item.key]);
                  if (typeof window._colFix_ === 'function') {
                    content = window._colFix_(item.key, content, extendBySearch(row)) || content;
                  }

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
                          showHandle = new Function('data, account', `return ${handle.show}`)(row, {
                            user: context._user,
                            group: context._group,
                            admin: context._admin,
                          });
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
      </table>
      {page && page.total > page.pageSize && (
        <div className='pages'>
          <Pagination
            onChange={pn => setPageNo(pn)}
            total={page.total || 0}
            showTotal={all =>
              `${langs[lang]['table_selected_number'](multiNum)}${langs[lang]['table_list_total'](all)}`
            }
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
