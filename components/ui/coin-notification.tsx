import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, X } from 'lucide-react';
import { Button } from './button';

interface CoinNotificationProps {
  amount: number;
  description: string;
  show: boolean;
  onClose: () => void;
}

export const CoinNotification = ({ amount, description, show, onClose }: CoinNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg border border-yellow-300 max-w-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="bg-white/20 p-2 rounded-full"
              >
                <Coins className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="font-bold text-lg">+{amount} Coins!</p>
                <p className="text-sm opacity-90">{description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Track recent notifications to prevent duplicates
const RECENT_NOTIFICATIONS = new Map<string, number>();
const NOTIFICATION_TTL = 5000; // 5 seconds

// Clean up old notification keys periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of RECENT_NOTIFICATIONS.entries()) {
    if (now - timestamp > NOTIFICATION_TTL) {
      RECENT_NOTIFICATIONS.delete(key);
    }
  }
}, 10000);

// Hook to manage coin notifications
export function useCoinNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    amount: number;
    description: string;
    show: boolean;
    timestamp: number;
  }>>([]);

  const showNotification = useCallback((amount: number, description: string) => {
    const notificationKey = `${amount}-${description}`;
    const now = Date.now();
    
    // Skip if same notification was shown recently
    const lastShown = RECENT_NOTIFICATIONS.get(notificationKey) || 0;
    if (now - lastShown < NOTIFICATION_TTL) {
      return;
    }
    
    // Update last shown time
    RECENT_NOTIFICATIONS.set(notificationKey, now);
    
    const id = now.toString();
    setNotifications(prev => [
      ...prev, 
      { 
        id, 
        amount, 
        description, 
        show: true, // Ensure this is set to true for new notifications
        timestamp: now 
      }
    ]);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, show: false } : notif
      )
    );
    
    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  }, []);

  // Clean up notifications that are too old
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(notif => now - notif.timestamp < 10000) // Keep for max 10 seconds
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    showNotification,
    hideNotification,
  };
}