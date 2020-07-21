import React from 'react';

export const Button = ({ value, icon, extClass, extStyle = {}, onClick }) => {
  let classList = ['btn', 'btn-sm'];

  if (extClass) {
    classList = classList.concat(extClass.split(' '));
  }

  return (
    <button style={extStyle} className={classList.join(' ')} onClick={onClick}>
      {!!icon && <i className={'mr-1 fa fa-' + icon} />}
      {value}
    </button>
  );
};
