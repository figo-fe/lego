import React, { useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Pagination from 'rc-pagination';
import { SettingContext } from '../../config/context';
import { axios, toast, buildUrl, findByPath, popup, extendOnKey, buildApi, kv } from '../../common/utils';
import { TableToolBar } from './toolbar';
import { langs, lang } from '@lang';

import Thead from './thead';
import Tbody from './tbody';

import 'rc-pagination/assets/index.css';
import './index.scss';

const _Table = props => {
  const context = useContext(SettingContext);
  const defaultPageNo = kv('pageNo') || 1;
  const autoLoad = !!parseInt(kv('auto') || '1'); // 是否自动加载数据，默认为是

  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [sort, setSort] = useState(''); // key-ase, key-desc
  const [search, setSearch] = useState({});
  const [pageNo, setPageNo] = useState(defaultPageNo);
  const [multiNum, setMultiNum] = useState(0);
  const [hack, setHack] = useState(true);

  const pageInfo = useRef(null);
  const oldPageNo = useRef(pageNo);
  const tableConfig = useRef(props.config);

  // 初始化数据
  useEffect(() => {
    const $ = window.$;
    const { api: baseApi, path: basePath } = tableConfig.current.base;

    if (context.baseUrl !== undefined && (autoLoad || Object.keys(search).length > 0)) {
      axios('GET', buildUrl(buildApi(context.baseUrl, baseApi), { sort, ...search, pageNo }))
        .then(res => {
          // 分页数据
          const pageFix = window._pageFix_ || function () {};
          pageInfo.current = pageFix(res.data) || res.data.page;

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
            setMultiNum(document.querySelectorAll('.table-tbody .fa-check-square').length);
          });

          // 数据设为全局，供组件使用
          window._lego_table_data_ = res.data;

          setTableList(findByPath(res, basePath) || []);
          setLoading(false);
        })
        .catch(err => {
          toast(err.desc || err.msg || langs[lang]['load_fail']);
          setLoading(false);
          console.log(err);
        });
    }

    return () => {
      // 卸载数据
      $('.multi-box').off('click');
      $('.table-list .fa-check-square').removeClass('fa-check-square').addClass('fa-square');
    };
  }, [autoLoad, context.baseUrl, sort, search, pageNo, hack]);

  if (context.baseUrl === undefined) return null;

  // 在自定义扩展中强制更新
  window.forceUpdateTable = function () {
    setHack(bool => !bool);
  };

  // 动作处理
  function onClickHandle(row, handle) {
    const url = buildUrl(handle.url, extendOnKey(row, search, 'search'));

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
          window.confirm(`${langs[lang]['confirm']} ${handle.name} ${row.name ? ' [' + row.name + '] ' : ''}？`)
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

  // 操作列宽度
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

  const { cols = [], handles = [], toolbar } = tableConfig.current;
  const searchFields = cols.filter(col => col.fn.includes('search'));
  const page = pageInfo.current;
  const handleWidth = getHandleWidth(handles);
  const tableWidth = cols.reduce((total, col) => total + parseInt(col.width || 0), 0) + handleWidth;

  return (
    <div>
      <TableToolBar
        loading={loading}
        toolbar={toolbar}
        search={searchFields}
        onClickHandle={onClickHandle}
        onSearch={query => {
          setPageNo(1);
          setSearch(query);
        }}
      />
      <div className='table-container'>
        <table className='table-list' style={{ width: tableWidth }}>
          <Thead
            cols={cols}
            sort={sort}
            handles={handles}
            onSort={s => setSort(s)}
            width={handleWidth}
            updateMultiNum={n => setMultiNum(n)}
          />
          <Tbody
            list={tableList}
            cols={cols}
            handles={handles}
            search={search}
            account={{ user: context._user, group: context._group, admin: context._admin }}
            loading={loading}
            onClickHandle={onClickHandle}
          />
        </table>
      </div>
      {page && page.total > 0 && (
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
