import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MarketData } from './MarketCalendar';

interface DataPanelProps {
  selectedDate: Date | null;
  marketData: MarketData[];
}

export const DataPanel: React.FC<DataPanelProps> = ({ selectedDate, marketData }) => {
  if (!selectedDate) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Market Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a date to view detailed market data
          </div>
        </CardContent>
      </Card>
    );
  }

  const dateStr = selectedDate.toISOString().split('T')[0];
  const data = marketData.find(d => d.date === dateStr);

  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Market Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No market data available for {selectedDate.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getVolatilityLevel = (volatility: number): { level: string; color: string } => {
    if (volatility < 0.02) return { level: 'Low', color: 'text-volatility-low' };
    if (volatility < 0.05) return { level: 'Medium', color: 'text-volatility-medium' };
    return { level: 'High', color: 'text-volatility-high' };
  };

  const volatilityInfo = getVolatilityLevel(data.volatility);
  const isPositivePerformance = data.performance >= 0;
  const priceChange = data.close - data.open;
  const priceChangePercent = ((data.close - data.open) / data.open) * 100;

  return (
    <Card className="h-full relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-scale">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary animate-bounce-subtle" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Market Analysis</span>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary animate-glow-pulse">
            {selectedDate.toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative">
        {/* Price Information */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Price Action</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-lg font-mono">${data.open.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Close</div>
              <div className="text-lg font-mono">${data.close.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">High</div>
              <div className="text-lg font-mono text-bull">${data.high.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="text-lg font-mono text-bear">${data.low.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3">
              {isPositivePerformance ? (
                <div className="p-2 bg-bull/10 rounded-full">
                  <TrendingUp className="w-4 h-4 text-bull animate-bounce-subtle" />
                </div>
              ) : (
                <div className="p-2 bg-bear/10 rounded-full">
                  <TrendingDown className="w-4 h-4 text-bear animate-bounce-subtle" />
                </div>
              )}
              <span className="text-sm font-medium">Price Change</span>
            </div>
            <div className="text-right">
              <div className={`font-mono text-lg font-bold ${isPositivePerformance ? 'text-bull' : 'text-bear'}`}>
                {isPositivePerformance ? '+' : ''}${priceChange.toFixed(2)}
              </div>
              <div className={`text-sm ${isPositivePerformance ? 'text-bull' : 'text-bear'}`}>
                {isPositivePerformance ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Performance
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Return</span>
              <div className={`flex items-center space-x-1 ${isPositivePerformance ? 'text-bull' : 'text-bear'}`}>
                {isPositivePerformance ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-mono">
                  {isPositivePerformance ? '+' : ''}{(data.performance * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <Progress 
              value={Math.abs(data.performance * 100)} 
              className="h-2"
            />
          </div>
        </div>

        <Separator />

        {/* Volatility Analysis */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Volatility Analysis
          </h3>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Volatility Level</span>
            </div>
            <div className="text-right">
              <Badge className={volatilityInfo.color}>
                {volatilityInfo.level}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                {(data.volatility * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          <Progress 
            value={(data.volatility / 0.1) * 100} 
            className="h-2"
          />
        </div>

        <Separator />

        {/* Volume & Liquidity */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Volume & Liquidity
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Trading Volume</span>
              </div>
              <div className="text-right">
                <div className="font-mono">{(data.volume / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">USD</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Liquidity Score</span>
              </div>
              <div className="text-right">
                <div className="font-mono">{data.liquidity.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>

          <Progress 
            value={data.liquidity} 
            className="h-2"
          />
        </div>

        {/* Technical Indicators */}
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Technical Indicators
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Range</div>
              <div className="font-mono">${(data.high - data.low).toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Mid Price</div>
              <div className="font-mono">${((data.high + data.low) / 2).toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Body Size</div>
              <div className="font-mono">${Math.abs(data.close - data.open).toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Wick Ratio</div>
              <div className="font-mono">
                {(((data.high - data.low) - Math.abs(data.close - data.open)) / (data.high - data.low) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};