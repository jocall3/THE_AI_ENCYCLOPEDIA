import React, { useState, useEffect, CSSProperties, useMemo, useCallback } from 'react';
import { Responsive, ResponsiveComponent } from './Responsive';

interface GoalProgressRingChartProps {
  progress: number;
  title: string;
  color: string;
  trackColor?: string;
  radius?: number;
  strokeWidth?: number;
  centerText?: string;
  style?: CSSProperties;
  animationDuration?: number;
  aiConfidenceScore?: number;
  enableProjection?: boolean;
  projectionData?: { value: number; label: string };
  componentId?: string;
}

const DEFAULT_RADIUS = 75;
const DEFAULT_STROKE_WIDTH = 15;
const DEFAULT_ANIMATION_DURATION = 1500;

const calculateDashoffset = (progress: number, radius: number, strokeWidth: number): number => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * radius;
  const dashLength = (normalizedProgress / 100) * circumference;
  return circumference - dashLength;
};

const useAnimatedProgress = (targetProgress: number, duration: number) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (targetProgress === displayProgress) return;

    const startTime = Date.now();
    const startProgress = displayProgress;
    
    let animationFrameId: number;

    const step = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        setDisplayProgress(targetProgress);
        cancelAnimationFrame(animationFrameId);
        return;
      }

      const t = elapsed / duration;
      const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const newProgress = startProgress + (targetProgress - startProgress) * easedT;
      setDisplayProgress(newProgress);
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetProgress, duration, displayProgress]);

  return displayProgress;
};

const GoalProgressRingChart: React.FC<GoalProgressRingChartProps> = ({
  progress,
  title,
  color,
  trackColor = '#2C3E50',
  radius = DEFAULT_RADIUS,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  centerText,
  style = {},
  animationDuration = DEFAULT_ANIMATION_DURATION,
  aiConfidenceScore,
  enableProjection = false,
  projectionData,
  componentId,
}) => {
  const normalizedProgress = useMemo(() => Math.min(100, Math.max(0, progress)), [progress]);
  const displayProgress = useAnimatedProgress(normalizedProgress, animationDuration);
  
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const center = radius + strokeWidth / 2;
  const viewBoxSize = (radius * 2) + strokeWidth + 10;

  const dashOffset = useMemo(() => calculateDashoffset(displayProgress, radius, strokeWidth), [displayProgress, radius, strokeWidth]);
  
  const svgContainerStyle: CSSProperties = useMemo(() => ({
    transition: `transform ${animationDuration / 1000}s ease-out`,
    transform: 'rotate(-90deg)',
    overflow: 'visible',
  }), [animationDuration]);

  const trackStyle: CSSProperties = useMemo(() => ({
    stroke: trackColor,
    strokeWidth: strokeWidth,
    fill: 'none',
    transition: 'stroke 0.5s ease',
  }), [trackColor, strokeWidth]);

  const progressStyle: CSSProperties = useMemo(() => ({
    stroke: color,
    strokeWidth: strokeWidth,
    fill: 'none',
    transition: `stroke-dashoffset ${animationDuration / 1000}s linear`,
    strokeDasharray: circumference,
    strokeDashoffset: dashOffset,
    strokeLinecap: 'round',
    filter: `drop-shadow(0 0 2px rgba(0,0,0,0.1))`
  }), [color, strokeWidth, animationDuration, circumference, dashOffset]);

  const renderCenterContent = useCallback(() => {
    const primaryFontSize = radius * 0.45;
    const secondaryFontSize = radius * 0.25;
    const tertiaryFontSize = radius * 0.18;
    const yCenter = center + 5;

    if (centerText) {
      return (
        <text
          x={center}
          y={yCenter}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: primaryFontSize, fontWeight: '700', fill: '#FFFFFF' }}
        >
          {centerText}
        </text>
      );
    }

    return (
      <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        <text
          x={center}
          y={yCenter - radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: primaryFontSize, fontWeight: '900', fill: color }}
        >
          {`${Math.round(displayProgress)}%`}
        </text>

        <text
          x={center}
          y={yCenter + radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: secondaryFontSize, fontWeight: '500', fill: '#B0B0B0' }}
        >
          {normalizedProgress >= 100 ? 'TARGET ACHIEVED' : 'IN PROGRESS'}
        </text>

        {aiConfidenceScore !== undefined && (
          <text
            x={center}
            y={yCenter + radius * 0.4}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: tertiaryFontSize, fontWeight: '400', fill: '#00FF00' }}
          >
            Confidence: {aiConfidenceScore.toFixed(1)}%
          </text>
        )}

        {enableProjection && projectionData && (
          <text
            x={center}
            y={yCenter + radius * 0.65}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: tertiaryFontSize * 0.9, fontWeight: '600', fill: '#FFD700' }}
          >
            {projectionData.label}: {projectionData.value}%
          </text>
        )}
      </g>
    );
  }, [center, radius, displayProgress, normalizedProgress, centerText, aiConfidenceScore, enableProjection, projectionData, color]);

  return (
    <ResponsiveComponent style={{ ...style, textAlign: 'center', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {title && (
          <div style={{ marginBottom: '12px', fontSize: '1.3em', fontWeight: '700', color: '#ECF0F1' }}>
            {title} 
          </div>
        )}
        
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={svgContainerStyle}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            style={trackStyle}
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            style={progressStyle}
          />

          <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
            {renderCenterContent()}
          </g>
        </svg>

        {!centerText && (
          <div style={{ marginTop: '15px', fontSize: '1.1em', color: '#BDC3C7', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <span style={{ fontWeight: '500' }}>Current Value:</span>
                <span style={{ fontWeight: '800', color: color }}>{progress.toFixed(2)}%</span>
            </div>
            {projectionData && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontWeight: '500' }}>Projection Target:</span>
                    <span style={{ fontWeight: '800', color: '#FFD700' }}>{projectionData.value.toFixed(1)}%</span>
                </div>
            )}
          </div>
        )}
      </div>
    </ResponsiveComponent>
  );
};

export default GoalProgressRingChart;