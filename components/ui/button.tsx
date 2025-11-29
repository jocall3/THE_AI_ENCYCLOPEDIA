import React from 'react';

/**
 * Utility function to conditionally join CSS class names.
 * Filters out falsy values and concatenates the remaining strings with a space.
 * @param classes - An array of class names, which can be strings, undefined, null, or false.
 * @returns A single string of space-separated class names.
 */
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * Defines the core visual styles for different button variants, sizes, shapes, and states.
 * This object is highly extensible to support a wide range of design systems and dynamic requirements.
 */
const buttonVariants = {
  /**
   * Visual style variants for the button.
   * Each variant defines background, text color, and hover/focus/active states.
   */
  variant: {
    default: "bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-cyan-500 active:bg-cyan-800",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800",
    outline: "border border-cyan-500 bg-transparent hover:bg-cyan-500/10 text-cyan-400 focus-visible:ring-cyan-500 active:bg-cyan-500/20",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 focus-visible:ring-gray-500 active:bg-gray-800",
    ghost: "hover:bg-gray-700 text-gray-200 focus-visible:ring-gray-500 active:bg-gray-800",
    link: "text-cyan-400 underline-offset-4 hover:underline focus-visible:ring-cyan-500 active:text-cyan-500",
    // --- AI-Enhanced & Business-Centric Variants ---
    brandPrimary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 active:bg-indigo-800 shadow-lg shadow-indigo-500/50",
    brandSecondary: "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500 active:bg-purple-800 shadow-md shadow-purple-500/40",
    success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 active:bg-green-800",
    warning: "bg-yellow-500 text-gray-900 hover:bg-yellow-600 focus-visible:ring-yellow-400 active:bg-yellow-700",
    info: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-400 active:bg-blue-700",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus-visible:ring-white/50 active:bg-white/30",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus-visible:ring-purple-400 active:from-purple-700 active:to-pink-700 shadow-lg shadow-purple-500/50",
    aiSuggest: "bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:from-teal-500 hover:to-cyan-600 focus-visible:ring-teal-300 active:from-teal-600 active:to-cyan-700 shadow-md shadow-teal-500/40", // AI-driven suggestion
    aiAction: "bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:from-fuchsia-600 hover:to-rose-600 focus-visible:ring-fuchsia-400 active:from-fuchsia-700 active:to-rose-700 shadow-lg shadow-fuchsia-500/50", // AI-driven critical action
  },
  /**
   * Size variants for the button, affecting height, padding, and font size.
   */
  size: {
    xs: "h-8 px-3 text-xs rounded",
    sm: "h-9 px-3 text-sm rounded-md",
    default: "h-10 py-2 px-4 text-sm rounded-md",
    lg: "h-11 px-8 text-base rounded-md",
    xl: "h-12 px-10 text-lg rounded-lg",
    icon: "h-10 w-10 rounded-md",
    iconSm: "h-9 w-9 rounded-md",
    iconLg: "h-11 w-11 rounded-md",
    fluid: "h-10 w-full py-2 px-4 text-sm rounded-md", // Full width button
  },
  /**
   * Shape variants for the button, primarily affecting border-radius.
   */
  shape: {
    rounded: "rounded-md",
    square: "rounded-none",
    circle: "rounded-full",
    pill: "rounded-full",
  },
  /**
   * State-specific styles for loading, disabled, and toggled states.
   */
  state: {
    loading: "cursor-wait opacity-70",
    disabled: "opacity-50 cursor-not-allowed",
    toggled: "ring-2 ring-offset-2 ring-cyan-500/70 bg-cyan-700/80", // Visual feedback for toggled state
  },
  /**
   * Styles for buttons containing icons.
   */
  iconPlacement: {
    left: "flex-row-reverse", // Icon on the left, text on the right
    right: "flex-row",      // Icon on the right, text on the left
  },
};

