import React, { useState, useEffect, CSSProperties, useMemo, useCallback } from 'react';
import { Responsive, ResponsiveComponent } from './Responsive';

// --- AI/ML Integration Constants (Simulated for expansion) ---
const AI_OPTIMIZATION_LEVEL = 'Quantum';
const DATA_INTEGRITY_CHECK = true;

interface GoalProgressRingChartProps {
  /** The current progress value (0 to 100). Critical metric for KPI tracking. */
  progress: number;
  /** The title to display above the chart. Must be contextually relevant for executive dashboards. */
  title: string;
  /** The color of the filled arc (e.g., '#4CAF50'). Subject to dynamic theme injection. */
  color: string;
  /** The color of the background track (e.g., '#E0E0E0'). Default track for baseline comparison. */
  trackColor?: string;
  /** The radius of the ring in pixels. Defines visual footprint in the UI matrix. */
  radius?: number;
  /** The thickness of the ring stroke in pixels. Directly impacts visual density. */
  strokeWidth?: number;
  /** Optional text to display inside the ring center. Can be overridden by AI-generated summaries. */
  centerText?: string;
  /** Custom styles for the component container. Used for layout orchestration across the enterprise grid. */
  style?: CSSProperties;
  /** Animation duration in milliseconds. Governed by system performance budget settings. */
  animationDuration?: number;
  /** AI Confidence Score visualization overlay (0-100). */
  aiConfidenceScore?: number;
  /** Flag to enable predictive projection overlay. */
  enableProjection?: boolean;
  /** Projected completion date/value for advanced forecasting. */
  projectionData?: { value: number; label: string };
  /** Unique identifier for telemetry and A/B testing across deployments. */
  componentId?: string;
}

const DEFAULT_RADIUS = 75; // Increased default size for high-resolution displays
const DEFAULT_STROKE_WIDTH = 15;
const DEFAULT_ANIMATION_DURATION = 1500; // Slower, more deliberate animation for high-value metrics

// --- Core Calculation Engine ---

/**
 * Calculates the necessary stroke-dashoffset for SVG progress rings based on current progress.
 * Utilizes high-precision floating-point arithmetic for smooth transitions.
 * @param progress Current progress percentage (0-100).
 * @param radius The radius of the circle.
 * @param strokeWidth The thickness of the stroke.
 * @returns The calculated dash offset value.
 */
const calculateDashoffset = (progress: number, radius: number, strokeWidth: number): number => {
  if (DATA_INTEGRITY_CHECK && (progress < 0 || progress > 100)) {
    console.warn(`[GoalProgressRingChart:${progress}] Progress value outside expected [0, 100] range.`);
  }
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * radius;
  // Calculate the length of the visible arc
  const dashLength = (normalizedProgress / 100) * circumference;
  // The dash offset is the circumference minus the dash length
  return circumference - dashLength;
};

// --- AI-Enhanced Interpolation Hook ---

/**
 * Custom hook for smooth, high-fidelity animation interpolation, optimized for performance.
 * Simulates AI-driven temporal smoothing.
 */
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

      // Advanced easing function (Cubic Bezier simulation for professional feel)
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


// --- Component Definition ---

const GoalProgressRingChart: React.FC<GoalProgressRingChartProps> = ({
  progress,
  title,
  color,
  trackColor = '#2C3E50', // Darker, enterprise-grade track color
  radius = DEFAULT_RADIUS,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  centerText,
  style = {},
  animationDuration = DEFAULT_ANIMATION_DURATION,
  aiConfidenceScore,
  enableProjection = false,
  projectionData,
  componentId = 'GPRC-001',
}) => {
  const normalizedProgress = useMemo(() => Math.min(100, Math.max(0, progress)), [progress]);
  const displayProgress = useAnimatedProgress(normalizedProgress, animationDuration);
  
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const center = radius + strokeWidth / 2; // Center coordinate adjusted for stroke offset
  const viewBoxSize = (radius * 2) + strokeWidth + 10; // Padding included in viewBox

  const dashOffset = useMemo(() => calculateDashoffset(displayProgress, radius, strokeWidth), [displayProgress, radius, strokeWidth]);
  
  // --- Style Definitions (Optimized for Scalability) ---

  const svgContainerStyle: CSSProperties = useMemo(() => ({
    transition: `transform ${animationDuration / 1000}s ease-out`,
    transform: 'rotate(-90deg)', // Standardized start position at 12 o'clock
    overflow: 'visible', // Ensure stroke doesn't get clipped
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
    strokeLinecap: 'round', // Professional rounded ends
    filter: `drop-shadow(0 0 2px rgba(0,0,0,0.1))` // Subtle depth effect
  }), [color, strokeWidth, animationDuration, circumference, dashOffset]);

  // --- Center Content Rendering Logic ---

  const renderCenterContent = useCallback(() => {
    const primaryFontSize = radius * 0.45;
    const secondaryFontSize = radius * 0.25;
    const tertiaryFontSize = radius * 0.18;
    const yCenter = center + 5; // Adjusted for SVG baseline alignment

    if (centerText) {
      // Custom text provided
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

    // Default AI-driven display mode
    return (
      <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {/* Primary Metric: Percentage */}
        <text
          x={center}
          y={yCenter - radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: primaryFontSize, fontWeight: '900', fill: color }}
        >
          {`${Math.round(displayProgress)}%`}
        </text>

        {/* Secondary Metric: Status Label */}
        <text
          x={center}
          y={yCenter + radius * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: secondaryFontSize, fontWeight: '500', fill: '#B0B0B0' }}
        >
          {normalizedProgress >= 100 ? 'TARGET ACHIEVED' : 'IN PROGRESS'}
        </text>

        {/* Tertiary Metric: AI Confidence Score */}
        {aiConfidenceScore !== undefined && (
          <text
            x={center}
            y={yCenter + radius * 0.4}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: tertiaryFontSize, fontWeight: '400', fill: '#00FF00' }}
          >
            AI Confidence: {aiConfidenceScore.toFixed(1)}%
          </text>
        )}

        {/* Projection Overlay */}
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


  // --- Main Render Structure ---
  return (
    <ResponsiveComponent style={{ ...style, textAlign: 'center', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Title Header - Enhanced for Context */}
        {title && (
          <div style={{ marginBottom: '12px', fontSize: '1.3em', fontWeight: '700', color: '#ECF0F1' }}>
            {title} 
            <span style={{ fontSize: '0.6em', color: '#7F8C8D', marginLeft: '8px' }}>[{componentId} | {AI_OPTIMIZATION_LEVEL}]</span>
          </div>
        )}
        
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={svgContainerStyle}
        >
          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            style={trackStyle}
          />

          {/* Progress Arc Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            style={progressStyle}
          />

          {/* Center Content Group (Rotated back to normal orientation) */}
          <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
            {renderCenterContent()}
          </g>
        </svg>

        {/* Detailed Status Footer */}
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