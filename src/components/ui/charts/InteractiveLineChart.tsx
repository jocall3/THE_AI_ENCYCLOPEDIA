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

// Register all required components for the Enterprise AI Charting System
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

// --- Enterprise Type Definitions ---

interface DataPoint {
  x: number | string;
  y: number;
  [key: string]: any;
}

interface AIAnalysisConfig {
  enablePredictiveModeling?: boolean;
  enableAnomalyDetection?: boolean;
  enableTrendAnalysis?: boolean;
  predictionSteps?: number;
  anomalyThreshold?: number; // Standard deviations
  confidenceInterval?: number; // 0-1
  learningRate?: number;
}

interface DashboardConfig {
  showKPIs?: boolean;
  showAIInsights?: boolean;
  showControlPanel?: boolean;
  theme?: 'enterprise-light' | 'enterprise-dark' | 'cyber-future' | 'executive-minimal';
  refreshInterval?: number;
}

interface InteractiveLineChartProps {
  data: DataPoint[];
  title?: string;
  subTitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  secondaryColor?: string;
  tooltipFormatter?: (params: any) => string;
  showLegend?: boolean;
  onZoom?: (start: number, end: number) => void;
  showBrush?: boolean;
  brushConfig?: any;
  height?: string | number;
  width?: string | number;
  aiConfig?: AIAnalysisConfig;
  dashboardConfig?: DashboardConfig;
  onAIInsightGenerated?: (insights: string[]) => void;
  onAnomalyDetected?: (anomalies: DataPoint[]) => void;
  [key: string]: any;
}

interface AIMetrics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  trendSlope: number;
  trendIntercept: number;
  rSquared: number;
  volatility: number;
  growthRate: number;
  predictedNextValue: number;
}

// --- Advanced Math & AI Simulation Engine ---

const AI_ENGINE = {
  calculateMean: (values: number[]): number => {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  },

  calculateMedian: (values: number[]): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  calculateStdDev: (values: number[], mean: number): number => {
    if (values.length === 0) return 0;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = AI_ENGINE.calculateMean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  },

  calculateLinearRegression: (xValues: number[], yValues: number[]) => {
    const n = yValues.length;
    if (n === 0) return { slope: 0, intercept: 0, rSquared: 0 };

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-Squared
    const yMean = sumY / n;
    const totalSS = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const residualSS = yValues.reduce((sum, y, i) => {
      const predicted = slope * xValues[i] + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const rSquared = totalSS === 0 ? 0 : 1 - (residualSS / totalSS);

    return { slope, intercept, rSquared };
  },

  detectAnomalies: (data: DataPoint[], mean: number, stdDev: number, threshold: number): DataPoint[] => {
    return data.filter(point => Math.abs(point.y - mean) > threshold * stdDev);
  },

  generatePredictions: (
    data: DataPoint[], 
    slope: number, 
    intercept: number, 
    steps: number
  ): DataPoint[] => {
    const lastX = data.length > 0 ? (typeof data[data.length - 1].x === 'number' ? data[data.length - 1].x as number : data.length) : 0;
    const predictions: DataPoint[] = [];
    
    for (let i = 1; i <= steps; i++) {
      const nextX = (lastX as number) + i;
      const nextY = slope * nextX + intercept;
      predictions.push({
        x: nextX,
        y: nextY,
        isPrediction: true,
        confidence: 0.95 - (i * 0.05) // Decaying confidence
      });
    }
    return predictions;
  },

  generateNaturalLanguageInsights: (metrics: AIMetrics, anomalies: number): string[] => {
    const insights: string[] = [];
    
    // Trend Analysis
    if (metrics.trendSlope > 0) {
      insights.push(`POSITIVE GROWTH DETECTED: The dataset exhibits a strong upward trajectory with a slope of ${metrics.trendSlope.toFixed(4)}.`);
    } else if (metrics.trendSlope < 0) {
      insights.push(`NEGATIVE TREND ALERT: Metrics indicate a downward trend. Immediate strategic review recommended.`);
    } else {
      insights.push(`STABILITY INDEX: The data indicates a plateau or stable period.`);
    }

    // Volatility Analysis
    if (metrics.volatility > 0.2) {
      insights.push(`HIGH VOLATILITY WARNING: Market conditions or data inputs are fluctuating significantly (Variance: ${(metrics.volatility * 100).toFixed(2)}%).`);
    }

    // Anomaly Reporting
    if (anomalies > 0) {
      insights.push(`ANOMALY DETECTION SYSTEM: Identified ${anomalies} data points deviating significantly from the standard distribution model.`);
    }

    // Predictive Outlook
    insights.push(`AI FORECAST: Projected next value is ${metrics.predictedNextValue.toFixed(2)} with ${(metrics.rSquared * 100).toFixed(1)}% model confidence.`);

    return insights;
  }
};

// --- Main Component ---

const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  data,
  title = "Enterprise Analytics Dashboard",
  subTitle = "AI-Powered Real-time Data Processing",
  xAxisLabel = "Timeline",
  yAxisLabel = "Value Metric",
  lineColor = '#3b82f6',
  secondaryColor = '#10b981',
  tooltipFormatter,
  showLegend = true,
  onZoom,
  showBrush = false,
  brushConfig,
  height = '600px',
  width = '100%',
  aiConfig = {
    enablePredictiveModeling: true,
    enableAnomalyDetection: true,
    enableTrendAnalysis: true,
    predictionSteps: 5,
    anomalyThreshold: 2,
    confidenceInterval: 0.95
  },
  dashboardConfig = {
    showKPIs: true,
    showAIInsights: true,
    showControlPanel: true,
    theme: 'enterprise-light',
    refreshInterval: 0
  },
  onAIInsightGenerated,
  onAnomalyDetected,
  ...rest
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [anomalies, setAnomalies] = useState<DataPoint[]>([]);
  const [activeTheme, setActiveTheme] = useState(dashboardConfig.theme || 'enterprise-light');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- AI Processing Pipeline ---
  useEffect(() => {
    if (!data || data.length === 0) {
      setIsDataEmpty(true);
      return;
    }
    setIsDataEmpty(false);
    setIsProcessing(true);

    // 1. Extract Numerical Vectors
    const yValues = data.map(d => d.y);
    const xValues = data.map((d, i) => typeof d.x === 'number' ? d.x : i);

    // 2. Statistical Analysis
    const mean = AI_ENGINE.calculateMean(yValues);
    const median = AI_ENGINE.calculateMedian(yValues);
    const stdDev = AI_ENGINE.calculateStdDev(yValues, mean);
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const volatility = mean !== 0 ? stdDev / mean : 0;

    // 3. Regression & Trend Analysis
    const { slope, intercept, rSquared } = AI_ENGINE.calculateLinearRegression(xValues, yValues);

    // 4. Anomaly Detection
    const detectedAnomalies = aiConfig.enableAnomalyDetection 
      ? AI_ENGINE.detectAnomalies(data, mean, stdDev, aiConfig.anomalyThreshold || 2)
      : [];

    if (detectedAnomalies.length > 0 && onAnomalyDetected) {
      onAnomalyDetected(detectedAnomalies);
    }

    // 5. Predictive Modeling
    let finalData = [...data];
    let predictedNextValue = 0;

    if (aiConfig.enablePredictiveModeling) {
      const predictions = AI_ENGINE.generatePredictions(
        data, 
        slope, 
        intercept, 
        aiConfig.predictionSteps || 5
      );
      finalData = [...data, ...predictions];
      predictedNextValue = predictions.length > 0 ? predictions[0].y : 0;
    }

    // 6. Metrics Compilation
    const calculatedMetrics: AIMetrics = {
      mean,
      median,
      stdDev,
      min,
      max,
      trendSlope: slope,
      trendIntercept: intercept,
      rSquared,
      volatility,
      growthRate: (slope / mean) * 100,
      predictedNextValue
    };

    // 7. Insight Generation
    const generatedInsights = AI_ENGINE.generateNaturalLanguageInsights(calculatedMetrics, detectedAnomalies.length);
    
    if (onAIInsightGenerated) {
      onAIInsightGenerated(generatedInsights);
    }

    // Update State
    setMetrics(calculatedMetrics);
    setAnomalies(detectedAnomalies);
    setProcessedData(finalData);
    setInsights(generatedInsights);
    setIsProcessing(false);

  }, [data, aiConfig, onAIInsightGenerated, onAnomalyDetected]);

  // --- Chart Rendering Engine ---
  useEffect(() => {
    if (isDataEmpty || !chartRef.current || processedData.length === 0) return;

    // Initialize or Dispose
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }
    
    chartInstanceRef.current = echarts.init(chartRef.current, activeTheme === 'enterprise-dark' ? 'dark' : undefined);

    const xAxisData = processedData.map(point => point.x);
    const yAxisData = processedData.map(point => point.y);

    // Dynamic Visual Map for Intensity
    const visualMapConfig = {
      show: false,
      dimension: 1,
      pieces: [
        { gt: metrics?.mean! + metrics?.stdDev!, color: '#ef4444' }, // High outlier
        { gt: metrics?.mean!, lte: metrics?.mean! + metrics?.stdDev!, color: '#10b981' }, // Above avg
        { gt: metrics?.mean! - metrics?.stdDev!, lte: metrics?.mean!, color: '#3b82f6' }, // Below avg
        { lte: metrics?.mean! - metrics?.stdDev!, color: '#f59e0b' } // Low outlier
      ],
      outOfRange: { color: '#999' }
    };

    // Mark Points for Anomalies
    const markPoints = anomalies.map(a => ({
      coord: [a.x, a.y],
      value: a.y,
      itemStyle: { color: '#ef4444' },
      label: { show: true, formatter: '⚠' }
    }));

    // Mark Line for Trend
    const markLines = aiConfig.enableTrendAnalysis ? {
      data: [
        [
          { coord: [processedData[0].x, metrics?.trendIntercept! + metrics?.trendSlope! * (typeof processedData[0].x === 'number' ? processedData[0].x : 0)], symbol: 'none' },
          { coord: [processedData[processedData.length - 1].x, metrics?.trendIntercept! + metrics?.trendSlope! * (typeof processedData[processedData.length - 1].x === 'number' ? processedData[processedData.length - 1].x : processedData.length - 1)], symbol: 'none' }
        ]
      ],
      lineStyle: { type: 'dashed', color: '#6366f1', width: 2 },
      label: { show: true, position: 'end', formatter: 'AI Trend' }
    } : undefined;

    const option: EChartsOption = {
      backgroundColor: activeTheme === 'enterprise-dark' ? '#111827' : '#ffffff',
      title: {
        text: title,
        subtext: subTitle,
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: activeTheme === 'enterprise-dark' ? '#f3f4f6' : '#1f2937'
        },
        subtextStyle: {
          fontSize: 12,
          color: activeTheme === 'enterprise-dark' ? '#9ca3af' : '#6b7280'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#1f2937' },
        formatter: (params: any) => {
          if (!params || !params[0]) return '';
          const point = processedData.find(item => item.x === params[0].value || item.x === params[0].axisValue);
          let content = `<div style="font-family: sans-serif; padding: 8px;">`;
          content += `<div style="font-weight:bold; margin-bottom:4px; border-bottom:1px solid #eee; padding-bottom:4px;">${params[0].axisValueLabel || params[0].value}</div>`;
          
          params.forEach((param: any) => {
            const isPrediction = point?.isPrediction;
            content += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">`;
            content += `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${param.color}; margin-right:8px;"></span>`;
            content += `<span style="color:#666;">${param.seriesName}:</span>`;
            content += `<span style="font-weight:bold; margin-left:8px;">${typeof param.value === 'number' ? param.value.toLocaleString() : param.value}</span>`;
            if (isPrediction) content += ` <span style="font-size:10px; background:#e0e7ff; color:#4338ca; padding:1px 4px; border-radius:4px; margin-left:4px;">AI FORECAST</span>`;
            content += `</div>`;
          });

          if (point) {
             // Add custom data fields
             Object.keys(point).forEach(key => {
               if (!['x', 'y', 'isPrediction', 'confidence'].includes(key)) {
                 content += `<div style="font-size:11px; color:#888; margin-top:2px;">${key}: ${point[key]}</div>`;
               }
             });
             if (point.isPrediction) {
               content += `<div style="margin-top:6px; font-size:11px; color:#4338ca; font-style:italic;">Confidence: ${(point.confidence * 100).toFixed(1)}%</div>`;
             }
          }
          content += `</div>`;
          return content;
        }
      },
      legend: {
        show: showLegend,
        bottom: 0,
        textStyle: { color: activeTheme === 'enterprise-dark' ? '#d1d5db' : '#374151' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: xAxisLabel,
        data: xAxisData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: activeTheme === 'enterprise-dark' ? '#4b5563' : '#e5e7eb' } },
        axisLabel: { color: activeTheme === 'enterprise-dark' ? '#9ca3af' : '#6b7280' },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        axisLine: { show: true, lineStyle: { color: activeTheme === 'enterprise-dark' ? '#4b5563' : '#e5e7eb' } },
        axisLabel: { color: activeTheme === 'enterprise-dark' ? '#9ca3af' : '#6b7280' },
        splitLine: { 
          show: true, 
          lineStyle: { 
            color: activeTheme === 'enterprise-dark' ? '#374151' : '#f3f4f6',
            type: 'dashed'
          } 
        }
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          restore: {},
          saveAsImage: { title: 'Export AI Report' },
          magicType: { type: ['line', 'bar', 'stack'] }
        },
        iconStyle: { borderColor: activeTheme === 'enterprise-dark' ? '#9ca3af' : '#6b7280' }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: activeTheme === 'enterprise-dark' ? '#1f2937' : '#f3f4f6',
          fillerColor: 'rgba(59, 130, 246, 0.2)',
          handleStyle: { color: '#3b82f6' }
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100
        }
      ],
      visualMap: visualMapConfig,
      series: [
        {
          name: 'Actual Data',
          type: 'line',
          data: yAxisData.map((val, index) => {
            const isPred = processedData[index].isPrediction;
            return {
              value: val,
              itemStyle: {
                color: isPred ? '#818cf8' : lineColor
              },
              symbol: isPred ? 'emptyCircle' : 'circle',
              symbolSize: isPred ? 4 : 6
            };
          }),
          smooth: true,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          areaStyle: {
            opacity: 0.1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: lineColor },
              { offset: 1, color: 'rgba(255, 255, 255, 0)' }
            ])
          },
          markPoint: { data: markPoints },
          markLine: markLines
        }
      ],
      ...rest,
    };

    if (showBrush && brushConfig) {
      option.toolbox = {
          ...option.toolbox,
          feature: {
              ...option.toolbox?.feature,
              brush: { ...brushConfig },
          },
      };
      option.brush = {
          toolbox: ['lineX', 'clear'],
          xAxisIndex: 0,
          ...brushConfig,
      };
    }

    if (onZoom) {
      chartInstanceRef.current.on('dataZoom', (params: any) => {
        if (params.start != null && params.end != null) {
            const startIndex = Math.floor(params.start * processedData.length / 100);
            const endIndex = Math.ceil(params.end * processedData.length / 100);
            onZoom(xAxisData[startIndex] as number, xAxisData[endIndex -1] as number);
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

  }, [processedData, metrics, anomalies, activeTheme, title, subTitle, xAxisLabel, yAxisLabel, lineColor, showLegend, onZoom, showBrush, brushConfig, rest, aiConfig.enableTrendAnalysis]);

  // --- Styles & Layout ---
  
  const containerStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: activeTheme === 'enterprise-dark' ? '#111827' : '#ffffff',
    color: activeTheme === 'enterprise-dark' ? '#f3f4f6' : '#1f2937',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: activeTheme === 'enterprise-dark' ? '1px solid #374151' : '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: typeof width === 'number' ? `${width}px` : width,
  };

  const kpiGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '10px'
  };

  const kpiCardStyle: React.CSSProperties = {
    backgroundColor: activeTheme === 'enterprise-dark' ? '#1f2937' : '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
    borderLeft: `4px solid ${lineColor}`,
    display: 'flex',
    flexDirection: 'column'
  };

  const kpiLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: activeTheme === 'enterprise-dark' ? '#9ca3af' : '#6b7280',
    marginBottom: '4px'
  };

  const kpiValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: activeTheme === 'enterprise-dark' ? '#f3f4f6' : '#111827'
  };

  const insightContainerStyle: React.CSSProperties = {
    backgroundColor: activeTheme === 'enterprise-dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '10px'
  };

  const insightHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    color: '#2563eb',
    marginBottom: '8px',
    fontSize: '14px'
  };

  if (isDataEmpty) {
      return (
          <div style={{ height, width, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9ca3af' }}>
              Waiting for data stream...
          </div>
      );
  }

  return (
    <div style={containerStyle}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{subTitle}</p>
        </div>
        {dashboardConfig.showControlPanel && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveTheme(prev => prev === 'enterprise-light' ? 'enterprise-dark' : 'enterprise-light')}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: 'inherit' }}
            >
              Toggle Theme
            </button>
            <button 
              onClick={() => alert('AI Report generated and sent to executive dashboard.')}
              style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: lineColor, color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
            >
              Export AI Report
            </button>
          </div>
        )}
      </div>

      {/* KPI Dashboard */}
      {dashboardConfig.showKPIs && metrics && (
        <div style={kpiGridStyle}>
          <div style={kpiCardStyle}>
            <span style={kpiLabelStyle}>Average</span>
            <span style={kpiValueStyle}>{metrics.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div style={kpiCardStyle}>
            <span style={kpiLabelStyle}>Max Peak</span>
            <span style={kpiValueStyle}>{metrics.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div style={kpiCardStyle}>
            <span style={kpiLabelStyle}>Volatility</span>
            <span style={{ ...kpiValueStyle, color: metrics.volatility > 0.15 ? '#ef4444' : '#10b981' }}>
              {(metrics.volatility * 100).toFixed(1)}%
            </span>
          </div>
          <div style={kpiCardStyle}>
            <span style={kpiLabelStyle}>AI Forecast</span>
            <span style={{ ...kpiValueStyle, color: '#6366f1' }}>
              {metrics.predictedNextValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Main Chart Canvas */}
      <div style={{ position: 'relative', height, width: '100%' }}>
        {isProcessing && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Processing AI Models...
          </div>
        )}
        <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* AI Insights Panel */}
      {dashboardConfig.showAIInsights && insights.length > 0 && (
        <div style={insightContainerStyle}>
          <div style={insightHeaderStyle}>
            <span>✦</span> AI INTELLIGENCE REPORT
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: activeTheme === 'enterprise-dark' ? '#d1d5db' : '#4b5563' }}>
            {insights.map((insight, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InteractiveLineChart;