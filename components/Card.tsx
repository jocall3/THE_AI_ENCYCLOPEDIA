// components/Card.tsx
//
// Basic Card Component
//
// A standard UI container component for displaying content.
// Supports various visual styles, loading states, and interactions.

import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';

// ================================================================================================
// 1. TYPE DEFINITIONS
// ================================================================================================

/**
 * @description Defines the visual style of the card.
 */
export type CardVariant = 
  | 'default' 
  | 'outline' 
  | 'ghost' 
  | 'interactive' 
  | 'holographic' 
  | 'neural' 
  | 'quantum' 
  | 'dashboard-widget' 
  | 'ai-insight' 
  | 'critical-alert'
  | 'glass-morphism';

/**
 * @description Defines the processing mode for the card.
 */
export type AIProcessingMode = 'passive' | 'reactive' | 'predictive' | 'generative' | 'autonomous';

/**
 * @description Controls the card's internal padding.
 */
export type CardPadding = 'none' | 'compact' | 'standard' | 'relaxed' | 'spacious' | 'golden-ratio';

/**
 * @description Configuration for KPI display.
 */
export interface KPIConfig {
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  historicalData?: number[];
  predictionConfidence?: number;
}

/**
 * @description Structure for action recommendations.
 */
export interface AIActionRecommendation {
  id: string;
  confidenceScore: number;
  label: string;
  impact: 'low' | 'medium' | 'high';
  execute: () => void;
}

/**
 * @description Header action definition.
 */
export interface CardHeaderAction {
  id: string;
  icon: React.ReactElement;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  disabled?: boolean;
  requiresAuth?: boolean;
  loading?: boolean;
}

/**
 * @description Props interface for the Card component.
 */
export interface CardProps {
  // --- Core Identity ---
  id?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  
  // --- Visual Styling ---
  variant?: CardVariant;
  className?: string;
  padding?: CardPadding;
  accentColor?: string;
  backgroundImageUrl?: string;
  opacity?: number;
  
  // --- Structural Components ---
  headerActions?: CardHeaderAction[];
  footerContent?: ReactNode;
  sidebarContent?: ReactNode;
  
  // --- State & Behavior ---
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isFullScreen?: boolean;
  
  // --- Data & Loading ---
  isLoading?: boolean;
  loadingMessage?: string;
  loadingProgress?: number; // 0-100
  lastUpdated?: Date;
  
  // --- Error Handling ---
  errorState?: string | null;
  errorSeverity?: 'low' | 'medium' | 'critical';
  onRetry?: () => void;
  
  // --- AI & Intelligence Features ---
  aiMode?: AIProcessingMode;
  aiInsights?: string[];
  aiConfidence?: number;
  showNeuralNetworkOverlay?: boolean;
  
  // --- Business Logic ---
  kpiData?: KPIConfig;
  relatedEntities?: string[];
  
  // --- Event Handlers ---
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onHover?: (isHovering: boolean) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onAIAnalysisComplete?: (result: any) => void;
  
  // --- Custom Renderers ---
  loadingIndicator?: ReactNode;
  customHeader?: ReactNode;
}

// ================================================================================================
// 2. UTILITY FUNCTIONS
// ================================================================================================

/**
 * @description Calculates Tailwind classes based on variant.
 */
