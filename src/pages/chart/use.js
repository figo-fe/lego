import React, { useState, useEffect } from 'react';
import { Wrap, Charts } from '../../components';
import { CHART } from '../../config/apis';
import { axios } from '../../common/utils';

export const ChartUse = props => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const id = props.match.params.id;
    axios('GET', CHART, { id }).then(res => setConfig(JSON.parse(res.data.config)));
  }, [props.match.params.id]);

  return (
    <Wrap>
      <div className='lego-card'>{config && <Charts config={config}></Charts>}</div>
    </Wrap>
  );
};
