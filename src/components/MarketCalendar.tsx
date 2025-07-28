import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface MarketData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  volatility: number;
  liquidity: number;
  performance: number;
}

interface MarketCalendarProps {
  viewMode: ViewMode;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  marketData: MarketData[];
  showVolatility: boolean;
  showLiquidity: boolean;
  showPerformance: boolean;
  onViewModeChange: (mode: ViewMode) => void;
}

export const MarketCalendar: React.FC<MarketCalendarProps> = memo(({
  viewMode,
  selectedDate,
  onDateSelect,
  marketData,
  showVolatility,
  showLiquidity,
  showPerformance,
  onViewModeChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<{start: Date | null; end: Date | null}>({start: null, end: null});
  const [zoomLevel, setZoomLevel] = useState(1);
  const today = new Date();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMarketDataForDate = (date: Date): MarketData | null => {
    const dateStr = date.toISOString().split('T')[0];
    return marketData.find(data => data.date === dateStr) || null;
  };

  const getVolatilityLevel = (volatility: number): 'low' | 'medium' | 'high' => {
    if (volatility < 0.02) return 'low';
    if (volatility < 0.05) return 'medium';
    return 'high';
  };

  const getPerformanceIcon = (performance: number) => {
    if (performance > 0) return <TrendingUp className="w-3 h-3 text-bull" />;
    if (performance < 0) return <TrendingDown className="w-3 h-3 text-bear" />;
    return <Activity className="w-3 h-3 text-neutral" />;
  };

  const renderCalendarCell = (date: Date, isCurrentMonth: boolean) => {
    const data = getMarketDataForDate(date);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const volatilityLevel = data ? getVolatilityLevel(data.volatility) : null;

    return (
      <TooltipProvider key={date.toISOString()}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                relative h-20 border border-border cursor-pointer transition-all duration-200
                ${isCurrentMonth ? 'bg-card hover:bg-secondary' : 'bg-muted/20 opacity-50'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                ${isToday ? 'ring-1 ring-accent' : ''}
                ${data ? `bg-gradient-to-br ${
                  volatilityLevel === 'low' ? 'from-volatility-low/20 to-volatility-low/10' :
                  volatilityLevel === 'medium' ? 'from-volatility-medium/20 to-volatility-medium/10' :
                  'from-volatility-high/20 to-volatility-high/10'
                }` : ''}
                hover:scale-105 hover:shadow-lg
              `}
              onClick={() => onDateSelect(date)}
            >
              {/* Date number */}
              <div className="absolute top-1 left-1 text-xs font-medium">
                {date.getDate()}
              </div>

              {/* Today indicator */}
              {isToday && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
              )}

              {/* Market data indicators */}
              {data && (
                <div className="absolute inset-2 flex flex-col justify-between">
                  {/* Performance indicator */}
                  <div className="flex justify-end">
                    {getPerformanceIcon(data.performance)}
                  </div>

                  {/* Volume bar */}
                  <div className="flex-1 flex items-end">
                    <div 
                      className="w-full bg-primary/30 rounded-sm"
                      style={{ height: `${Math.min(data.volume / 1000000 * 20, 100)}%` }}
                    />
                  </div>

                  {/* Volatility indicator */}
                  <div className="flex justify-center">
                    <div className={`
                      w-1 h-1 rounded-full
                      ${volatilityLevel === 'low' ? 'bg-volatility-low' :
                        volatilityLevel === 'medium' ? 'bg-volatility-medium' :
                        'bg-volatility-high'}
                    `} />
                  </div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="text-sm">
              <div className="font-medium">{date.toLocaleDateString()}</div>
              {data ? (
                <div className="mt-1 space-y-1">
                  <div>Performance: <span className={data.performance >= 0 ? 'text-bull' : 'text-bear'}>
                    {data.performance >= 0 ? '+' : ''}{(data.performance * 100).toFixed(2)}%
                  </span></div>
                  <div>Volume: {(data.volume / 1000000).toFixed(1)}M</div>
                  <div>Volatility: {(data.volatility * 100).toFixed(2)}%</div>
                  <div>Price: ${data.close.toFixed(2)}</div>
                </div>
              ) : (
                <div className="text-muted-foreground">No data available</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderDailyView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const weeks = [];
    const currentWeek = new Date(startDate);

    while (currentWeek <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeek);
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        week.push(renderCalendarCell(date, isCurrentMonth));
        currentWeek.setDate(currentWeek.getDate() + 1);
      }
      weeks.push(
        <div key={currentWeek.toISOString()} className="grid grid-cols-7 gap-1">
          {week}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weeks = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Start from the beginning of the week containing the first day
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    // End at the end of the week containing the last day
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

    const currentWeek = new Date(startDate);
    let weekNumber = 1;

    while (currentWeek <= endDate) {
      const weekData = [];
      const weekStart = new Date(currentWeek);
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Aggregate weekly data
      const weekMarketData = [];
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dayData = getMarketDataForDate(d);
        if (dayData) weekMarketData.push(dayData);
      }
      
      const aggregatedData = weekMarketData.length > 0 ? {
        date: weekStart.toISOString().split('T')[0],
        open: weekMarketData[0].open,
        close: weekMarketData[weekMarketData.length - 1].close,
        high: Math.max(...weekMarketData.map(d => d.high)),
        low: Math.min(...weekMarketData.map(d => d.low)),
        volume: weekMarketData.reduce((sum, d) => sum + d.volume, 0),
        volatility: weekMarketData.reduce((sum, d) => sum + d.volatility, 0) / weekMarketData.length,
        liquidity: weekMarketData.reduce((sum, d) => sum + d.liquidity, 0) / weekMarketData.length,
        performance: (weekMarketData[weekMarketData.length - 1].close - weekMarketData[0].open) / weekMarketData[0].open
      } : null;

      weeks.push(
        <div key={`week-${weekNumber}`} className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">
            Week {weekNumber}: {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
          </div>
          <CalendarCell
            date={weekStart}
            data={aggregatedData}
            isCurrentMonth={weekStart.getMonth() === currentDate.getMonth()}
            isToday={false}
            isSelected={selectedDate && weekStart <= selectedDate && selectedDate <= weekEnd}
            isWeekend={false}
            viewMode="weekly"
            showVolatility={showVolatility}
            showLiquidity={showLiquidity}
            showPerformance={showPerformance}
            onClick={() => onDateSelect(weekStart)}
          />
        </div>
      );

      currentWeek.setDate(currentWeek.getDate() + 7);
      weekNumber++;
    }

    return <div className="space-y-2">{weeks}</div>;
  };

  const renderMonthlyView = () => {
    const months = [];
    const currentYear = currentDate.getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0);
      
      // Aggregate monthly data
      const monthMarketData = [];
      for (let d = new Date(monthDate); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dayData = getMarketDataForDate(d);
        if (dayData) monthMarketData.push(dayData);
      }
      
      const aggregatedData = monthMarketData.length > 0 ? {
        date: monthDate.toISOString().split('T')[0],
        open: monthMarketData[0].open,
        close: monthMarketData[monthMarketData.length - 1].close,
        high: Math.max(...monthMarketData.map(d => d.high)),
        low: Math.min(...monthMarketData.map(d => d.low)),
        volume: monthMarketData.reduce((sum, d) => sum + d.volume, 0),
        volatility: monthMarketData.reduce((sum, d) => sum + d.volatility, 0) / monthMarketData.length,
        liquidity: monthMarketData.reduce((sum, d) => sum + d.liquidity, 0) / monthMarketData.length,
        performance: monthMarketData.length > 0 ? (monthMarketData[monthMarketData.length - 1].close - monthMarketData[0].open) / monthMarketData[0].open : 0
      } : null;

      months.push(
        <div key={month} className="mb-4">
          <CalendarCell
            date={monthDate}
            data={aggregatedData}
            isCurrentMonth={month === currentDate.getMonth()}
            isToday={false}
            isSelected={selectedDate && selectedDate.getMonth() === month && selectedDate.getFullYear() === currentYear}
            isWeekend={false}
            viewMode="monthly"
            showVolatility={showVolatility}
            showLiquidity={showLiquidity}
            showPerformance={showPerformance}
            onClick={() => onDateSelect(monthDate)}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {months.slice(0, 12)}
        </div>
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in-scale">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
      
      {/* Header */}
      <div className="relative p-6 border-b border-border/30 bg-gradient-to-r from-card/50 to-card/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg animate-glow-pulse">
              <Calendar className="w-6 h-6 text-primary animate-bounce-subtle" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-fade-in">
                {viewMode} view
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-2 p-1 bg-muted/30 rounded-lg backdrop-blur-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-primary/10 hover:scale-105 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="hover:bg-primary/10 hover:scale-105 transition-all duration-200 px-4"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-primary/10 hover:scale-105 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-6 relative">
        {viewMode === 'daily' && renderDailyView()}
        {viewMode === 'weekly' && renderWeeklyView()}
        {viewMode === 'monthly' && renderMonthlyView()}
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="bg-muted/20 rounded-lg p-4 backdrop-blur-sm border border-border/30">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Legend</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-2 p-2 bg-volatility-low/10 rounded-lg hover:bg-volatility-low/20 transition-all duration-200">
              <div className="w-3 h-3 bg-volatility-low rounded-full animate-pulse" />
              <span>Low Volatility</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-volatility-medium/10 rounded-lg hover:bg-volatility-medium/20 transition-all duration-200">
              <div className="w-3 h-3 bg-volatility-medium rounded-full animate-pulse" />
              <span>Medium Volatility</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-volatility-high/10 rounded-lg hover:bg-volatility-high/20 transition-all duration-200">
              <div className="w-3 h-3 bg-volatility-high rounded-full animate-pulse" />
              <span>High Volatility</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-bull/10 rounded-lg hover:bg-bull/20 transition-all duration-200">
              <TrendingUp className="w-3 h-3 text-bull animate-bounce-subtle" />
              <span>Positive Performance</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-bear/10 rounded-lg hover:bg-bear/20 transition-all duration-200">
              <TrendingDown className="w-3 h-3 text-bear animate-bounce-subtle" />
              <span>Negative Performance</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-200">
              <Activity className="w-3 h-3 text-primary animate-bounce-subtle" />
              <span>Volume Indicator</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

MarketCalendar.displayName = 'MarketCalendar';