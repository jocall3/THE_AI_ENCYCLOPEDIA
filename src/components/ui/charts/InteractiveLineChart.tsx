
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  LineChart,
  BarChart,
  ScatterChart,
  CandlestickChart,
  PieChart,
  RadarChart,
  GaugeChart,
  EffectScatterChart
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
  BrushComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';

echarts.use([
  LineChart,
  BarChart,
  ScatterChart,
  CandlestickChart,
  PieChart,
  RadarChart,
  GaugeChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
  BrushComponent,
  CanvasRenderer
]);

interface DataPoint {
  x: number;
  y: number;
  [key: string]: any; // Allows for custom data on each point
}

interface InteractiveLineChartProps {
  data: DataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  tooltipFormatter?: (params: any) => string;
  showLegend?: boolean;
  onZoom?: (start: number, end: number) => void;
  showBrush?: boolean;
  brushConfig?: any; // Allows for custom brush configuration
  height?: string | number; // Allows for setting the chart height
  width?: string | number; // Allows for setting the chart width
  [key: string]: any; // Allows for arbitrary props to be passed to echarts options
}

const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  lineColor = '#5470c6',
  tooltipFormatter,
  showLegend = true,
  onZoom,
  showBrush = false,
  brushConfig,
  height = '400px',
  width = '100%',
  ...rest
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      setIsDataEmpty(true);
      return;
    }
    setIsDataEmpty(false);

    if (!chartRef.current) return;
    chartInstanceRef.current = echarts.init(chartRef.current);

    const xAxisData = data.map(point => point.x);
    const yAxisData = data.map(point => point.y);

    const option: EChartsOption = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter
          ? tooltipFormatter
          : (params: any) => {
              if (params && params[0]) {
                const point = data.find(item => item.x === params[0].value);
                if (point) {
                    let tooltipContent = `x: ${params[0].value}<br/>y: ${params[0].data.y}`;
                    for (const key in point) {
                        if (key !== 'x' && key !== 'y') {
                            tooltipContent += `<br/>${key}: ${point[key]}`;
                        }
                    }
                    return tooltipContent;
                }
                return `x: ${params[0].value}<br/>y: ${params[0].value}`; // Fallback if data point not found
              }
              return 'No data';
          },
      },
      legend: {
        show: showLegend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: xAxisLabel,
        data: xAxisData,
        axisLabel: {
            formatter: (value: any) => {
                if (typeof value === 'number') {
                    return value.toLocaleString(); // Format number with commas
                }
                return value;
            }
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        axisLabel: {
            formatter: (value: any) => {
                if (typeof value === 'number') {
                    return value.toLocaleString(); // Format number with commas
                }
                return value;
            }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          handleSize: '100%',
        },
        {
          type: 'inside',
          xAxisIndex: 0,
        },
      ],
      series: [
        {
          name: 'Line',
          type: 'line',
          data: yAxisData.map((val, index) => ({
              value: xAxisData[index],
              y: val,
              ...data[index]
          })), // Include custom data
          color: lineColor,
          smooth: true,
        },
      ],
      ...rest,
    };

    if (showBrush && brushConfig) {
      option.toolbox = {
          ...option.toolbox,
          feature: {
              ...option.toolbox?.feature,
              brush: {
                  ...brushConfig,
              },
          },
      };

      option.brush = {
          toolbox: ['lineX', 'clear'],
          ...brushConfig,
      };
    }
    if (onZoom) {
      chartInstanceRef.current.on('dataZoom', (params: any) => {
        if (params.start != null && params.end != null) {
            const startIndex = Math.floor(params.start * data.length / 100);
            const endIndex = Math.ceil(params.end * data.length / 100);
            onZoom(xAxisData[startIndex], xAxisData[endIndex -1]);
        }
      });
    }

    chartInstanceRef.current.setOption(option);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chartInstanceRef.current?.dispose();
      window.removeEventListener('resize', handleResize);
    };

  }, [data, title, xAxisLabel, yAxisLabel, lineColor, tooltipFormatter, showLegend, onZoom, showBrush, brushConfig, rest]);

  if (isDataEmpty) {
      return (
          <div style={{ height, width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              No data available.
          </div>
      );
  }

  return (
    <div ref={chartRef} style={{ height, width }} />
  );
};

export default InteractiveLineChart;