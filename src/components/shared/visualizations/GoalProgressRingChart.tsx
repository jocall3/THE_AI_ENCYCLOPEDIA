import React, { useState, useEffect, CSSProperties } from 'react';
import { Responsive, ResponsiveComponent } from './Responsive';

interface GoalProgressRingChartProps {
  /** The current progress value (0 to 100). */
  progress: number;
  /** The title to display above the chart. */
  title: string;
  /** The color of the filled arc (e.g., '#4CAF50'). */
  color: string;
  /** The color of the background track (e.g., '#E0E0E0'). */
  trackColor?: string;
  /** The radius of the ring in pixels. */
  radius?: number;
  /** The thickness of the ring stroke in pixels. */
  strokeWidth?: number;
  /** Optional text to display inside the ring center. */
  centerText?: string;
  /** Custom styles for the component container. */
  style?: CSSProperties;
  /** Animation duration in milliseconds. */
  animationDuration?: number;
}

const DEFAULT_RADIUS = 50;
const DEFAULT_STROKE_WIDTH = 10;
const DEFAULT_ANIMATION_DURATION = 1000;

// Helper function to calculate stroke-dasharray and offset for a partial circle
const calculateDashoffset = (progress: number, radius: number, strokeWidth: number): number => {
  const circumference = 2 * Math.PI * radius;
  // Calculate the length of the visible arc
  const dashLength = (progress / 100) * circumference;
  // The dash offset is the circumference minus the dash length
  return circumference - dashLength;
};

const GoalProgressRingChart: React.FC<GoalProgressRingChartProps> = ({
  progress,
  title,
  color,
  trackColor = '#E0E0E0',
  radius = DEFAULT_RADIUS,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  centerText,
  style = {},
  animationDuration = DEFAULT_ANIMATION_DURATION,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * radius;
  const center = radius; // Center coordinate for SVG

  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Animation effect
    const startTime = Date.now();
    const startProgress = displayProgress;
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = animationDuration - elapsed;

      if (remainingTime <= 0) {
        setDisplayProgress(normalizedProgress);
        return;
      }

      const newProgress = startProgress + (normalizedProgress - startProgress) * (1 - (remainingTime / animationDuration));
      setDisplayProgress(newProgress);
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    // Cleanup function in case the component unmounts before animation finishes
    return () => {
      // No explicit cleanup needed for simple rAF loop, but good practice placeholder
    };
  }, [normalizedProgress, animationDuration]);


  const dashOffset = calculateDashoffset(displayProgress, radius, strokeWidth);
  const viewBoxSize = (radius + strokeWidth / 2) * 2 + 5; // Add padding

  const svgStyle: CSSProperties = {
    transition: `transform ${animationDuration / 1000}s ease-out`,
    transform: 'rotate(-90deg)', // Start from the top
  };

  const trackStyle: CSSProperties = {
    stroke: trackColor,
    strokeWidth: strokeWidth,
    fill: 'none',
  };

  const progressStyle: CSSProperties = {
    stroke: color,
    strokeWidth: strokeWidth,
    fill: 'none',
    transition: `stroke-dashoffset ${animationDuration / 1000}s linear`,
    strokeDasharray: circumference,
    strokeDashoffset: dashOffset,
  };

  const textStyle: CSSProperties = {
    fontSize: radius * 0.5, // Scale text size relative to radius
    fontWeight: 'bold',
    fill: '#333',
  };

  const secondaryTextStyle: CSSProperties = {
    fontSize: radius * 0.3,
    fill: '#666',
  };

  return (
    <ResponsiveComponent style={style}>
      <div style={{ textAlign: 'center' }}>
        {title && <div style={{ marginBottom: '8px', fontSize: '1.1em', fontWeight: '600' }}>{title}</div>}
        
        <svg
          width={radius * 2 + strokeWidth + 10}
          height={radius * 2 + strokeWidth + 10}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={svgStyle}
        >
          {/* Background Track Circle */}
          <circle
            cx={center + strokeWidth / 2 + 2.5}
            cy={center + strokeWidth / 2 + 2.5}
            r={radius}
            style={trackStyle}
          />

          {/* Progress Arc Circle */}
          <circle
            cx={center + strokeWidth / 2 + 2.5}
            cy={center + strokeWidth / 2 + 2.5}
            r={radius}
            style={progressStyle}
            strokeLinecap="round"
          />

          {/* Center Text Group (Unrotated) */}
          <g
            style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
          >
            {centerText ? (
              <text
                x={center + strokeWidth / 2 + 2.5}
                y={center + strokeWidth / 2 + 2.5 + 5} // Adjust Y slightly for vertical alignment compensation
                textAnchor="middle"
                dominantBaseline="middle"
                style={textStyle}
              >
                {centerText}
              </text>
            ) : (
              <>
                <text
                  x={center + strokeWidth / 2 + 2.5}
                  y={center + strokeWidth / 2 + 2.5 - 5}
                  textAnchor="middle"
                  style={secondaryTextStyle}
                >
                  {`${Math.round(displayProgress)}%`}
                </text>
                <text
                  x={center + strokeWidth / 2 + 2.5}
                  y={center + strokeWidth / 2 + 2.5 + 15}
                  textAnchor="middle"
                  style={{ ...secondaryTextStyle, fontSize: radius * 0.2 }}
                >
                  GOAL
                </text>
              </>
            )}
          </g>
        </svg>

        {/* Display actual percentage below the chart */}
        {!centerText && (
          <div style={{ marginTop: '8px', fontSize: '1em', color: color }}>
            {`${Math.round(displayProgress)}% Complete`}
          </div>
        )}
      </div>
    </ResponsiveComponent>
  );
};

export default GoalProgressRingChart;