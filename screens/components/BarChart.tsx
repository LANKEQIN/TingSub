import React, { useMemo, useState } from 'react';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

const formatCurrency = (val, symbol = '¥') => {
  if (val == null || Number.isNaN(val)) return '-';
  return `${symbol}${Math.round(val).toLocaleString('zh-CN')}`;
};

type BarChartProps = {
  data?: number[]
  labels?: string[]
  width?: number
  height?: number
  barColor?: string
  gridColor?: string
  axisLabelColor?: string
  currencySymbol?: string
  showValues?: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  labels = [],
  width = 300,
  height = 200,
  barColor = '#4f46e5',
  gridColor = '#E5E7EB',
  axisLabelColor = '#6b7280',
  currencySymbol = '¥',
  showValues = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxVal = useMemo(() => {
    const m = Math.max(...(data.length ? data : [0]));
    return m <= 0 ? 1 : m; // 避免除零
  }, [data]);

  const margin = { top: 16, right: 8, bottom: 28, left: 42 };
  const chartW = Math.max(0, width - margin.left - margin.right);
  const chartH = Math.max(0, height - margin.top - margin.bottom);

  const gridSteps = 4; // 25% 间隔网格
  const barGap = 8;
  const barWidth = data.length > 0 ? Math.floor(chartW / data.length) : 0;

  const handlePressBar = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  if (!data || data.length === 0) {
    return (
      <Svg width={width} height={height}>
        <SvgText
          x={width / 2}
          y={height / 2}
          fontSize={14}
          fill={axisLabelColor}
          textAnchor="middle"
        >
          暂无数据
        </SvgText>
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height}>
      {/* 网格线与 Y 轴刻度标签 */}
      {[...Array(gridSteps + 1)].map((_, idx) => {
        const frac = idx / gridSteps; // 0..1
        const y = margin.top + chartH - frac * chartH;
        const tickVal = Math.round(maxVal * frac);
        return (
          <React.Fragment key={`g-${idx}`}>
            <Line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke={gridColor} strokeWidth={1} />
            <SvgText
              x={margin.left - 6}
              y={y + 4}
              fontSize={11}
              fill={axisLabelColor}
              textAnchor="end"
            >
              {formatCurrency(tickVal, currencySymbol)}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* 柱子与数值标签 */}
      {data.map((v, i) => {
        const scaledH = Math.round((v / maxVal) * chartH);
        const x = margin.left + i * barWidth + barGap / 2;
        const y = margin.top + chartH - scaledH;
        const w = Math.max(2, barWidth - barGap);
        const isActive = activeIndex === i;

        return (
          <React.Fragment key={`b-${i}`}>
            <Rect
              x={x}
              y={y}
              width={w}
              height={scaledH}
              rx={6}
              fill={barColor}
              onPress={() => handlePressBar(i)}
            />
            {/* 值标签：当柱子高度足够时显示在柱顶上方 */}
            {showValues && scaledH > 14 && (
              <SvgText
                x={x + w / 2}
                y={y - 6}
                fontSize={11}
                fill={axisLabelColor}
                textAnchor="middle"
              >
                {formatCurrency(v, currencySymbol)}
              </SvgText>
            )}

            {/* 点击提示：小气泡 */}
            {isActive && (
              <React.Fragment>
                {/* 简单提示框背景 */}
                <Rect
                  x={Math.max(margin.left, x + w / 2 - 42)}
                  y={Math.max(margin.top + 2, y - 28)}
                  width={84}
                  height={22}
                  rx={6}
                  fill="#111827"
                  opacity={0.85}
                />
                <SvgText
                  x={x + w / 2}
                  y={Math.max(margin.top + 2, y - 12)}
                  fontSize={11}
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  {formatCurrency(v, currencySymbol)}
                </SvgText>
              </React.Fragment>
            )}

            {/* X 轴标签 */}
            <SvgText
              x={x + w / 2}
              y={height - margin.bottom + 16}
              fontSize={11}
              fill={axisLabelColor}
              textAnchor="middle"
            >
              {labels[i] ?? `${i + 1}`}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* X 轴线 */}
      <Line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke={gridColor} strokeWidth={1} />
    </Svg>
  );
};

export default BarChart;