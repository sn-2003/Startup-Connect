import React, { createContext, useContext, ReactNode } from 'react';
import { CoinNotification, useCoinNotifications } from '../ui/coin-notification';

interface CoinNotificationContextType {
  showNotification: (amount: number, description: string) => void;
}

const CoinNotificationContext = createContext<CoinNotificationContextType | undefined>(undefined);

export function CoinNotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, showNotification, hideNotification } = useCoinNotifications();
  
  // Wrap showNotification to match the expected signature
  const contextValue = {
    showNotification: (amount: number, description: string) => {
      showNotification(amount, description);
    }
  };

  return (
    <CoinNotificationContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <CoinNotification
            key={notification.id}
            amount={notification.amount}
            description={notification.description}
            show={notification.show}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </CoinNotificationContext.Provider>
  );
}

export function useCoinNotificationContext() {
  const context = useContext(CoinNotificationContext);
  if (context === undefined) {
    throw new Error('useCoinNotificationContext must be used within a CoinNotificationProvider');
  }
  return context;
}