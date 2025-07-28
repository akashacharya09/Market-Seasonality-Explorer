import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewMode } from '../MarketCalendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarControlsProps {
  currentDate: Date;
  viewMode: ViewMode;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  selectedDateRange: { start: Date | null; end: Date | null };
  onDateRangeClear: () => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onFullscreen?: () => void;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  currentDate,
  viewMode,
  onNavigate,
  onToday,
  onViewModeChange,
  selectedDateRange,
  onDateRangeClear,
  zoomLevel,
  onZoomChange,
  onFullscreen
}) => {
  const formatDisplayDate = () => {
    switch (viewMode) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'weekly':
        return `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return currentDate.getFullYear().toString();
      default:
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getNavigationLabel = (direction: 'prev' | 'next') => {
    const action = direction === 'prev' ? 'Previous' : 'Next';
    switch (viewMode) {
      case 'daily':
        return `${action} month`;
      case 'weekly':
        return `${action} month`;
      case 'monthly':
        return `${action} year`;
      default:
        return `${action} period`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {formatDisplayDate()}
          </h2>
        </div>
        
        <div className="flex space-x-1">
          <Badge variant="secondary" className="capitalize">
            {viewMode} view
          </Badge>
          
          {selectedDateRange.start && selectedDateRange.end && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <span>Range Selected</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={onDateRangeClear}
              >
                ×
              </Button>
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* View Mode Buttons */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
            <TooltipProvider key={mode}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === mode ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange(mode)}
                    className="capitalize text-xs h-7"
                  >
                    {mode.charAt(0)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium capitalize">{mode} View</div>
                    <div className="text-xs text-muted-foreground">
                      Ctrl+{mode.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onZoomChange(Math.max(0.5, zoomLevel - 0.1))}
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onZoomChange(Math.min(2, zoomLevel + 0.1))}
                  disabled={zoomLevel >= 2}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Navigation Controls */}
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{getNavigationLabel('prev')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToday}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <div>Go to Today</div>
                  <div className="text-xs text-muted-foreground">Ctrl+T</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{getNavigationLabel('next')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Fullscreen Toggle */}
        {onFullscreen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFullscreen}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};