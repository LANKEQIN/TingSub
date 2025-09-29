import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';

const BarChart = ({ data, width = 300, height = 180, barColor = '#4f46e5' }) => {
  const maxVal = useMemo(() => Math.max(...data, 1), [data]);
  const barWidth = Math.floor((width - 20) / data.length);
  return (
    <Svg width={width} height={height}>
      {data.map((v, i) => {
        const h = Math.round((v / maxVal) * (height - 20));
        return (
          <Rect
            key={i}
            x={10 + i * barWidth}
            y={height - h - 10}
            width={barWidth - 8}
            height={h}
            rx={6}
            fill={barColor}
          />
        );
      })}
    </Svg>
  );
};

export default BarChart;