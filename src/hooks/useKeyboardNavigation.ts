import { useEffect, useCallback } from 'react';
import { ViewMode } from '@/components/MarketCalendar';

interface UseKeyboardNavigationProps {
  selectedDate: Date | null;
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
  isEnabled?: boolean;
}

export const useKeyboardNavigation = ({
  selectedDate,
  currentDate,
  onDateSelect,
  onMonthChange,
  onViewModeChange,
  viewMode,
  isEnabled = true
}: UseKeyboardNavigationProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    const today = new Date();
    let newDate = selectedDate ? new Date(selectedDate) : new Date(today);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (viewMode === 'daily') {
          newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === 'weekly') {
          newDate.setDate(newDate.getDate() - 7);
        } else if (viewMode === 'monthly') {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        onDateSelect(newDate);
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (viewMode === 'daily') {
          newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === 'weekly') {
          newDate.setDate(newDate.getDate() + 7);
        } else if (viewMode === 'monthly') {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        onDateSelect(newDate);
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (viewMode === 'daily') {
          newDate.setDate(newDate.getDate() - 7); // Previous week
        } else if (viewMode === 'weekly') {
          newDate.setDate(newDate.getDate() - 28); // Previous 4 weeks
        } else if (viewMode === 'monthly') {
          newDate.setFullYear(newDate.getFullYear() - 1); // Previous year
        }
        onDateSelect(newDate);
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (viewMode === 'daily') {
          newDate.setDate(newDate.getDate() + 7); // Next week
        } else if (viewMode === 'weekly') {
          newDate.setDate(newDate.getDate() + 28); // Next 4 weeks
        } else if (viewMode === 'monthly') {
          newDate.setFullYear(newDate.getFullYear() + 1); // Next year
        }
        onDateSelect(newDate);
        break;

      case 'Home':
        event.preventDefault();
        onDateSelect(new Date(today));
        break;

      case 'PageUp':
        event.preventDefault();
        onMonthChange('prev');
        break;

      case 'PageDown':
        event.preventDefault();
        onMonthChange('next');
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedDate) {
          // Trigger detailed view or action
          console.log('Selected date:', selectedDate);
        }
        break;

      case 'Escape':
        event.preventDefault();
        // Clear selection or close modals
        break;

      // View mode shortcuts
      case 'd':
      case 'D':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onViewModeChange('daily');
        }
        break;

      case 'w':
      case 'W':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onViewModeChange('weekly');
        }
        break;

      case 'm':
      case 'M':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onViewModeChange('monthly');
        }
        break;

      case 't':
      case 'T':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onDateSelect(new Date(today));
        }
        break;
    }
  }, [selectedDate, currentDate, onDateSelect, onMonthChange, onViewModeChange, viewMode, isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, isEnabled]);

  return {
    // Provide keyboard shortcuts info for UI
    shortcuts: {
      navigation: [
        { key: '← → ↑ ↓', description: 'Navigate dates' },
        { key: 'Home', description: 'Go to today' },
        { key: 'Page Up/Down', description: 'Change month' },
        { key: 'Enter/Space', description: 'Select date' },
        { key: 'Escape', description: 'Clear selection' }
      ],
      viewModes: [
        { key: 'Ctrl+D', description: 'Daily view' },
        { key: 'Ctrl+W', description: 'Weekly view' },
        { key: 'Ctrl+M', description: 'Monthly view' },
        { key: 'Ctrl+T', description: 'Go to today' }
      ]
    }
  };
};