"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  showTime?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabled = false,
  error,
  showTime = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [timeValue, setTimeValue] = useState('12:00');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(value);
    if (value) {
      setCurrentDate(value);
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (showTime && timeValue) {
      const [hours, minutes] = timeValue.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes));
    }
    
    setSelectedDate(newDate);
    onChange?.(newDate);
    
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
    setShowYearPicker(false);
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-ZA', options);
  };

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const endYear = currentYear + 50;
    const years = [];
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return years.reverse(); // Show newest years first
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isDisabled = isDateDisabled(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          type="button" // Prevent form submission
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDisabled) handleDateSelect(day);
          }}
          disabled={isDisabled}
          className={cn(
            'h-8 w-8 rounded-md text-sm font-medium transition-all duration-200',
            'hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
            isSelected && 'bg-purple-500 text-white shadow-lg',
            isToday && !isSelected && 'bg-purple-500/20 text-purple-500 font-bold',
            isDisabled && 'text-neumorphic-text-secondary cursor-not-allowed opacity-50',
            !isSelected && !isToday && !isDisabled && 'text-neumorphic-text-primary hover:text-purple-500'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn('relative', className)}>
      <label className="text-sm font-medium text-neumorphic-text-primary flex items-center gap-2 mb-2">
        <Calendar className="h-4 w-4 text-purple-400" />
        {label}
      </label>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button" // Prevent form submission
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className={cn(
            'neumorphic-input-enhanced',
            'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
            'rounded-[var(--neumorphic-radius-md)]',
            'text-neumorphic-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
            'w-full text-left flex items-center justify-between',
            error && 'border-red-500/30',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className={cn(
            selectedDate ? 'text-neumorphic-text-primary' : 'text-neumorphic-text-secondary'
          )}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
          <Calendar className="h-4 w-4 text-neumorphic-text-secondary" />
        </button>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 p-5 rounded-[var(--neumorphic-radius-lg)] shadow-neumorphic-convex-lg border border-neumorphic-border min-w-[340px]" style={{ background: 'var(--neumorphic-bg)' }}>
            
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateMonth('prev');
                }}
                className="p-2 rounded-md hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-2">
                {/* Month Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowMonthPicker(!showMonthPicker);
                      setShowYearPicker(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm font-semibold text-neumorphic-text-primary hover:bg-purple-500/10 rounded-md transition-colors"
                  >
                    {MONTHS[currentDate.getMonth()]}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {showMonthPicker && (
                    <div className="absolute top-full left-0 mt-1 z-60 rounded-md shadow-neumorphic-convex-lg border border-neumorphic-border p-3 grid grid-cols-3 gap-2 min-w-[220px]" style={{ background: 'var(--neumorphic-bg)' }}>
                      {MONTHS.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMonthSelect(index);
                          }}
                                                     className={cn(
                             'px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-500/20 transition-all duration-200',
                             index === currentDate.getMonth() 
                               ? 'bg-purple-500 text-white shadow-lg' 
                               : 'text-neumorphic-text-primary hover:text-purple-400'
                           )}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowYearPicker(!showYearPicker);
                      setShowMonthPicker(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm font-semibold text-neumorphic-text-primary hover:bg-purple-500/10 rounded-md transition-colors"
                  >
                    {currentDate.getFullYear()}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {showYearPicker && (
                    <div className="absolute top-full left-0 mt-1 z-60 rounded-lg shadow-neumorphic-convex-lg border border-neumorphic-border p-4 max-h-72 overflow-y-auto min-w-[280px] max-w-[320px] scrollbar-thin" style={{ background: 'var(--neumorphic-bg)' }}>
                      <div className="grid grid-cols-4 gap-2">
                        {generateYearRange().map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleYearSelect(year);
                          }}
                                                     className={cn(
                             'px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-500/20 transition-all duration-200 border border-transparent',
                             year === currentDate.getFullYear() 
                               ? 'bg-purple-500 text-white shadow-lg border-purple-400' 
                               : 'text-neumorphic-text-primary hover:text-purple-400 hover:border-purple-500/30'
                           )}
                                                  >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateMonth('next');
                }}
                className="p-2 rounded-md hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="h-8 flex items-center justify-center">
                  <span className="text-xs font-medium text-neumorphic-text-secondary">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {renderCalendarDays()}
            </div>

            {/* Time Picker */}
            {showTime && (
              <div className="border-t border-neumorphic-border/10 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <label className="text-sm font-medium text-neumorphic-text-primary">
                    Time
                  </label>
                </div>
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className={cn(
                    'neumorphic-input-enhanced',
                    'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
                    'rounded-[var(--neumorphic-radius-md)]',
                    'text-neumorphic-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                    'w-full'
                  )}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="px-3 py-1 text-sm rounded-md hover:bg-neumorphic-text-secondary/10 transition-colors text-neumorphic-text-primary"
              >
                Cancel
              </button>
              {showTime && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 text-sm rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker'; 