/**
 * Defines the properties for the Button component.
 * Extends standard HTML button attributes and adds custom styling and behavior props.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button.
   * @default 'default'
   */
  variant?: keyof typeof buttonVariants.variant;
  /**
   * The size of the button.
   * @default 'default'
   */
  size?: keyof typeof buttonVariants.size;
  /**
   * The shape of the button.
   * @default 'rounded'
   */
  shape?: keyof typeof buttonVariants.shape;
  /**
   * If true, the button will display a loading spinner and be disabled.
   * @default false
   */
  isLoading?: boolean;
  /**
   * An optional icon to display within the button. Can be any ReactNode (e.g., SVG, FontAwesome icon).
   */
  icon?: React.ReactNode;
  /**
   * The position of the icon relative to the button text.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * If true, the button will have a ripple effect on click.
   * @default false
   */
  rippleEffect?: boolean;
  /**
   * If true, the button will visually indicate a toggled state.
   * Useful for toggle buttons or active filters.
   * @default false
   */
  isToggled?: boolean;
  /**
   * Callback function triggered when the button's toggled state changes.
   * Only relevant if `isToggled` is used for internal state management.
   */
  onToggle?: (toggled: boolean) => void;
  /**
   * Optional tooltip content to display on hover.
   * The button itself will manage the tooltip's visibility and positioning.
   */
  tooltipContent?: string;
  /**
   * Delay in milliseconds before the tooltip appears.
   * @default 500
   */
  tooltipDelay?: number;
  /**
   * Defines the type of feedback provided on interaction (e.g., haptic, visual).
   * In a real system, 'haptic' would trigger device vibration. Here, it's simulated.
   * @default 'visual'
   */
  feedbackType?: 'haptic' | 'visual' | 'none';
  /**
   * An object containing dynamic CSS properties that can be applied to the button.
   * This can be used for AI-driven styling adjustments based on user context or preferences.
   * Example: `{ backgroundColor: 'var(--ai-suggested-color)' }`
   */
  dynamicStyles?: React.CSSProperties;
  /**
   * Contextual data provided by an AI system, influencing button behavior or appearance.
   * This prop allows the button to be "AI-aware" without containing the AI logic itself.
   * Example: `{ userSentiment: 'positive', urgencyScore: 0.8, recommendedAction: 'confirm' }`
   */
  aiContext?: Record<string, any>;
  /**
   * A preset for button animations on click or hover.
   * @default 'none'
   */
  animationPreset?: 'fade' | 'slide' | 'bounce' | 'none';
  /**
   * Custom data attributes for analytics or testing purposes.
   * Example: `{ 'data-analytics-id': 'confirm-purchase-button' }`
   */
  analyticsData?: Record<string, string>;
}

/**
 * Manages the internal state and logic for a single button instance.
 * This hook encapsulates complex interactions like ripple effects, loading states,
 * and accessibility enhancements, making the main component cleaner.
 * @param props - The ButtonProps passed to the component.
 * @returns An object containing derived state and event handlers.
 */
const useButtonState = (props: ButtonProps) => {
  const {
    isLoading,
    isToggled: propIsToggled,
    onToggle,
    rippleEffect,
    feedbackType = 'visual',
    animationPreset = 'none',
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onFocus,
    onBlur,
    aiContext,
    analyticsData,
    disabled,
    ...restProps
  } = props;

  const [isInternalToggled, setIsInternalToggled] = React.useState(propIsToggled || false);
  const [ripple, setRipple] = React.useState<{ x: number; y: number; size: number; id: number }[]>([]);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Synchronize internal toggled state with prop
  React.useEffect(() => {
    if (propIsToggled !== undefined && propIsToggled !== isInternalToggled) {
      setIsInternalToggled(propIsToggled);
    }
  }, [propIsToggled, isInternalToggled]);

  // Effect for ripple animation cleanup
  React.useEffect(() => {
    if (ripple.length > 0) {
      const timeout = setTimeout(() => {
        setRipple(prev => prev.slice(1));
      }, 600); // Ripple animation duration
      return () => clearTimeout(timeout);
    }
  }, [ripple]);

  // Effect for haptic feedback simulation
  React.useEffect(() => {
    if (isPressed && feedbackType === 'haptic') {
      // In a real application, this would trigger a device vibration API.
      // For web, we can simulate a subtle visual cue or log.
      console.log('Haptic feedback simulated for button press.');
      // Example: navigator.vibrate(50); // Requires user gesture and browser support
    }
  }, [isPressed, feedbackType]);

  // Effect for AI context changes (simulated dynamic behavior)
  React.useEffect(() => {
    if (aiContext) {
      console.log('AI Context updated for button:', aiContext);
      // Example: If aiContext.urgencyScore > 0.7, maybe trigger a subtle pulse animation
      // This would involve setting internal state for animation classes.
    }
  }, [aiContext]);

  /**
   * Handles the click event for the button.
   * Manages toggled state, ripple effect, and calls the original onClick handler.
   * @param event - The React mouse event.
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;

    if (onToggle) {
      const newToggledState = !isInternalToggled;
      setIsInternalToggled(newToggledState);
      onToggle(newToggledState);
    }

    if (rippleEffect && buttonRef.current) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setRipple(prev => [...prev, { x, y, size, id: Date.now() }]);
    }

    // Simulate analytics event
    if (analyticsData) {
      console.log('Button Click Analytics:', { ...analyticsData, timestamp: new Date().toISOString() });
    }

    onClick?.(event);
  };

  /**
   * Handles the mouse down event for the button.
   * @param event - The React mouse event.
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    onMouseDown?.(event);
  };

  /**
   * Handles the mouse up event for the button.
   * @param event - The React mouse event.
   */
  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseUp?.(event);
  };

  /**
   * Handles the mouse leave event for the button.
   * @param event - The React mouse event.
   */
  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    setIsPressed(false); // Ensure pressed state is reset if mouse leaves while pressed
    onMouseLeave?.(event);
  };

  /**
   * Handles the mouse enter event for the button.
   * @param event - The React mouse event.
   */
  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    // Simulate AI-driven hover feedback based on context
    if (aiContext?.userSentiment === 'negative' && aiContext?.urgencyScore > 0.5) {
      console.log('AI suggests emphasizing this button due to negative sentiment and high urgency.');
      // Could trigger a subtle border glow or a different hover state.
    }
  };

  /**
   * Handles the focus event for the button.
   * @param event - The React focus event.
   */
  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  /**
   * Handles the blur event for the button.
   * @param event - The React focus event.
   */
  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // Determine if the button is truly disabled (either via prop or loading state)
  const effectiveDisabled = disabled || isLoading;

  // Generate dynamic styles based on AI context or other props
  const getDynamicStyles = React.useCallback(() => {
    const styles: React.CSSProperties = { ...props.dynamicStyles };

    if (aiContext?.recommendedAction === 'highlight') {
      styles.boxShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
      styles.animation = 'pulse 1.5s infinite alternate'; // Requires CSS keyframe
    }
    if (aiContext?.urgencyScore && aiContext.urgencyScore > 0.8) {
      styles.borderColor = 'red';
      styles.borderWidth = '2px';
    }
    if (isHovered && aiContext?.userSentiment === 'positive') {
      styles.transform = 'scale(1.02)';
      styles.transition = 'transform 0.1s ease-out';
    }
    if (isPressed) {
      styles.transform = 'scale(0.98)';
      styles.transition = 'transform 0.05s ease-in';
    }

    return styles;
  }, [props.dynamicStyles, aiContext, isHovered, isPressed]);

  // Generate animation classes
  const getAnimationClasses = React.useCallback(() => {
    switch (animationPreset) {
      case 'fade': return 'animate-fade-in'; // Requires Tailwind/CSS animation
      case 'slide': return 'animate-slide-up';
      case 'bounce': return 'animate-bounce-once';
      default: return '';
    }
  }, [animationPreset]);

  return {
    buttonRef,
    effectiveDisabled,
    isInternalToggled,
    ripple,
    isHovered,
    isFocused,
    isPressed,
    handleClick,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
    handleFocus,
    handleBlur,
    getDynamicStyles,
    getAnimationClasses,
    restProps,
  };
};

