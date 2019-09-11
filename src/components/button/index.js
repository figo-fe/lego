import React from 'react';

export const Button = ({ value, extClass, onClick }) => {
  let classList = ['btn', 'btn-sm'];

  if (extClass) {
    classList = classList.concat(extClass.split(' '));
  }

  return (
    <button className={classList.join(' ')} onClick={onClick}>
      {value}
    </button>
  );
};
