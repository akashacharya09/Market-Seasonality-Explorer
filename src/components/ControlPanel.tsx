import React, { useState } from 'react';
import { Calendar, BarChart3, Filter, Download, Settings, Search, Keyboard, Palette, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ViewMode, MarketData } from './MarketCalendar';
import { cryptoCurrencies, getCategorizedCurrencies, searchCurrencies } from '@/utils/cryptoData';
import { exportToCSV, exportToJSON, exportToPDF, exportSummaryStats } from '@/utils/exportUtils';
import { useTheme } from '@/hooks/useTheme';

interface ControlPanelProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedInstrument: string;
  onInstrumentChange: (instrument: string) => void;
  showVolatility: boolean;
  onShowVolatilityChange: (show: boolean) => void;
  showLiquidity: boolean;
  onShowLiquidityChange: (show: boolean) => void;
  showPerformance: boolean;
  onShowPerformanceChange: (show: boolean) => void;
  marketData: MarketData[];
  selectedDate: Date | null;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}


export const ControlPanel: React.FC<ControlPanelProps> = ({
  viewMode,
  onViewModeChange,
  selectedInstrument,
  onInstrumentChange,
  showVolatility,
  onShowVolatilityChange,
  showLiquidity,
  onShowLiquidityChange,
  showPerformance,
  onShowPerformanceChange,
  marketData,
  selectedDate,
  timeRange,
  onTimeRangeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const { currentTheme, availableThemes, applyTheme } = useTheme();
  
  const categorizedCurrencies = getCategorizedCurrencies();
  const filteredCurrencies = searchTerm 
    ? searchCurrencies(searchTerm)
    : cryptoCurrencies;

  const handleExportCSV = () => {
    exportToCSV(marketData, `${selectedInstrument}-${timeRange}`);
  };

  const handleExportJSON = () => {
    exportToJSON(marketData, `${selectedInstrument}-${timeRange}`);
  };

  const handleExportPDF = () => {
    exportToPDF(marketData, selectedInstrument, timeRange);
  };

  const handleExportSummary = () => {
    exportSummaryStats(marketData, `${selectedInstrument}-summary-${timeRange}`);
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-5 h-5 text-primary animate-bounce-subtle" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Controls</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative">
        {/* View Mode Selection */}
        <div className="space-y-3 animate-fade-in">
          <Label className="text-sm font-medium text-foreground/90">View Mode</Label>
          <div className="flex space-x-2 p-1 bg-muted/30 rounded-lg">
            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode, index) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className={`capitalize flex-1 transition-all duration-300 ${
                  viewMode === mode 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'hover:bg-muted/50 hover:scale-102'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Instrument Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Financial Instrument</Label>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={selectedInstrument} onValueChange={onInstrumentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {searchTerm ? (
                filteredCurrencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{currency.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {currency.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              ) : (
                Object.entries(categorizedCurrencies).map(([category, currencies]) => (
                  <div key={category}>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">
                      {category}
                    </div>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Data Layer Toggles with Visual Feedback */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Data Layer Filters</span>
          </Label>
          
          <div className="space-y-4">
            {/* Volatility Toggle with Enhanced Visual */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  showVolatility 
                    ? 'bg-volatility-medium shadow-lg shadow-volatility-medium/50 animate-pulse' 
                    : 'bg-muted-foreground/30'
                }`} />
                <div>
                  <Label htmlFor="volatility-toggle" className="text-sm font-medium cursor-pointer">
                    Volatility Heatmap
                  </Label>
                  <p className="text-xs text-muted-foreground">Color-coded risk indicators</p>
                </div>
              </div>
              <Switch
                id="volatility-toggle"
                checked={showVolatility}
                onCheckedChange={onShowVolatilityChange}
                className="data-[state=checked]:bg-volatility-medium"
              />
            </div>

            {/* Liquidity Toggle with Enhanced Visual */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className={`transition-all duration-300 ${
                  showLiquidity 
                    ? 'text-primary drop-shadow-sm' 
                    : 'text-muted-foreground/30'
                }`}>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <Label htmlFor="liquidity-toggle" className="text-sm font-medium cursor-pointer">
                    Liquidity Indicators
                  </Label>
                  <p className="text-xs text-muted-foreground">Volume & market depth</p>
                </div>
              </div>
              <Switch
                id="liquidity-toggle"
                checked={showLiquidity}
                onCheckedChange={onShowLiquidityChange}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Performance Toggle with Enhanced Visual */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  showPerformance 
                    ? 'bg-bull shadow-lg shadow-bull/50 animate-pulse' 
                    : 'bg-muted-foreground/30'
                }`} />
                <div>
                  <Label htmlFor="performance-toggle" className="text-sm font-medium cursor-pointer">
                    Performance Metrics
                  </Label>
                  <p className="text-xs text-muted-foreground">Price change indicators</p>
                </div>
              </div>
              <Switch
                id="performance-toggle"
                checked={showPerformance}
                onCheckedChange={onShowPerformanceChange}
                className="data-[state=checked]:bg-bull"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="flex flex-wrap gap-2 mt-3">
            {showVolatility && (
              <Badge variant="secondary" className="text-xs bg-volatility-medium/20 text-volatility-medium border-volatility-medium/30">
                Volatility
              </Badge>
            )}
            {showLiquidity && (
              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                Liquidity
              </Badge>
            )}
            {showPerformance && (
              <Badge variant="secondary" className="text-xs bg-bull/20 text-bull border-bull/30">
                Performance
              </Badge>
            )}
            {!showVolatility && !showLiquidity && !showPerformance && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                No filters active
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Stats</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-xs text-muted-foreground">Current Month</span>
              <Badge variant="outline" className="text-xs">
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-xs text-muted-foreground">Data Points</span>
              <Badge variant="outline" className="text-xs">
                30 days
              </Badge>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Export Data</Label>
          <div className="grid grid-cols-2 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="w-3 h-3 mr-1" />
                    CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export raw data as CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportJSON}>
                    <Download className="w-3 h-3 mr-1" />
                    JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export data as JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export comprehensive report</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportSummary}>
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Stats
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export summary statistics</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Time Range</Label>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">Last Week</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Color Theme</span>
          </Label>
          <Select value={currentTheme} onValueChange={applyTheme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableThemes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div>
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">{theme.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="w-full justify-start"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Keyboard Shortcuts
          </Button>
          
          {showKeyboardShortcuts && (
            <div className="space-y-2 text-xs bg-muted/50 p-3 rounded-lg">
              <div className="font-medium text-muted-foreground">Navigation</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>← → ↑ ↓</span>
                  <span className="text-muted-foreground">Navigate</span>
                </div>
                <div className="flex justify-between">
                  <span>Home</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex justify-between">
                  <span>Page ↑↓</span>
                  <span className="text-muted-foreground">Month</span>
                </div>
              </div>
              
              <div className="font-medium text-muted-foreground pt-2">View Modes</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Ctrl+D</span>
                  <span className="text-muted-foreground">Daily</span>
                </div>
                <div className="flex justify-between">
                  <span>Ctrl+W</span>
                  <span className="text-muted-foreground">Weekly</span>
                </div>
                <div className="flex justify-between">
                  <span>Ctrl+M</span>
                  <span className="text-muted-foreground">Monthly</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
};