import React from 'react';
import { toast } from '../../common/utils';

const icons = ['file-alt', 'podcast', 'paper-plane', 'database', 'columns', 'cube'];

export const Table = props => {
  const renderTds = row =>
    props.th.map(item => {
      if (item.key === 'handles') {
        return (
          <td key={item.key}>
            {row.handles.map((handle, idx) => (
              <span
                key={idx}
                className='handle'
                onClick={() => {
                  if (typeof props.handle === 'function') {
                    props.handle(handle.action, row);
                  } else {
                    toast('无法处理，请检查配置');
                  }
                }}>
                <i className={'fas fa-' + (handle.icon || icons[idx])} />
                <em>{handle.name || handle.key}</em>
              </span>
            ))}
          </td>
        );
      } else {
        return <td key={item.key}>{row[item.key] || '--'}</td>;
      }
    });

  return (
    <div>
      <table className='table-list'>
        <thead className='table-thead'>
          <tr>
            {props.th.map(item => (
              <th key={item.key} style={{ width: item.width ? item.width + 'px' : undefined }}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='table-tbody'>
          {props.list.length === 0 ? (
            <tr>
              <td colSpan={props.th.length}>暂无数据</td>
            </tr>
          ) : (
            props.list.map((row, idx) => <tr key={idx}>{renderTds(row)}</tr>)
          )}
        </tbody>
      </table>
      {/* <div className="lego-pagination">
        <span>上一页</span>
        <span className="cur">1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>下一页</span>
      </div> */}
    </div>
  );
};
