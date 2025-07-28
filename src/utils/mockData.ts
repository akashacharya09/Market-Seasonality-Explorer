import { MarketData } from '@/components/MarketCalendar';

// Generate realistic mock market data for demonstration
export const generateMockMarketData = (days: number = 30): MarketData[] => {
  const data: MarketData[] = [];
  const basePrice = 45000; // Starting price for BTC-USD
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Weekend typically has lower volume and different volatility
    const volumeMultiplier = isWeekend ? 0.6 : 1.0;
    const volatilityMultiplier = isWeekend ? 0.8 : 1.0;
    
    // Generate correlated OHLC data
    const previousClose = i === days - 1 ? basePrice : data[data.length - 1]?.close || basePrice;
    const dailyReturn = (Math.random() - 0.5) * 0.08; // ±4% daily movement
    const volatility = (0.01 + Math.random() * 0.08) * volatilityMultiplier; // 1-9% volatility
    
    const open = previousClose * (1 + (Math.random() - 0.5) * 0.01); // Small gap
    const close = open * (1 + dailyReturn);
    
    // High and low based on intraday volatility
    const intradayRange = Math.abs(close - open) + (volatility * open * Math.random() * 2);
    const high = Math.max(open, close) + (intradayRange * Math.random());
    const low = Math.min(open, close) - (intradayRange * Math.random());
    
    // Volume correlated with volatility and day of week
    const baseVolume = 50000000; // 50M base volume
    const volume = baseVolume * (0.5 + Math.random()) * volumeMultiplier * (1 + volatility * 5);
    
    // Liquidity score (0-100) inversely related to volatility
    const liquidity = Math.max(20, 100 - (volatility * 1000) + (Math.random() - 0.5) * 20);
    
    // Performance as the daily return
    const performance = (close - open) / open;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 10000,
      liquidity: Math.round(liquidity * 10) / 10,
      performance: Math.round(performance * 10000) / 10000,
    });
  }
  
  return data;
};

// Generate data for different instruments
export const getMarketDataForInstrument = (instrument: string): MarketData[] => {
  const basePrices: Record<string, number> = {
    'BTC-USD': 45000,
    'ETH-USD': 2800,
    'SPY': 450,
    'QQQ': 380,
    'AAPL': 175,
    'TSLA': 240,
  };
  
  const basePrice = basePrices[instrument] || 100;
  const data: MarketData[] = [];
  const today = new Date();
  
  // Different volatility characteristics for different instruments
  const volatilityMultipliers: Record<string, number> = {
    'BTC-USD': 2.0,
    'ETH-USD': 2.2,
    'SPY': 0.8,
    'QQQ': 1.0,
    'AAPL': 1.2,
    'TSLA': 1.8,
  };
  
  const volMultiplier = volatilityMultipliers[instrument] || 1.0;
  
  // Generate data for 6 months (180 days) instead of just 30 days
  for (let i = 179; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Market-specific adjustments
    const volumeMultiplier = isWeekend ? 0.3 : 1.0;
    const cryptoWeekendMultiplier = instrument.includes('USD') ? 0.8 : 0.3; // Crypto trades 24/7
    const finalVolumeMultiplier = isWeekend ? cryptoWeekendMultiplier : volumeMultiplier;
    
    const previousClose = i === 179 ? basePrice : data[data.length - 1]?.close || basePrice;
    const dailyReturn = (Math.random() - 0.5) * 0.06 * volMultiplier;
    const volatility = (0.005 + Math.random() * 0.04) * volMultiplier;
    
    const open = previousClose * (1 + (Math.random() - 0.5) * 0.005);
    const close = open * (1 + dailyReturn);
    
    const intradayRange = Math.abs(close - open) + (volatility * open * Math.random() * 2);
    const high = Math.max(open, close) + (intradayRange * Math.random());
    const low = Math.min(open, close) - (intradayRange * Math.random());
    
    const baseVolume = instrument.includes('USD') ? 100000000 : 20000000;
    const volume = baseVolume * (0.5 + Math.random()) * finalVolumeMultiplier * (1 + volatility * 3);
    
    const liquidity = Math.max(30, 100 - (volatility * 800) + (Math.random() - 0.5) * 15);
    const performance = (close - open) / open;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 10000,
      liquidity: Math.round(liquidity * 10) / 10,
      performance: Math.round(performance * 10000) / 10000,
    });
  }
  
  return data;
};