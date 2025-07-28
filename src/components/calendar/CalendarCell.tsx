import React from 'react';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MarketData } from '../MarketCalendar';

interface CalendarCellProps {
  date: Date;
  data: MarketData | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  viewMode: 'daily' | 'weekly' | 'monthly';
  showVolatility: boolean;
  showLiquidity: boolean;
  showPerformance: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  data,
  isCurrentMonth,
  isToday,
  isSelected,
  isWeekend,
  viewMode,
  showVolatility,
  showLiquidity,
  showPerformance,
  onClick,
  onDoubleClick
}) => {
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

  const volatilityLevel = data ? getVolatilityLevel(data.volatility) : null;
  const cellHeight = viewMode === 'daily' ? 'h-20' : viewMode === 'weekly' ? 'h-16' : 'h-12';

  // Get volatility background color
  const getVolatilityBackground = () => {
    if (!data || !showVolatility) return '';
    
    switch (volatilityLevel) {
      case 'low':
        return 'from-volatility-low/30 via-volatility-low/15 to-volatility-low/5';
      case 'medium':
        return 'from-volatility-medium/30 via-volatility-medium/15 to-volatility-medium/5';
      case 'high':
        return 'from-volatility-high/30 via-volatility-high/15 to-volatility-high/5';
      default:
        return '';
    }
  };

  // Get volatility border color
  const getVolatilityBorder = () => {
    if (!data || !showVolatility) return 'border-border/50';
    
    switch (volatilityLevel) {
      case 'low':
        return 'border-volatility-low/40';
      case 'medium':
        return 'border-volatility-medium/40';
      case 'high':
        return 'border-volatility-high/40';
      default:
        return 'border-border/50';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              group relative ${cellHeight} border cursor-pointer transition-all duration-300 ease-out
              ${getVolatilityBorder()}
              ${isCurrentMonth ? 'bg-card/50 hover:bg-card/80 backdrop-blur-sm' : 'bg-muted/20 opacity-60'}
              ${isSelected ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-background scale-105 shadow-xl z-20' : ''}
              ${isToday ? 'ring-1 ring-accent/50 ring-offset-1 ring-offset-background animate-glow-pulse' : ''}
              ${isWeekend ? 'bg-muted/30' : ''}
              ${data && showVolatility ? `bg-gradient-to-br ${getVolatilityBackground()}` : ''}
              hover:scale-105 hover:shadow-lg hover:z-10 hover:-translate-y-1
              rounded-lg overflow-hidden
              ${isSelected ? 'shadow-2xl shadow-primary/20' : 'shadow-sm'}
            `}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
          >
            {/* Date number */}
            <div className="absolute top-1 left-1 text-xs font-medium">
              {viewMode === 'monthly' 
                ? date.toLocaleDateString('en-US', { month: 'short' })
                : date.getDate()
              }
            </div>

            {/* Today indicator */}
            {isToday && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-accent rounded-full pulse"></div>
              </div>
            )}

            {/* Weekend indicator */}
            {isWeekend && viewMode === 'daily' && (
              <div className="absolute top-1 right-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              </div>
            )}

            {/* Market data indicators */}
            {data && (
              <div className="absolute inset-2 flex flex-col justify-between">
                {/* Performance indicator with enhanced styling */}
                {showPerformance && (
                  <div className="flex justify-end animate-fade-in">
                    <div className={`
                      p-1 backdrop-blur-sm rounded-full border shadow-sm transition-all duration-300
                      ${data.performance > 0 ? 'bg-bull/10 border-bull/30 shadow-bull/20' :
                        data.performance < 0 ? 'bg-bear/10 border-bear/30 shadow-bear/20' :
                        'bg-neutral/10 border-neutral/30 shadow-neutral/20'}
                    `}>
                      {data.performance > 0 ? (
                        <TrendingUp className="w-3 h-3 text-bull drop-shadow-sm" />
                      ) : data.performance < 0 ? (
                        <TrendingDown className="w-3 h-3 text-bear drop-shadow-sm" />
                      ) : (
                        <Activity className="w-3 h-3 text-neutral drop-shadow-sm" />
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Volume bar for daily view */}
                {showLiquidity && viewMode === 'daily' && (
                  <div className="flex-1 flex items-end animate-fade-in">
                    <div className="relative w-full h-full flex items-end">
                      {/* Volume bars with gradient effect */}
                      <div className="relative w-full flex items-end justify-center space-x-0.5">
                        {[...Array(5)].map((_, i) => {
                          const barHeight = Math.min((data.volume / 1000000) * (i + 1) * 8, 80);
                          return (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-primary/80 via-primary/60 to-primary/40 rounded-sm transition-all duration-500 ease-out shadow-sm"
                              style={{ height: `${barHeight}%` }}
                            />
                          );
                        })}
                      </div>
                      {/* Overlay pattern for high liquidity */}
                      {data.liquidity > 80 && (
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-sm" />
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Liquidity indicators for weekly/monthly views */}
                {showLiquidity && viewMode !== 'daily' && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex flex-col space-y-1">
                      {/* Pattern based on liquidity level */}
                      {data.liquidity > 80 ? (
                        // High liquidity: Striped pattern
                        <div className="flex space-x-0.5">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-0.5 h-3 bg-primary/70 rounded-full" />
                          ))}
                        </div>
                      ) : data.liquidity > 50 ? (
                        // Medium liquidity: Dots pattern
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-primary/60 rounded-full" />
                          ))}
                        </div>
                      ) : (
                        // Low liquidity: Single gradient bar
                        <div className="w-2 h-2 bg-gradient-to-r from-primary/40 to-primary/60 rounded-sm" />
                      )}
                    </div>
                  </div>
                )}

                {/* Volatility indicator */}
                {showVolatility && (
                  <div className="flex justify-center animate-fade-in">
                    <div className={`
                      w-2 h-2 rounded-full transition-all duration-300 animate-pulse
                      ${volatilityLevel === 'low' ? 'bg-volatility-low shadow-lg shadow-volatility-low/50' :
                        volatilityLevel === 'medium' ? 'bg-volatility-medium shadow-lg shadow-volatility-medium/50' :
                        'bg-volatility-high shadow-lg shadow-volatility-high/50'}
                    `} />
                  </div>
                )}

                {/* Additional indicators for weekly/monthly views */}
                {viewMode !== 'daily' && data && (
                  <div className="absolute bottom-1 right-1 flex space-x-1">
                    {showVolatility && (
                      <div className="animate-fade-in">
                        <Zap className={`w-3 h-3 drop-shadow-sm ${
                          volatilityLevel === 'low' ? 'text-volatility-low' :
                          volatilityLevel === 'medium' ? 'text-volatility-medium' :
                          'text-volatility-high'
                        }`} />
                      </div>
                    )}
                    {showPerformance && (
                      <div className="animate-fade-in">
                        {data.performance > 0.01 ? (
                          <TrendingUp className="w-3 h-3 text-bull drop-shadow-sm" />
                        ) : data.performance < -0.01 ? (
                          <TrendingDown className="w-3 h-3 text-bear drop-shadow-sm" />
                        ) : (
                          <Activity className="w-3 h-3 text-neutral drop-shadow-sm" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Selection highlight */}
            {isSelected && (
              <div className="absolute inset-0 bg-primary/10 rounded border-2 border-primary pointer-events-none" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-sm">
            <div className="font-medium">
              {viewMode === 'monthly' 
                ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : date.toLocaleDateString()
              }
            </div>
            {data ? (
              <div className="mt-2 space-y-1">
                <div>Performance: <span className={data.performance >= 0 ? 'text-bull' : 'text-bear'}>
                  {data.performance >= 0 ? '+' : ''}{(data.performance * 100).toFixed(2)}%
                </span></div>
                <div>Volume: {(data.volume / 1000000).toFixed(1)}M</div>
                <div>Volatility: {(data.volatility * 100).toFixed(2)}%</div>
                <div>Price: ${data.close.toFixed(2)}</div>
                <div>Range: ${data.low.toFixed(2)} - ${data.high.toFixed(2)}</div>
                <div>Liquidity: {data.liquidity.toFixed(1)}/100</div>
              </div>
            ) : (
              <div className="text-muted-foreground mt-1">No data available</div>
            )}
            {isToday && (
              <div className="mt-1 text-xs text-accent font-medium">Today</div>
            )}
            {isWeekend && (
              <div className="mt-1 text-xs text-muted-foreground">Weekend</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};