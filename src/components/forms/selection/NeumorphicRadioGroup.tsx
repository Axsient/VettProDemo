"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface NeumorphicRadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export const NeumorphicRadioGroup: React.FC<NeumorphicRadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  name,
  error,
  disabled = false,
  required = false,
  className,
  orientation = 'vertical',
  size = 'md'
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (optionValue: string) => {
    if (!disabled && onChange) {
      onChange(optionValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (index + 1) % options.length;
        setFocusedIndex(nextIndex);
        if (!options[nextIndex].disabled) {
          handleChange(options[nextIndex].value);
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index === 0 ? options.length - 1 : index - 1;
        setFocusedIndex(prevIndex);
        if (!options[prevIndex].disabled) {
          handleChange(options[prevIndex].value);
        }
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (!options[index].disabled) {
          handleChange(options[index].value);
        }
        break;
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const radioSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block font-medium text-neumorphic-text-primary',
          sizeClasses[size]
        )}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Radio Group */}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(
          'space-y-3',
          orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
        )}
      >
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;
          const isFocused = focusedIndex === index;

          return (
            <div
              key={option.value}
              className={cn(
                'relative flex items-start',
                orientation === 'horizontal' && 'flex-col items-center'
              )}
            >
              <div className="flex items-center">
                <div className="relative">
                  {/* Custom Radio Button */}
                  <input
                    type="radio"
                    id={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleChange(option.value)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={isDisabled}
                    className="sr-only"
                    aria-describedby={option.description ? `${name}-${option.value}-desc` : undefined}
                  />
                  
                  {/* Visual Radio Button */}
                  <div
                    className={cn(
                      radioSizeClasses[size],
                      'rounded-full border-2 transition-all duration-200 cursor-pointer',
                      'flex items-center justify-center',
                      // Base styling
                      'shadow-neumorphic-concave',
                      // Selected state
                      isSelected && [
                        'border-purple-500 bg-purple-500/10',
                        'shadow-neumorphic-convex-sm'
                      ],
                      // Unselected state
                      !isSelected && [
                        'border-neumorphic-border/30',
                        'hover:border-purple-500/50'
                      ],
                      // Focus state
                      isFocused && 'ring-2 ring-purple-500/20',
                      // Disabled state
                      isDisabled && [
                        'opacity-50 cursor-not-allowed',
                        'hover:border-neumorphic-border/30'
                      ]
                    )}
                    onClick={() => !isDisabled && handleChange(option.value)}
                    style={{ 
                      background: isSelected 
                        ? 'var(--neumorphic-bg)' 
                        : 'var(--neumorphic-bg)'
                    }}
                  >
                    {/* Inner dot when selected */}
                    {isSelected && (
                      <div className={cn(
                        'rounded-full bg-purple-500 transition-all duration-200',
                        size === 'sm' && 'w-2 h-2',
                        size === 'md' && 'w-2.5 h-2.5',
                        size === 'lg' && 'w-3 h-3'
                      )} />
                    )}
                  </div>
                </div>

                {/* Label and Description */}
                <div className={cn('ml-3', orientation === 'horizontal' && 'ml-0 mt-2')}>
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className={cn(
                      'font-medium text-neumorphic-text-primary cursor-pointer',
                      sizeClasses[size],
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.label}
                  </label>
                  
                  {option.description && (
                    <p
                      id={`${name}-${option.value}-desc`}
                      className={cn(
                        'text-neumorphic-text-secondary mt-1',
                        size === 'sm' && 'text-xs',
                        size === 'md' && 'text-sm',
                        size === 'lg' && 'text-base'
                      )}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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