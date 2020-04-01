import React, { useRef, useContext, useEffect, useCallback } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import { axios, buildUrl, findByPath, buildApi } from '../../common/utils';
import { SettingContext } from '../../config/context';
import './index.scss';

export const Charts = ({ config }) => {
  const chartElementRefs = useRef([]);
  const chartInstanceRefs = useRef([]);
  const context = useContext(SettingContext);

  const updateChart = useCallback((instance, api, data) => {
    axios('GET', buildUrl(api)).then(res => {
      const option = {
        title: {
          text: data.name,
          textStyle: { color: '#369', fontSize: 16 },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
        },
        toolbox: (() => {
          const feature = {};
          data.toolbox.forEach(tool => {
            feature[tool] = {};
            if (tool === 'magicType') {
              feature['magicType']['type'] = ['line', 'bar', 'tiled'];
              feature.restore = {};
            }
          });
          return { feature };
        })(),
        legend: {
          data: data.series.map(({ name }) => name),
        },
        xAxis: {
          data: data.xAxis.indexOf(',') > 0 ? data.xAxis.split(',') : findByPath(res, data.xAxis),
        },
        yAxis: {},
        series: data.series.map(({ name, type, label, path, color }) => {
          return {
            name,
            type,
            label: { show: label === '1', position: 'top' },
            itemStyle: { color },
            data: findByPath(res, path),
          };
        }),
      };
      instance.setOption(option);
    });
  }, []);

  useEffect(() => {
    const baseUrl = context.baseUrl;
    if (config && baseUrl !== void 0) {
      const timer = {};
      config.list.forEach((data, idx) => {
        const el = chartElementRefs.current[idx];
        const instance = (chartInstanceRefs.current[idx] = echarts.init(el, config.theme));
        const api = buildApi(baseUrl, data.api);

        // 依次加载各表数据
        timer[`start_${idx}`] = setTimeout(() => {
          updateChart(instance, api, data);
          if (data.refresh > 0) {
            timer[`refresh_${idx}`] = setInterval(() => {
              updateChart(instance, api, data);
            }, data.refresh * 1000);
          }
        }, 200 * idx);
      });

      return () => {
        // 清除计时器
        Object.keys(timer).forEach(key => {
          const cleanup = /^start/.test(key) ? clearTimeout : clearInterval;
          cleanup(timer[key]);
        });
      };
    }
  }, [config, context.baseUrl, updateChart]);

  return (
    <div className='charts-title'>
      <h2 className='title'>
        {config.name}
        <span className='desc'>{config.desc}</span>
      </h2>
      <div className='row'>
        {config.list.map((chart, idx) => {
          return (
            <div key={idx} className={`col-md-${chart.grid}`}>
              <div
                className='chart-container'
                style={{ height: chart.height }}
                ref={el => (chartElementRefs.current[idx] = el)}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
