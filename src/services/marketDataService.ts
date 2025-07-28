/**
 * Market Data Service - API Integration Layer
 * Handles all market data API calls and data transformation
 */

import { MarketData } from '@/components/MarketCalendar';

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface MarketDataFilters {
  instrument: string;
  startDate: string;
  endDate: string;
  timeframe?: '1d' | '1w' | '1m';
  includeVolatility?: boolean;
  includeLiquidity?: boolean;
  includePerformance?: boolean;
}

export class MarketDataService {
  private config: ApiConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Fetch market data for a specific instrument and date range
   */
  async fetchMarketData(filters: MarketDataFilters): Promise<ApiResponse<MarketData[]>> {
    try {
      const cacheKey = this.generateCacheKey(filters);
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return { data: cached, success: true };
      }

      const response = await this.makeApiCall('/market-data', {
        method: 'POST',
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const transformedData = this.transformApiData(result.data);
      
      this.setCachedData(cacheKey, transformedData);
      
      return {
        data: transformedData,
        success: true,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.error('Market data fetch error:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Fetch available instruments
   */
  async fetchInstruments(): Promise<ApiResponse<Array<{ symbol: string; name: string; category: string }>>> {
    try {
      const response = await this.makeApiCall('/instruments');
      const data = await response.json();
      
      return {
        data: data.instruments || [],
        success: true
      };
    } catch (error) {
      console.error('Instruments fetch error:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch instruments'
      };
    }
  }

  /**
   * Transform API data to internal format
   */
  private transformApiData(apiData: any[]): MarketData[] {
    return apiData.map(item => ({
      date: item.timestamp || item.date,
      open: parseFloat(item.open || item.o || 0),
      close: parseFloat(item.close || item.c || 0),
      high: parseFloat(item.high || item.h || 0),
      low: parseFloat(item.low || item.l || 0),
      volume: parseFloat(item.volume || item.v || 0),
      volatility: parseFloat(item.volatility || this.calculateVolatility(item) || 0),
      liquidity: parseFloat(item.liquidity || this.calculateLiquidity(item) || 0),
      performance: parseFloat(item.performance || this.calculatePerformance(item) || 0)
    }));
  }

  /**
   * Calculate volatility if not provided by API
   */
  private calculateVolatility(data: any): number {
    const high = parseFloat(data.high || data.h || 0);
    const low = parseFloat(data.low || data.l || 0);
    const close = parseFloat(data.close || data.c || 0);
    
    if (close === 0) return 0;
    return ((high - low) / close) * 100;
  }

  /**
   * Calculate liquidity if not provided by API
   */
  private calculateLiquidity(data: any): number {
    const volume = parseFloat(data.volume || data.v || 0);
    const price = parseFloat(data.close || data.c || 0);
    
    if (price === 0) return 0;
    return Math.min((volume * price) / 1000000, 100); // Normalize to 0-100
  }

  /**
   * Calculate performance if not provided by API
   */
  private calculatePerformance(data: any): number {
    const open = parseFloat(data.open || data.o || 0);
    const close = parseFloat(data.close || data.c || 0);
    
    if (open === 0) return 0;
    return ((close - open) / open) * 100;
  }

  /**
   * Make authenticated API call
   */
  private async makeApiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Cache management
   */
  private generateCacheKey(filters: MarketDataFilters): string {
    return JSON.stringify(filters);
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance for use across the app
export const marketDataService = new MarketDataService({
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.example.com',
  apiKey: import.meta.env.VITE_API_KEY,
  timeout: 10000, // 10 seconds
});