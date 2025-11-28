```tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, default 3000
  onDismiss?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  duration = 3000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration]);

  useEffect(() => {
    if (!isVisible && onDismiss) {
      onDismiss();
    }
  }, [isVisible, onDismiss]);


  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };


  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 right-4 z-50 rounded-md shadow-md p-4 text-white ${getBackgroundColor()}`}
        style={{
          minWidth: '200px',
          maxWidth: '350px',
        }}
      >
        {message}
      </motion.div>
    )
  );
};

export default NotificationToast;
```