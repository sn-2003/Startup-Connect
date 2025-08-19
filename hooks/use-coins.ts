import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { apiClient } from '@/lib/api-client';
import { useCoinNotificationContext } from '@/components/providers/coin-notification-provider';

export interface CoinData {
  balance: number;
  transactions?: any[];
}

export function useCoins() {
  const { user } = useAuth();
  const { showNotification } = useCoinNotificationContext();
  const [coinData, setCoinData] = useState<CoinData>({ balance: 0 });
  const [loading, setLoading] = useState(true);

  const refreshCoins = useCallback(async (showNotificationOnIncrease = true) => {
    if (!user) return;
    
    try {
      const response = await apiClient.getUserCoins();
      if (response.success && response.data) {
        setCoinData(prevData => {
          const oldBalance = prevData.balance;
          const newBalance = response.data.balance;
          
          // Only show notification if explicitly requested and balance increased
          if (showNotificationOnIncrease && newBalance > oldBalance) {
            const difference = newBalance - oldBalance;
            console.log(`Balance increased by ${difference} coins`);
            showNotification(difference, 'Coins received!');
          }
          
          return {
            balance: newBalance,
            transactions: response.data.transactions || []
          };
        });
      }
    } catch (error) {
      console.error('Error refreshing coins:', error);
    }
  }, [user, showNotification]);
  
  // Add a manual refresh function that can be called after coin awards
  const forceRefreshCoins = useCallback(() => {
    refreshCoins(true);
  }, [refreshCoins]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Initial fetch without notification
    refreshCoins(false).finally(() => setLoading(false));

    // Refresh coins every 30 seconds without notification
    const interval = setInterval(() => refreshCoins(false), 30000);
    return () => clearInterval(interval);
  }, [user, refreshCoins]);

  return {
    balance: coinData.balance,
    transactions: coinData.transactions,
    loading,
    refreshCoins,
    forceRefreshCoins,
  };
}