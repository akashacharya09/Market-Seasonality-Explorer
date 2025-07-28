import React, { useState, useCallback, useMemo } from 'react';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { MarketCalendar, ViewMode } from '@/components/MarketCalendar';
import { DataPanel } from '@/components/DataPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner, CalendarSkeleton, DataPanelSkeleton } from '@/components/LoadingSpinner';
import { useMarketData } from '@/hooks/useMarketData';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { MarketDataFilters } from '@/services/marketDataService';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState('BTC-USD');
  const [showVolatility, setShowVolatility] = useState(true);
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showPerformance, setShowPerformance] = useState(true);
  const [timeRange, setTimeRange] = useState('1m');

  // Market data filters
  const marketDataFilters = useMemo<MarketDataFilters>(() => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1w':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default: // '1m'
        startDate.setMonth(endDate.getMonth() - 1);
    }

    return {
      instrument: selectedInstrument,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeframe: viewMode === 'daily' ? '1d' : viewMode === 'weekly' ? '1w' : '1m',
      includeVolatility: showVolatility,
      includeLiquidity: showLiquidity,
      includePerformance: showPerformance
    };
  }, [selectedInstrument, timeRange, viewMode, showVolatility, showLiquidity, showPerformance]);

  // Use custom hook for market data management
  const {
    data: marketData,
    loading,
    error,
    isStale,
    fetchData,
    refreshData,
    clearError
  } = useMarketData(marketDataFilters, {
    enablePolling: true,
    pollingInterval: 30000, // 30 seconds
    fallbackToMock: true
  });

  // Initialize keyboard navigation
  useKeyboardNavigation({
    selectedDate,
    currentDate: new Date(),
    onDateSelect: setSelectedDate,
    onMonthChange: () => {},
    onViewModeChange: setViewMode,
    viewMode,
    isEnabled: !loading
  });

  // Optimized change handlers
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleInstrumentChange = useCallback((instrument: string) => {
    setSelectedInstrument(instrument);
  }, []);

  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
  }, []);

  // Error handler for error boundary
  const handleError = useCallback((error: Error) => {
    console.error('Application error:', error);
    // In production, send to error reporting service
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-60 right-20 w-1 h-1 bg-volatility-medium/20 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Header */}
        <div className="relative border-b border-border/50 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/30 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
          <div className="container mx-auto px-6 py-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl backdrop-blur-sm border border-primary/20 animate-glow-pulse">
                  <TrendingUp className="w-7 h-7 text-primary animate-bounce-subtle" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl"></div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-fade-in-scale">
                    Market Seasonality Explorer
                  </h1>
                  <p className="text-sm text-muted-foreground/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Interactive financial data visualization and analysis platform
                  </p>
                </div>
              </div>
              
              {/* Data Status Indicator */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-muted/30 rounded-full backdrop-blur-sm border border-border/50 animate-slide-in-right">
                <Calendar className="w-4 h-4 text-primary animate-bounce-subtle" />
                <span className="text-sm text-muted-foreground font-medium">
                  {isStale ? 'Sample Data' : 'Live Market Data'}
                </span>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  loading ? 'bg-volatility-medium' : 
                  error ? 'bg-bear' : 
                  isStale ? 'bg-neutral' : 'bg-bull'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 relative">
          <div className="grid grid-cols-12 gap-8">
            {/* Control Panel */}
            <div className="col-span-12 lg:col-span-3 animate-slide-in-left">
              <div className="sticky top-8">
                <ErrorBoundary>
                  <ControlPanel
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                    selectedInstrument={selectedInstrument}
                    onInstrumentChange={handleInstrumentChange}
                    showVolatility={showVolatility}
                    onShowVolatilityChange={setShowVolatility}
                    showLiquidity={showLiquidity}
                    onShowLiquidityChange={setShowLiquidity}
                    showPerformance={showPerformance}
                    onShowPerformanceChange={setShowPerformance}
                    marketData={marketData}
                    selectedDate={selectedDate}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                  />
                </ErrorBoundary>
              </div>
            </div>

            {/* Calendar */}
            <div className="col-span-12 lg:col-span-6 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
              <ErrorBoundary fallback={<CalendarSkeleton />}>
                {loading ? (
                  <CalendarSkeleton />
                ) : (
                  <MarketCalendar
                    viewMode={viewMode}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    marketData={marketData}
                    showVolatility={showVolatility}
                    showLiquidity={showLiquidity}
                    showPerformance={showPerformance}
                    onViewModeChange={handleViewModeChange}
                  />
                )}
              </ErrorBoundary>
            </div>

            {/* Data Panel */}
            <div className="col-span-12 lg:col-span-3 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="sticky top-8">
                <ErrorBoundary fallback={<DataPanelSkeleton />}>
                  {loading ? (
                    <DataPanelSkeleton />
                  ) : (
                    <DataPanel
                      selectedDate={selectedDate}
                      marketData={marketData}
                    />
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-border/50 bg-gradient-to-r from-card/20 via-card/30 to-card/20 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-1 bg-muted/20 rounded-full">
                  <BarChart3 className="w-4 h-4 text-primary animate-bounce-subtle" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {isStale ? 'Live Data Simulation' : 'Real-time Data'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    loading ? 'bg-volatility-medium' : 
                    error ? 'bg-bear' : 'bg-bull'
                  }`}></div>
                  <span>Market Status: {loading ? 'Loading' : error ? 'Error' : 'Active'}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                © 2024 Market Seasonality Explorer
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;