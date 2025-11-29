import React from 'react';

// --- Utility Core ---

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const generateId = () => `ai-prog-${Math.random().toString(36).substr(2, 9)}`;

// --- Types & Interfaces ---

export type ProgressVariant = 
  | 'default' 
  | 'neutral' 
  | 'brand' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'gradient-cool' 
  | 'gradient-warm' 
  | 'gradient-cyber'
  | 'ai-adaptive'
  | 'glass';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type ProgressAnimation = 'none' | 'pulse' | 'shimmer' | 'flow' | 'indeterminate' | 'scan';

export type ProgressOrientation = 'horizontal' | 'vertical';

export interface ProgressMilestone {
  id?: string;
  value: number;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
  reachedColor?: string;
  tooltip?: string;
  onReached?: () => void;
}

export interface ProgressSegment {
  id: string;
  value: number;
  color?: string;
  className?: string;
  label?: string;
  tooltip?: string;
  metadata?: Record<string, any>;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'optimization' | 'milestone' | 'completion';
  message: string;
  confidence: number;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export interface AIPrediction {
  eta: string;
  etaSeconds: number;
  velocity: number; // units per second
  acceleration: number;
  trend: 'stable' | 'accelerating' | 'decelerating' | 'stalled';
  completionProbability: number;
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  // Core Values
  value?: number | null;
  max?: number;
  min?: number;
  buffer?: number; // Secondary buffer value (like video players)
  
  // Structure
  segments?: ProgressSegment[];
  milestones?: ProgressMilestone[];
  orientation?: ProgressOrientation;
  
  // Styling
  variant?: ProgressVariant;
  size?: ProgressSize;
  thickness?: number | string;
  rounded?: boolean | 'full' | 'none' | 'sm' | 'md' | 'lg';
  
  // Labels & Formatting
  showValue?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'floating';
  valueFormatter?: (value: number, max: number) => string;
  
  // Animation
  animation?: ProgressAnimation;
  indeterminate?: boolean;
  animateOnMount?: boolean;
  
  // AI & Advanced Features
  enableAIAnalytics?: boolean;
  aiPredictionInterval?: number;
  showAIInsights?: boolean;
  aiConfidenceThreshold?: number;
  
  // Interactivity
  interactive?: boolean;
  readOnly?: boolean;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  
  // Customization
  trackColor?: string;
  indicatorColor?: string;
  customGradient?: string[];
}

// --- AI Analytics Engine Hook ---

const useAIProgressAnalytics = (
  currentValue: number, 
  max: number, 
  min: number,
  enabled: boolean,
  threshold: number = 0.7
) => {
  const [history, setHistory] = React.useState<{val: number, time: number}[]>([]);
  const [prediction, setPrediction] = React.useState<AIPrediction | null>(null);
  const [insights, setInsights] = React.useState<AIInsight[]>([]);

  // Track history
  React.useEffect(() => {
    if (!enabled) return;
    const now = Date.now();
    setHistory(prev => {
      const newHistory = [...prev, { val: currentValue, time: now }];
      // Keep last 50 data points for high-fidelity analysis
      if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
      return newHistory;
    });
  }, [currentValue, enabled]);

  // Analyze Data
  React.useEffect(() => {
    if (!enabled || history.length < 3) return;

    const analyze = () => {
      const now = Date.now();
      const start = history[0];
      const end = history[history.length - 1];
      const timeDiff = (end.time - start.time) / 1000; // seconds
      
      if (timeDiff <= 0) return;

      const totalProgress = end.val - start.val;
      const velocity = totalProgress / timeDiff; // units/sec
      
      // Calculate Acceleration
      const midPoint = Math.floor(history.length / 2);
      const firstHalfVelocity = (history[midPoint].val - history[0].val) / ((history[midPoint].time - history[0].time) / 1000);
      const secondHalfVelocity = (history[history.length - 1].val - history[midPoint].val) / ((history[history.length - 1].time - history[midPoint].time) / 1000);
      const acceleration = secondHalfVelocity - firstHalfVelocity;

      const remaining = max - end.val;
      const etaSeconds = velocity > 0 ? remaining / velocity : Infinity;

      let trend: AIPrediction['trend'] = 'stable';
      if (Math.abs(velocity) < 0.01) trend = 'stalled';
      else if (acceleration > 0.1) trend = 'accelerating';
      else if (acceleration < -0.1) trend = 'decelerating';

      const completionProbability = Math.min(0.99, 0.5 + (velocity > 0 ? 0.4 : 0));

      setPrediction({
        eta: etaSeconds === Infinity ? '--:--' : formatDuration(etaSeconds),
        etaSeconds,
        velocity,
        acceleration,
        trend,
        completionProbability
      });

      // Generate Insights
      const newInsights: AIInsight[] = [];
      
      if (trend === 'stalled' && remaining > 0) {
        newInsights.push({
          id: generateId(),
          type: 'anomaly',
          message: 'Progress appears to have stalled. Check dependent processes.',
          confidence: 0.92,
          timestamp: now,
          severity: 'high'
        });
      }

      if (trend === 'accelerating' && velocity > (max * 0.1)) {
        newInsights.push({
          id: generateId(),
          type: 'optimization',
          message: 'Velocity exceeding baseline. Resource efficiency is high.',
          confidence: 0.88,
          timestamp: now,
          severity: 'low'
        });
      }

      if (etaSeconds < 10 && remaining > 0) {
        newInsights.push({
          id: generateId(),
          type: 'completion',
          message: 'Completion imminent. Preparing finalization protocols.',
          confidence: 0.99,
          timestamp: now,
          severity: 'medium'
        });
      }

      setInsights(prev => {
        // Merge and deduplicate based on type/message to avoid spam
        const combined = [...newInsights, ...prev];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.message === v.message) === i);
        return unique.slice(0, 5);
      });
    };

    const timer = setTimeout(analyze, 1000);
    return () => clearTimeout(timer);
  }, [history, max, enabled]);

  return { prediction, insights };
};

const formatDuration = (seconds: number): string => {
  if (seconds === Infinity) return '∞';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
};

// --- Main Component ---

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ 
  className, 
  value: propValue = 0, 
  max = 100, 
  min = 0,
  buffer,
  segments,
  variant = 'default', 
  size = 'md', 
  orientation = 'horizontal',
  showValue = false,
  showLabel = false,
  label,
  labelPosition = 'top',
  valueFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
  animation = 'none',
  indeterminate = false,
  milestones = [],
  thickness,
  rounded = 'full',
  enableAIAnalytics = false,
  showAIInsights = false,
  interactive = false,
  readOnly = false,
  onValueChange,
  onValueCommit,
  onDragStart,
  onDragEnd,
  trackColor,
  indicatorColor,
  customGradient,
  ...props 
}, ref) => {
  
  // --- State Management ---
  const [internalValue, setInternalValue] = React.useState(propValue || 0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hoveredMilestone, setHoveredMilestone] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync props
  React.useEffect(() => {
    if (!isDragging) {
      setInternalValue(propValue || 0);
    }
  }, [propValue, isDragging]);

  // AI Hook
  const { prediction, insights } = useAIProgressAnalytics(internalValue, max, min, enableAIAnalytics);

  // --- Computed Values ---
  const percentage = clamp(((internalValue - min) / (max - min)) * 100, 0, 100);
  const bufferPercentage = buffer ? clamp(((buffer - min) / (max - min)) * 100, 0, 100) : 0;
  const isVertical = orientation === 'vertical';

  // --- Interaction Handlers ---
  const calculateValueFromEvent = React.useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return min;
    const rect = containerRef.current.getBoundingClientRect();
    
    let newValue = 0;
    if (isVertical) {
      const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY;
      const relativeY = clamp(rect.bottom - clientY, 0, rect.height);
      newValue = (relativeY / rect.height) * (max - min) + min;
    } else {
      const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
      const relativeX = clamp(clientX - rect.left, 0, rect.width);
      newValue = (relativeX / rect.width) * (max - min) + min;
    }
    return Math.round(newValue * 100) / 100; // Round to 2 decimals
  }, [isVertical, max, min]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive || readOnly) return;
    setIsDragging(true);
    onDragStart?.();
    const newVal = calculateValueFromEvent(e);
    setInternalValue(newVal);
    onValueChange?.(newVal);
  };

  const handleInteractionMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const newVal = calculateValueFromEvent(e);
    setInternalValue(newVal);
    onValueChange?.(newVal);
  }, [isDragging, calculateValueFromEvent, onValueChange]);

  const handleInteractionEnd = React.useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
      onValueCommit?.(internalValue);
    }
  }, [isDragging, onDragEnd, onValueCommit, internalValue]);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleInteractionMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchmove', handleInteractionMove);
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleInteractionMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleInteractionMove, handleInteractionEnd]);

  // --- Style Generators ---
  const getSizeStyles = () => {
    const base = isVertical ? 'w-4' : 'h-4';
    if (thickness) return isVertical ? { width: thickness } : { height: thickness };
    
    switch(size) {
      case 'xs': return isVertical ? 'w-1' : 'h-1';
      case 'sm': return isVertical ? 'w-2' : 'h-2';
      case 'md': return isVertical ? 'w-4' : 'h-4';
      case 'lg': return isVertical ? 'w-6' : 'h-6';
      case 'xl': return isVertical ? 'w-8' : 'h-8';
      case '2xl': return isVertical ? 'w-12' : 'h-12';
      case '3xl': return isVertical ? 'w-16' : 'h-16';
      case '4xl': return isVertical ? 'w-24' : 'h-24';
      default: return base;
    }
  };

  const getRadiusClass = () => {
    if (rounded === true || rounded === 'full') return 'rounded-full';
    if (rounded === 'none') return 'rounded-none';
    if (rounded === 'sm') return 'rounded-sm';
    if (rounded === 'md') return 'rounded-md';
    if (rounded === 'lg') return 'rounded-lg';
    return 'rounded-full';
  };

  const getIndicatorColor = () => {
    if (indicatorColor) return { backgroundColor: indicatorColor };
    if (customGradient) return { backgroundImage: `linear-gradient(to right, ${customGradient.join(', ')})` };

    switch(variant) {
      case 'success': return { backgroundColor: '#22c55e' }; // green-500
      case 'warning': return { backgroundColor: '#eab308' }; // yellow-500
      case 'danger': return { backgroundColor: '#ef4444' }; // red-500
      case 'info': return { backgroundColor: '#3b82f6' }; // blue-500
      case 'neutral': return { backgroundColor: '#6b7280' }; // gray-500
      case 'brand': return { backgroundColor: '#4f46e5' }; // indigo-600
      case 'gradient-cool': return { backgroundImage: 'linear-gradient(to right, #06b6d4, #2563eb)' };
      case 'gradient-warm': return { backgroundImage: 'linear-gradient(to right, #f59e0b, #dc2626)' };
      case 'gradient-cyber': return { backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4)' };
      case 'glass': return { backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' };
      case 'ai-adaptive': 
        if (prediction?.trend === 'accelerating') return { backgroundImage: 'linear-gradient(to right, #10b981, #059669)' };
        if (prediction?.trend === 'decelerating') return { backgroundImage: 'linear-gradient(to right, #f59e0b, #d97706)' };
        if (prediction?.trend === 'stalled') return { backgroundColor: '#ef4444' };
        return { backgroundImage: 'linear-gradient(to right, #8b5cf6, #d946ef)' };
      default: return { backgroundColor: '#06b6d4' }; // cyan-500
    }
  };

  const getShadowClass = () => {
    if (variant === 'glass') return 'shadow-lg ring-1 ring-white/20';
    if (['gradient-cyber', 'ai-adaptive'].includes(variant)) return 'shadow-[0_0_15px_rgba(139,92,246,0.3)]';
    return '';
  };

  // --- Render Helpers ---

  const renderMilestones = () => {
    return milestones.map((m, idx) => {
      const mPos = clamp(((m.value - min) / (max - min)) * 100, 0, 100);
      const isReached = internalValue >= m.value;
      const mId = m.id || `milestone-${idx}`;
      
      return (
        <div
          key={mId}
          className={cn(
            "absolute z-20 flex items-center justify-center transition-all duration-300",
            isVertical ? "left-1/2 -translate-x-1/2 translate-y-1/2" : "top-1/2 -translate-y-1/2 -translate-x-1/2"
          )}
          style={{
            [isVertical ? 'bottom' : 'left']: `${mPos}%`,
          }}
          onMouseEnter={() => setHoveredMilestone(mId)}
          onMouseLeave={() => setHoveredMilestone(null)}
        >
          <div 
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isReached ? "scale-125" : "scale-100",
              m.color ? "" : (isReached ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-gray-600")
            )}
            style={{ backgroundColor: isReached ? m.reachedColor : m.color }}
          />
          
          {/* Milestone Tooltip */}
          {(hoveredMilestone === mId || m.tooltip) && (
            <div className={cn(
              "absolute bg-gray-900 text-white text-[10px] px-2 py-1 rounded border border-gray-700 shadow-xl whitespace-nowrap pointer-events-none transition-opacity",
              hoveredMilestone === mId ? "opacity-100" : "opacity-0",
              isVertical ? "left-full ml-2" : "-top-8"
            )}>
              <div className="font-bold">{m.label || `${m.value}`}</div>
              {m.tooltip && <div className="text-gray-400 font-light">{m.tooltip}</div>}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSegments = () => {
    if (!segments || segments.length === 0) return null;
    
    let accumulated = 0;
    return segments.map((seg) => {
      const segSize = clamp((seg.value / (max - min)) * 100, 0, 100 - accumulated);
      accumulated += segSize;
      
      return (
        <div
          key={seg.id}
          className={cn("relative group transition-all duration-500", seg.className)}
          style={{ 
            [isVertical ? 'height' : 'width']: `${segSize}%`,
            [isVertical ? 'width' : 'height']: '100%',
            backgroundColor: seg.color || '#374151'
          }}
        >
          {/* Segment Tooltip */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity flex items-center justify-center">
             {seg.label && <span className="text-[10px] font-bold text-white drop-shadow-md">{seg.label}</span>}
          </div>
        </div>
      );
    });
  };

  const renderAIOverlay = () => {
    if (!enableAIAnalytics || !prediction) return null;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
        {/* Velocity Particles (Simulated with CSS) */}
        {prediction.trend === 'accelerating' && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay animate-pulse" />
        )}
        {/* Scanline for high-tech feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] animate-[scan_3s_ease-in-out_infinite]" />
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "flex group/progress",
        isVertical ? "flex-row h-full" : "flex-col w-full",
        className
      )} 
      {...props}
    >
      {/* --- Header / Labels --- */}
      {(showLabel || showValue || (enableAIAnalytics && prediction)) && (
        <div className={cn(
          "flex justify-between text-sm font-medium text-gray-300 mb-1",
          isVertical ? "flex-col-reverse items-center mr-2 h-full py-1" : "items-end w-full"
        )}>
          <div className="flex flex-col">
            {label && <span className={cn("font-semibold tracking-tight", isVertical && "rotate-180 writing-mode-vertical")}>{label}</span>}
            
            {/* AI Status Line */}
            {enableAIAnalytics && prediction && !isVertical && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "flex h-1.5 w-1.5 rounded-full",
                  prediction.trend === 'accelerating' ? "bg-green-500 animate-pulse" :
                  prediction.trend === 'decelerating' ? "bg-yellow-500" :
                  prediction.trend === 'stalled' ? "bg-red-500" : "bg-blue-500"
                )} />
                <span className="text-[10px] text-gray-400 font-mono uppercase">
                  ETA: <span className="text-gray-200">{prediction.eta}</span>
                </span>
                <span className="text-[10px] text-gray-500">|</span>
                <span className="text-[10px] text-gray-400 font-mono uppercase">
                  VEL: <span className="text-gray-200">{prediction.velocity.toFixed(1)}/s</span>
                </span>
              </div>
            )}
          </div>
          
          {showValue && (
            <span className={cn("font-mono text-cyan-400", isVertical && "rotate-180 writing-mode-vertical")}>
              {valueFormatter(internalValue, max)}
            </span>
          )}
        </div>
      )}

      {/* --- Main Track Container --- */}
      <div
        ref={containerRef}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        className={cn(
          "relative overflow-hidden bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-inner",
          getRadiusClass(),
          isVertical ? "flex flex-col-reverse" : "flex flex-row",
          interactive && !readOnly ? "cursor-pointer hover:border-gray-500 hover:bg-gray-800" : "",
          getSizeStyles().width ? "" : (isVertical ? "w-4" : "w-full"),
          getSizeStyles().height ? "" : (isVertical ? "h-full" : "h-4")
        )}
        style={{
          ...getSizeStyles(),
          backgroundColor: trackColor
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(${isVertical ? 0 : 90}deg, #fff 1px, transparent 1px)`, 
            backgroundSize: isVertical ? '100% 10px' : '10px 100%' 
          }} 
        />

        {/* Buffer Bar */}
        {buffer && (
          <div
            className="absolute bg-gray-600/30 transition-all duration-300 ease-out z-0"
            style={{
              [isVertical ? 'height' : 'width']: `${bufferPercentage}%`,
              [isVertical ? 'width' : 'height']: '100%',
              [isVertical ? 'bottom' : 'left']: 0
            }}
          />
        )}

        {/* Milestones Layer */}
        {renderMilestones()}

        {/* Segments or Main Bar */}
        {segments && segments.length > 0 ? (
          renderSegments()
        ) : (
          <div
            className={cn(
              "relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10",
              getShadowClass(),
              animation === 'pulse' && "animate-pulse",
              animation === 'indeterminate' && "w-full origin-left animate-[indeterminate_1.5s_infinite_linear]"
            )}
            style={{
              [isVertical ? 'height' : 'width']: `${percentage}%`,
              [isVertical ? 'width' : 'height']: '100%',
              ...getIndicatorColor()
            }}
          >
            {/* Inner Glare/Shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            
            {/* Striped Animation */}
            {(animation === 'flow' || animation === 'indeterminate') && (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                 <div className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[stripe-flow_1s_linear_infinite]" />
              </div>
            )}

            {/* Leading Edge Spark */}
            {!indeterminate && percentage > 0 && percentage < 100 && (
              <div className={cn(
                "absolute bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20",
                isVertical ? "top-0 left-0 right-0 h-[2px]" : "right-0 top-0 bottom-0 w-[2px]"
              )} />
            )}
          </div>
        )}

        {/* AI Overlay Effects */}
        {renderAIOverlay()}
      </div>

      {/* --- Footer / Insights Panel --- */}
      {showAIInsights && enableAIAnalytics && insights.length > 0 && (
        <div className="mt-3 space-y-2 w-full">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={cn(
                "flex items-start gap-3 p-2 rounded bg-gray-900/50 border border-gray-800 text-xs animate-in slide-in-from-top-2 fade-in duration-300",
                insight.severity === 'high' ? "border-l-red-500 border-l-2" :
                insight.severity === 'medium' ? "border-l-yellow-500 border-l-2" : "border-l-blue-500 border-l-2"
              )}
            >
              <div className={cn(
                "mt-0.5 w-2 h-2 rounded-full shrink-0",
                insight.type === 'optimization' ? "bg-green-500 shadow-green-500/50 shadow-sm" :
                insight.type === 'anomaly' ? "bg-red-500 shadow-red-500/50 shadow-sm" : "bg-blue-500"
              )} />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono uppercase text-gray-400 text-[10px] tracking-wider">AI-{insight.type}</span>
                  <span className="text-[10px] text-gray-600">{(insight.confidence * 100).toFixed(0)}% conf</span>
                </div>
                <span className="text-gray-300 leading-tight">{insight.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Inject Styles for Custom Animations since we can't import CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes stripe-flow {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        @keyframes indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); }
        }
        .writing-mode-vertical {
          writing-mode: vertical-rl;
        }
      `}} />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };