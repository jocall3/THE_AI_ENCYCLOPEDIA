import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle, Zap } from 'lucide-react';

// Constants
const TOAST_BASE_Z_INDEX = 5000;
const DEFAULT_DURATION_MS = 5000;
const ANIMATION_DURATION = 0.35;

// Types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai_insight';

interface NotificationToastProps {
  id: string;
  message: string | React.ReactNode;
  type: ToastType;
  duration?: number;
  onDismiss?: (id: string) => void;
  iconComponent?: React.ReactNode;
  title?: string;
  metadata?: Record<string, any>;
}

// Utility Functions
const getThemeConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        bgColor: 'bg-emerald-600 dark:bg-emerald-700',
        textColor: 'text-white',
        icon: CheckCircle,
        iconColor: 'text-white',
      };
    case 'error':
      return {
        bgColor: 'bg-red-600 dark:bg-red-700',
        textColor: 'text-white',
        icon: XCircle,
        iconColor: 'text-white',
      };
    case 'warning':
      return {
        bgColor: 'bg-amber-500 dark:bg-amber-600',
        textColor: 'text-gray-900 dark:text-gray-100',
        icon: AlertTriangle,
        iconColor: 'text-gray-900 dark:text-gray-100',
      };
    case 'info':
      return {
        bgColor: 'bg-sky-600 dark:bg-sky-700',
        textColor: 'text-white',
        icon: Info,
        iconColor: 'text-white',
      };
    case 'ai_insight':
      return {
        bgColor: 'bg-purple-700 dark:bg-purple-800 border border-purple-400',
        textColor: 'text-white',
        icon: Zap,
        iconColor: 'text-yellow-300',
      };
    default:
      return {
        bgColor: 'bg-gray-600 dark:bg-gray-700',
        textColor: 'text-white',
        icon: Info,
        iconColor: 'text-white',
      };
  }
};

// NotificationToast Component
const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  message,
  type,
  duration = DEFAULT_DURATION_MS,
  onDismiss,
  iconComponent,
  title,
  metadata = {},
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const theme = useMemo(() => getThemeConfig(type), [type]);
  const IconComponent = iconComponent || theme.icon;

  // Auto-dismiss
  useEffect(() => {
    if (duration === null || !isVisible) return;

    const timeoutId = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, isVisible]);

  // Animation end handler
  const handleAnimationEnd = useCallback(() => {
    if (!isVisible || isExiting) {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss(id);
      }
    }
  }, [isVisible, isExiting, onDismiss, id]);

  // Dismiss handler
  const dismissToast = useCallback(() => {
    setIsExiting(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  const renderContent = () => (
    <div className="flex flex-col w-full">
      {(title || IconComponent) && (
        <div className="flex items-center mb-1.5">
          {IconComponent && (
            <IconComponent className={`w-5 h-5 mr-2 flex-shrink-0 ${theme.iconColor}`} />
          )}
          {title ? (
            <h4 className={`font-bold text-sm ${theme.textColor}`}>{title}</h4>
          ) : (
            typeof message === 'string' && message.length > 0 && (
              <h4 className={`font-bold text-sm ${theme.textColor} truncate`}>
                {message.substring(0, 50)}
              </h4>
            )
          )}
        </div>
      )}
      <div className={`text-sm ${theme.textColor} opacity-90`}>
        {typeof message === 'string' ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          message
        )}
      </div>
      {metadata.suggestedAction && (
        <button
          onClick={() => console.log(`Action triggered for ${id}: ${metadata.suggestedAction}`)}
          className="mt-2 text-xs font-semibold underline text-white hover:text-gray-200 transition duration-150 self-start"
        >
          {metadata.suggestedAction}
        </button>
      )}
    </div>
  );

  // Animation variants
  const motionVariants = {
    enter: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  return (
    <motion.div
      id={`toast-${id}`}
      initial="enter"
      animate={isExiting ? 'exit' : 'enter'}
      exit="exit"
      variants={motionVariants}
      transition={{ duration: ANIMATION_DURATION, type: 'spring', stiffness: 100, damping: 20 }}
      onAnimationComplete={handleAnimationEnd}
      className={`
        fixed bottom-4 right-4 z-[${TOAST_BASE_Z_INDEX}] 
        rounded-xl shadow-2xl p-4 
        ${theme.bgColor} 
        ${theme.textColor} 
        transition-all duration-300 ease-in-out
        max-w-sm w-full md:max-w-md lg:max-w-lg
        border-l-4 border-opacity-75
      `}
      style={{
        minWidth: '250px',
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow min-w-0 pr-2">
          {renderContent()}
        </div>
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className={`p-1 ml-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0 ${theme.textColor}`}
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
    toasts: NotificationToastProps[];
    onDismiss: (id: string) => void;
}

// Toast Container
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    const sortedToasts = useMemo(() => {
        return [...toasts].sort((a, b) => a.id.localeCompare(b.id));
    }, [toasts]);

    return (
        <AnimatePresence initial={false}>
            {sortedToasts.map((toast) => (
                <NotificationToast
                    key={toast.id}
                    {...toast}
                    onDismiss={onDismiss}
                />
            ))}
        </AnimatePresence>
    );
};

export { NotificationToast, ToastContainer };
export default NotificationToast;