const getVariantClasses = (variant: CardVariant, aiMode?: AIProcessingMode): string => {
  const base = "transition-all duration-500 ease-out relative overflow-hidden";
  
  switch (variant) {
    case 'outline':
      return `${base} bg-transparent border-2 border-gray-600/80 shadow-sm hover:border-gray-400`;
    case 'ghost':
      return `${base} bg-transparent border-none shadow-none hover:bg-gray-800/30`;
    case 'interactive':
      return `${base} bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-xl shadow-lg hover:scale-[1.01] hover:shadow-xl hover:border-blue-500/50 cursor-pointer`;
    case 'holographic':
      return `${base} bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-2xl text-blue-100`;
    case 'neural':
      return `${base} bg-gray-900 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] rounded-xl`;
    case 'quantum':
      return `${base} bg-black border border-indigo-500/50 shadow-2xl rounded-none`;
    case 'dashboard-widget':
      return `${base} bg-white/5 dark:bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl`;
    case 'ai-insight':
      return `${base} bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-l-4 border-indigo-400 rounded-r-xl shadow-lg`;
    case 'critical-alert':
      return `${base} bg-red-950/90 border-2 border-red-600 animate-pulse-slow rounded-lg`;
    case 'glass-morphism':
      return `${base} bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl rounded-2xl`;
    case 'default':
    default:
      return `${base} bg-gray-800/60 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg`;
  }
};

/**
 * @description Maps padding props to CSS classes.
 */
const getPaddingClasses = (padding: CardPadding): string => {
  switch(padding) {
    case 'none': return 'p-0';
    case 'compact': return 'p-2 sm:p-3';
    case 'standard': return 'p-4 sm:p-6';
    case 'relaxed': return 'p-6 sm:p-8';
    case 'spacious': return 'p-8 sm:p-12';
    case 'golden-ratio': return 'p-[1.618rem]';
    default: return 'p-6';
  }
};

/**
 * @description Gets color based on confidence score.
 */
const getConfidenceColor = (score: number): string => {
  if (score >= 0.9) return 'text-emerald-400';
  if (score >= 0.7) return 'text-blue-400';
  if (score >= 0.5) return 'text-yellow-400';
  return 'text-red-400';
};

// ================================================================================================
// 3. INTERNAL SUB-COMPONENTS
// ================================================================================================

/**
 * @description Background visualization for specific card variants.
 */
const NeuralBackground: React.FC = () => (
  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="neural-net" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-emerald-500" />
          <path d="M2 2 L42 42 M2 42 L42 2" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/50" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#neural-net)" />
    </svg>
  </div>
);

/**
 * @description Scanner effect for holographic cards.
 */
const HolographicScanner: React.FC = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
  </div>
);

/**
 * @description Displays KPI metrics.
 */
const KPIDisplay: React.FC<{ config: KPIConfig }> = ({ config }) => {
  const isUp = config.trend === 'up';
  const colorClass = isUp ? 'text-emerald-400' : config.trend === 'down' ? 'text-red-400' : 'text-gray-400';
  
  return (
    <div className="flex items-end space-x-3 mb-4 p-3 bg-black/20 rounded-lg border border-white/5">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Current Metric</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-mono font-bold text-white">{config.value.toLocaleString()}</span>
          <span className="text-sm text-gray-500">{config.unit}</span>
        </div>
      </div>
      <div className={`flex items-center ${colorClass} text-sm font-medium pb-1`}>
        {isUp ? '▲' : config.trend === 'down' ? '▼' : '—'}
        <span className="ml-1">{Math.abs(((config.value - config.target) / config.target) * 100).toFixed(1)}%</span>
      </div>
      {/* Sparkline */}
      <div className="flex-1 h-8 flex items-end space-x-1 opacity-50">
        {(config.historicalData || [40, 60, 45, 70, 65, 80, 75, 90]).map((h, i) => (
          <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-sm ${isUp ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        ))}
      </div>
    </div>
  );
};

/**
 * @description Badge for displaying insights.
 */
const AIInsightBadge: React.FC<{ text: string; confidence: number }> = ({ text, confidence }) => (
  <div className="flex items-center space-x-2 bg-indigo-900/40 border border-indigo-500/30 rounded-full px-3 py-1 my-1 w-fit">
    <div className={`w-2 h-2 rounded-full ${confidence > 0.8 ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
    <span className="text-xs text-indigo-100 font-medium">{text}</span>
    <span className={`text-[10px] ${getConfidenceColor(confidence)}`}>{(confidence * 100).toFixed(0)}%</span>
  </div>
);

/**
 * @description Loading skeleton component.
 */
const DecryptionSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
      </div>
      <div className="space-y-2 pt-4">
        <div className="h-3 bg-gray-700/30 rounded w-full"></div>
        <div className="h-3 bg-gray-700/30 rounded w-11/12"></div>
        <div className="h-3 bg-gray-700/30 rounded w-4/5"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="h-20 bg-gray-800/50 rounded-lg border border-gray-700/30"></div>
        <div className="h-20 bg-gray-800/50 rounded-lg border border-gray-700/30"></div>
        <div className="h-20 bg-gray-800/50 rounded-lg border border-gray-700/30"></div>
      </div>
    </div>
  );
};

/**
 * @description Error state display.
 */
const SystemErrorDisplay: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-red-950/10 border border-red-500/20 rounded-lg m-4">
    <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4 border border-red-500/50">
      <span className="text-2xl text-red-500">!</span>
    </div>
    <h4 className="text-lg font-mono font-bold text-red-400 uppercase tracking-widest">Error</h4>
    <p className="text-red-300/80 mt-2 mb-6 max-w-md font-mono text-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all font-mono text-xs uppercase tracking-wider"
      >
        Retry
      </button>
    )}
  </div>
);

// ================================================================================================
// 4. MAIN COMPONENT
// ================================================================================================

const Card: React.FC<CardProps> = ({
  // Identity
  id,
  title,
  subtitle,
  icon,
  children,
  
  // Styling
  variant = 'default',
  className = '',
  padding = 'standard',
  accentColor,
  backgroundImageUrl,
  opacity = 1,
  
  // Structure
  headerActions,
  footerContent,
  sidebarContent,
  
  // Behavior
  isCollapsible = false,
  defaultCollapsed = false,
  isDraggable = false,
  isFullScreen = false,
  
  // State
  isLoading = false,
  loadingMessage,
  loadingProgress,
  lastUpdated,
  
  // Error
  errorState,
  onRetry,
  
  // AI
  aiMode = 'passive',
  aiInsights,
  aiConfidence,
  showNeuralNetworkOverlay = false,
  
  // Business
  kpiData,
  
  // Events
  onClick,
  onHover,
  onExpand,
  onCollapse,
  
  // Custom
  loadingIndicator,
  customHeader
}) => {
  // --- Internal State Management ---
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible && defaultCollapsed);
  const [isHovering, setIsHovering] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | string>('auto');
  const [internalLoadingProgress, setInternalLoadingProgress] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Handle Collapse Animation Logic
  useEffect(() => {
    if (isCollapsible) {
      if (isCollapsed) {
        setContentHeight(0);
        onCollapse?.();
      } else {
        requestAnimationFrame(() => {
          if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
            onExpand?.();
          }
        });
      }
    }
  }, [isCollapsed, isCollapsible, children, onCollapse, onExpand]);

  // Simulate Loading Progress
  useEffect(() => {
    if (isLoading && !loadingProgress) {
      const interval = setInterval(() => {
        setInternalLoadingProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else if (loadingProgress) {
      setInternalLoadingProgress(loadingProgress);
    } else {
      setInternalLoadingProgress(100);
    }
  }, [isLoading, loadingProgress]);

  // --- Handlers ---

  const toggleCollapse = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isCollapsible) {
      setIsCollapsed(prev => !prev);
    }
  }, [isCollapsible]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onHover?.(false);
  };

  // --- Render Helpers ---

  const renderHeader = () => {
    if (customHeader) return customHeader;
    if (!title && !subtitle && !icon && !headerActions && !isCollapsible) return null;

    return (
      <div 
        className={`flex items-start justify-between mb-4 ${isCollapsible ? 'cursor-pointer select-none' : ''}`}
        onClick={isCollapsible ? toggleCollapse : undefined}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && (
            <div className={`flex-shrink-0 p-2 rounded-lg ${variant === 'neural' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-700/50 text-gray-300'}`}>
              {icon}
            </div>
          )}
          <div className="min-w-0 flex flex-col">
            {title && (
              <h3 className={`text-lg font-bold truncate ${variant === 'holographic' ? 'text-blue-100 tracking-widest uppercase' : 'text-gray-100'}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 truncate font-medium">
                {subtitle}
                {lastUpdated && <span className="ml-2 opacity-60">â€¢ Updated {lastUpdated.toLocaleTimeString()}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* AI Mode Indicator */}
          {aiMode !== 'passive' && (
            <div className="hidden sm:flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse mr-2" />
              <span className="text-[10px] font-mono text-indigo-300 uppercase">{aiMode}</span>
            </div>
          )}

          {headerActions?.map(action => (
            <button
              key={action.id}
              onClick={(e) => { e.stopPropagation(); action.onClick(e); }}
              disabled={action.disabled}
              title={action.label}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-30"
            >
              {action.icon}
            </button>
          ))}

          {isCollapsible && (
            <button
              className={`p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return loadingIndicator || (
        <div className="relative">
          <DecryptionSkeleton />
          {loadingMessage && (
            <div className="absolute bottom-4 left-6 right-6 text-center">
              <p className="text-xs font-mono text-blue-400 animate-pulse">{loadingMessage}...</p>
              <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${internalLoadingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (errorState) {
      return <SystemErrorDisplay message={errorState} onRetry={onRetry} />;
    }

    return (
      <div className="space-y-4">
        {/* KPI Section */}
        {kpiData && <KPIDisplay config={kpiData} />}

        {/* Main Children */}
        <div className="relative z-10">
          {children}
        </div>

        {/* AI Insights Section */}
        {(aiInsights && aiInsights.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Analysis</p>
            <div className="flex flex-wrap gap-2">
              {aiInsights.map((insight, idx) => (
                <AIInsightBadge key={idx} text={insight} confidence={aiConfidence || 0.85} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Class Composition ---
  const variantClasses = getVariantClasses(variant, aiMode);
  const paddingClasses = getPaddingClasses(padding);
  const containerClasses = `
    ${variantClasses}
    ${className}
    ${isDraggable ? 'cursor-move' : ''}
    ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}
  `;

  const dynamicStyles: React.CSSProperties = {
    opacity,
    ...(accentColor ? { borderColor: accentColor } : {}),
    ...(backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' } : {})
  };

  return (
    <div 
      id={id}
      ref={cardRef}
      className={containerClasses.trim().replace(/\s+/g, ' ')}
      style={dynamicStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label={title || "Content Card"}
    >
      {/* Background Effects */}
      {(variant === 'neural' || showNeuralNetworkOverlay) && <NeuralBackground />}
      {variant === 'holographic' && <HolographicScanner />}
      
      {/* Sidebar Layout Wrapper */}
      <div className={`flex h-full ${sidebarContent ? 'flex-row' : 'flex-col'}`}>
        
        {/* Optional Sidebar */}
        {sidebarContent && (
          <div className="w-16 sm:w-64 border-r border-gray-700/50 bg-black/20 flex-shrink-0">
            {sidebarContent}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Area */}
          <div className={`${paddingClasses} pb-0`}>
            {renderHeader()}
          </div>

          {/* Collapsible Content Wrapper */}
          <div
            style={{ height: isCollapsible ? contentHeight : 'auto' }}
            className={`transition-[height] duration-500 ease-in-out overflow-hidden ${isCollapsible ? 'relative' : ''}`}
          >
            <div ref={contentRef} className={paddingClasses}>
              {renderContent()}
            </div>
          </div>

          {/* Footer Area */}
          {footerContent && !isCollapsed && (
            <div className={`mt-auto border-t border-gray-700/50 bg-black/10 ${paddingClasses} py-4`}>
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;