/**
 * A highly customizable and AI-aware button component designed for enterprise applications.
 * It supports various visual styles, sizes, shapes, loading states, icons, and advanced interactions
 * like ripple effects and toggling. It is built with accessibility and performance in mind,
 * and includes hooks for AI-driven dynamic styling and behavior.
 *
 * @param {ButtonProps} props - The properties for the button component.
 * @returns {JSX.Element} The rendered button element.
 *
 * @example
 * // Basic button
 * <Button>Click Me</Button>
 *
 * @example
 * // Destructive button with loading state and icon
 * <Button variant="destructive" isLoading icon={<TrashIcon />}>Delete Item</Button>
 *
 * @example
 * // AI-suggested button with dynamic styles
 * <Button variant="aiSuggest" aiContext={{ urgencyScore: 0.9, recommendedAction: 'highlight' }} dynamicStyles={{ borderColor: 'gold' }}>
 *   AI Recommended Action
 * </Button>
 *
 * @example
 * // Toggle button with ripple effect
 * <Button variant="outline" isToggled={isActive} onToggle={setIsActive} rippleEffect>
 *   Toggle Feature
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, forwardedRef) => {
    const {
      className,
      variant = 'default',
      size = 'default',
      shape = 'rounded',
      isLoading = false,
      icon,
      iconPosition = 'left',
      tooltipContent,
      tooltipDelay = 500,
      children,
      dynamicStyles, // Destructure to prevent passing to DOM element
      aiContext,     // Destructure to prevent passing to DOM element
      analyticsData, // Destructure to prevent passing to DOM element
      animationPreset, // Destructure to prevent passing to DOM element
      feedbackType, // Destructure to prevent passing to DOM element
      rippleEffect, // Destructure to prevent passing to DOM element
      isToggled: propIsToggled, // Destructure to prevent passing to DOM element
      onToggle, // Destructure to prevent passing to DOM element
      ...domProps
    } = props;

    const {
      buttonRef,
      effectiveDisabled,
      isInternalToggled,
      ripple,
      isHovered,
      isFocused,
      isPressed,
      handleClick,
      handleMouseDown,
      handleMouseUp,
      handleMouseLeave,
      handleMouseEnter,
      handleFocus,
      handleBlur,
      getDynamicStyles,
      getAnimationClasses,
      restProps,
    } = useButtonState({ ...props, disabled: domProps.disabled || isLoading }); // Pass disabled prop to hook

    // Combine the forwarded ref with the internal ref
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else {
            (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }
        }
        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [forwardedRef, buttonRef]
    );

    // Determine icon and text order
    const iconElement = icon ? (
      <span
        className={cn(
          "flex items-center justify-center",
          children && iconPosition === 'left' && "mr-2",
          children && iconPosition === 'right' && "ml-2",
          isLoading && "animate-spin" // Apply spin to icon if loading
        )}
        aria-hidden="true"
      >
        {isLoading ? (
          // Simple SVG spinner for loading state
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          icon
        )}
      </span>
    ) : null;

    const buttonContent = (
      <>
        {iconPosition === 'left' && iconElement}
        {children && <span className="whitespace-nowrap">{children}</span>}
        {iconPosition === 'right' && iconElement}
      </>
    );

    // Tooltip rendering logic (simplified, a real tooltip would be a separate component)
    const tooltip = tooltipContent ? (
      <div
        className={cn(
          "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300",
          "bottom-full mb-2 left-1/2 -translate-x-1/2", // Position above button
          "before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-full before:border-8 before:border-transparent before:border-t-gray-800" // Arrow
        )}
        style={{ transitionDelay: `${tooltipDelay}ms` }}
        role="tooltip"
      >
        {tooltipContent}
      </div>
    ) : null;

    // Accessibility attributes based on state
    const ariaProps: React.AriaAttributes = {
      'aria-disabled': effectiveDisabled,
      'aria-busy': isLoading,
      'aria-pressed': onToggle ? isInternalToggled : undefined, // Only for toggle buttons
      'aria-label': props['aria-label'] || (typeof children === 'string' ? children : undefined),
    };

    return (
      <button
        className={cn(
          "group relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          "disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          buttonVariants.shape[shape],
          isLoading && buttonVariants.state.loading,
          effectiveDisabled && buttonVariants.state.disabled,
          isInternalToggled && buttonVariants.state.toggled,
          icon && children && buttonVariants.iconPlacement[iconPosition], // Apply flex direction for icon placement
          getAnimationClasses(),
          className
        )}
        style={getDynamicStyles()}
        ref={setRefs}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={effectiveDisabled}
        {...ariaProps}
        {...restProps} // Pass remaining DOM props
      >
        {buttonContent}
        {rippleEffect && ripple.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white opacity-75 animate-ripple pointer-events-none"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
          />
        ))}
        {tooltip}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };