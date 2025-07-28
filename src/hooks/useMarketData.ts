/**
 * Custom hook for market data management
 * Provides state management, caching, and API integration
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { marketDataService, MarketDataFilters, ApiResponse } from '@/services/marketDataService';
import { MarketData } from '@/components/MarketCalendar';
import { getMarketDataForInstrument } from '@/utils/mockData'; // Fallback for development

export interface UseMarketDataOptions {
  enablePolling?: boolean;
  pollingInterval?: number;
  enableCache?: boolean;
  fallbackToMock?: boolean;
}

export interface MarketDataState {
  data: MarketData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isStale: boolean;
}

export interface MarketDataActions {
  fetchData: (filters: MarketDataFilters) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  clearCache: () => void;
}

export function useMarketData(
  initialFilters: MarketDataFilters,
  options: UseMarketDataOptions = {}
): MarketDataState & MarketDataActions {
  const {
    enablePolling = false,
    pollingInterval = 60000, // 1 minute
    enableCache = true,
    fallbackToMock = true
  } = options;

  const [state, setState] = useState<MarketDataState>({
    data: [],
    loading: false,
    error: null,
    lastUpdated: null,
    isStale: false
  });

  const [currentFilters, setCurrentFilters] = useState<MarketDataFilters>(initialFilters);

  /**
   * Fetch market data with error handling and fallback
   */
  const fetchData = useCallback(async (filters: MarketDataFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setCurrentFilters(filters);

    try {
      // Try API first
      const response: ApiResponse<MarketData[]> = await marketDataService.fetchMarketData(filters);
      
      if (response.success && response.data.length > 0) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date(),
          isStale: false
        }));
      } else {
        // Fallback to mock data if enabled
        if (fallbackToMock) {
          console.warn('API failed, falling back to mock data:', response.error);
          const mockData = getMarketDataForInstrument(filters.instrument);
          setState(prev => ({
            ...prev,
            data: mockData,
            loading: false,
            error: null,
            lastUpdated: new Date(),
            isStale: true // Mark as stale since it's mock data
          }));
        } else {
          throw new Error(response.error || 'Failed to fetch data');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Try fallback to mock data
      if (fallbackToMock) {
        try {
          const mockData = getMarketDataForInstrument(filters.instrument);
          setState(prev => ({
            ...prev,
            data: mockData,
            loading: false,
            error: `API unavailable: ${errorMessage}. Showing sample data.`,
            lastUpdated: new Date(),
            isStale: true
          }));
        } catch (mockError) {
          setState(prev => ({
            ...prev,
            data: [],
            loading: false,
            error: `Both API and mock data failed: ${errorMessage}`,
            lastUpdated: null,
            isStale: false
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          data: [],
          loading: false,
          error: errorMessage,
          lastUpdated: null,
          isStale: false
        }));
      }
    }
  }, [fallbackToMock]);

  /**
   * Refresh current data
   */
  const refreshData = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    if (enableCache) {
      marketDataService.clearCache();
    }
  }, [enableCache]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData, initialFilters]);

  /**
   * Polling effect
   */
  useEffect(() => {
    if (!enablePolling || state.loading) return;

    const interval = setInterval(() => {
      refreshData();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enablePolling, pollingInterval, refreshData, state.loading]);

  /**
   * Window focus effect - refresh stale data
   */
  useEffect(() => {
    const handleFocus = () => {
      if (state.isStale || (state.lastUpdated && Date.now() - state.lastUpdated.getTime() > 5 * 60 * 1000)) {
        refreshData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshData, state.isStale, state.lastUpdated]);

  /**
   * Memoized return value for performance
   */
  return useMemo(() => ({
    ...state,
    fetchData,
    refreshData,
    clearError,
    clearCache
  }), [state, fetchData, refreshData, clearError, clearCache]);
}

/**
 * Hook for instrument data
 */
export function useInstruments() {
  const [instruments, setInstruments] = useState<Array<{ symbol: string; name: string; category: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstruments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await marketDataService.fetchInstruments();
      
      if (response.success) {
        setInstruments(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch instruments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Fallback to local instruments data
      const { cryptoCurrencies } = await import('@/utils/cryptoData');
      setInstruments(cryptoCurrencies.map(crypto => ({
        symbol: crypto.value,
        name: crypto.label,
        category: crypto.category
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstruments();
  }, [fetchInstruments]);

  return {
    instruments,
    loading,
    error,
    refetch: fetchInstruments
  };
}