"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, X, AlertCircle, CheckCircle, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

interface NeumorphicSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
}

export const NeumorphicSelect: React.FC<NeumorphicSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option...",
  error,
  disabled = false,
  required = false,
  searchable = false,
  clearable = false,
  className,
  size = 'md',
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group options if they have groups
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  const selectedOption = options.find(opt => opt.value === value);

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-5 py-4'
  };

  const dropdownSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(undefined);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex].value);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case ' ':
        if (!searchable) {
          event.preventDefault();
          handleToggle();
        }
        break;
    }
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block font-medium text-neumorphic-text-primary mb-2',
          dropdownSizeClasses[size]
        )}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <div
        className={cn(
          sizeClasses[size],
          'w-full rounded-[var(--neumorphic-radius)] border transition-all duration-200',
          'flex items-center justify-between cursor-pointer',
          'shadow-neumorphic-concave',
          // Focus state
          isFocused && 'ring-2 ring-purple-500/20 border-purple-500/50',
          // Error state
          error && 'border-red-400/50',
          // Normal state
          !error && !isFocused && 'border-neumorphic-border/30 hover:border-purple-500/50',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed hover:border-neumorphic-border/30'
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-controls="select-dropdown"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        style={{ background: 'var(--neumorphic-bg)' }}
      >
        {/* Selected Value or Placeholder */}
        <div className="flex-1 truncate">
          {selectedOption ? (
            <span className="text-neumorphic-text-primary">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-neumorphic-text-secondary">
              {placeholder}
            </span>
          )}
        </div>

        {/* Clear Button */}
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-purple-500/10 rounded transition-colors mr-1"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 text-neumorphic-text-secondary" />
          </button>
        )}

        {/* Dropdown Arrow */}
        <ChevronDown 
          className={cn(
            'h-5 w-5 text-neumorphic-text-secondary transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={cn(
            'absolute top-full left-0 right-0 mt-2 z-50',
            'rounded-[var(--neumorphic-radius)] shadow-neumorphic-convex-lg',
            'border border-neumorphic-border max-h-64 overflow-y-auto',
            dropdownSizeClasses[size]
          )}
          style={{ background: 'var(--neumorphic-bg)' }}
          role="listbox"
          aria-label={`${label} options`}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-neumorphic-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neumorphic-text-secondary" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded border border-neumorphic-border/30',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50',
                    'text-neumorphic-text-primary placeholder-neumorphic-text-secondary',
                    dropdownSizeClasses[size]
                  )}
                  style={{ background: 'var(--neumorphic-bg)' }}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="py-2">
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="px-4 py-3 text-neumorphic-text-secondary text-center">
                No options found
              </div>
            ) : (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  {/* Group Header */}
                  {groupName !== 'default' && (
                    <div className="px-4 py-2 text-xs font-bold text-neumorphic-text-primary/80 uppercase tracking-wider border-b border-neumorphic-border/30 bg-neumorphic-border/10 shadow-neumorphic-concave-sm pointer-events-none select-none">
                      {groupName}
                    </div>
                  )}
                  
                  {/* Group Options */}
                                     {groupOptions.map((option) => {
                    const globalIndex = filteredOptions.indexOf(option);
                    const isSelected = option.value === value;
                    const isFocusedOption = globalIndex === focusedIndex;
                    const isDisabled = option.disabled;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'px-4 py-3 cursor-pointer transition-colors flex items-center justify-between',
                          // Hover/Focus state
                          !isDisabled && 'hover:bg-purple-500/10',
                          isFocusedOption && 'bg-purple-500/10',
                          // Selected state
                          isSelected && 'bg-purple-500/20',
                          // Disabled state
                          isDisabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => !isDisabled && handleSelect(option.value)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                      >
                        <div className="flex-1">
                          <div className="text-neumorphic-text-primary font-medium">
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-neumorphic-text-secondary text-sm mt-1">
                              {option.description}
                            </div>
                          )}
                        </div>
                        
                        {/* Selected Indicator */}
                        {isSelected && (
                          <Check className="h-4 w-4 text-purple-500 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success indicator when value is selected and no error */}
      {value && !error && (
        <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Selection confirmed</span>
        </div>
      )}
    </div>
  );
}; 