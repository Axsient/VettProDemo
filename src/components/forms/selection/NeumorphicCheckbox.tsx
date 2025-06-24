"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus, AlertCircle, CheckCircle } from 'lucide-react';

interface NeumorphicCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  value?: string;
}

export const NeumorphicCheckbox: React.FC<NeumorphicCheckboxProps> = ({
  checked = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  indeterminate = false,
  className,
  size = 'md',
  name,
  value
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleChange();
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const checkboxSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const isCheckedOrIndeterminate = checked || indeterminate;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start">
        <div className="relative">
          {/* Hidden input for form submission */}
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            className="sr-only"
            aria-describedby={description ? `${name}-desc` : undefined}
          />
          
          {/* Visual Checkbox */}
          <div
            className={cn(
              checkboxSizeClasses[size],
              'rounded border-2 transition-all duration-200 cursor-pointer',
              'flex items-center justify-center',
              // Base styling
              'shadow-neumorphic-concave',
              // Checked/Indeterminate state
              isCheckedOrIndeterminate && [
                'border-purple-500 bg-purple-500/10',
                'shadow-neumorphic-convex-sm'
              ],
              // Unchecked state
              !isCheckedOrIndeterminate && [
                'border-neumorphic-border/30',
                'hover:border-purple-500/50'
              ],
              // Focus state
              isFocused && 'ring-2 ring-purple-500/20',
              // Disabled state
              disabled && [
                'opacity-50 cursor-not-allowed',
                'hover:border-neumorphic-border/30'
              ]
            )}
            onClick={() => !disabled && handleChange()}
            style={{ 
              background: 'var(--neumorphic-bg)'
            }}
          >
            {/* Check icon when checked */}
            {checked && !indeterminate && (
              <Check 
                className={cn(
                  iconSizeClasses[size],
                  'text-purple-500 transition-all duration-200'
                )} 
              />
            )}
            
            {/* Minus icon when indeterminate */}
            {indeterminate && (
              <Minus 
                className={cn(
                  iconSizeClasses[size],
                  'text-purple-500 transition-all duration-200'
                )} 
              />
            )}
          </div>
        </div>

        {/* Label and Description */}
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                className={cn(
                  'font-medium text-neumorphic-text-primary cursor-pointer block',
                  sizeClasses[size],
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !disabled && handleChange()}
              >
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            
            {description && (
              <p
                id={name ? `${name}-desc` : undefined}
                className={cn(
                  'text-neumorphic-text-secondary mt-1',
                  size === 'sm' && 'text-xs',
                  size === 'md' && 'text-sm',
                  size === 'lg' && 'text-base',
                  disabled && 'opacity-50'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success indicator when checked and no error */}
      {checked && !error && !indeterminate && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Confirmed</span>
        </div>
      )}
    </div>
  );
};

// Multi-Checkbox Group Component
export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface NeumorphicCheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  minSelections?: number;
  maxSelections?: number;
}

export const NeumorphicCheckboxGroup: React.FC<NeumorphicCheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className,
  size = 'md',
  name,
  minSelections,
  maxSelections
}) => {
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    let newValue: string[];
    
    if (checked) {
      // Adding a selection
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't allow more than max
      }
      newValue = [...value, optionValue];
    } else {
      // Removing a selection
      if (minSelections && value.length <= minSelections) {
        return; // Don't allow less than min
      }
      newValue = value.filter(v => v !== optionValue);
    }
    
    onChange(newValue);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Group Label */}
      {label && (
        <label className={cn(
          'block font-medium text-neumorphic-text-primary',
          sizeClasses[size]
        )}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Selection Counter */}
      {(minSelections || maxSelections) && (
        <div className="text-sm text-neumorphic-text-secondary">
          Selected: {value.length}
          {maxSelections && ` / ${maxSelections}`}
          {minSelections && ` (minimum: ${minSelections})`}
        </div>
      )}

      {/* Checkbox Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          const isDisabled = disabled || option.disabled ||
            (!isChecked && !!maxSelections && value.length >= maxSelections);

          return (
            <NeumorphicCheckbox
              key={option.value}
              checked={isChecked}
              onChange={(checked) => handleOptionChange(option.value, checked)}
              label={option.label}
              description={option.description}
              disabled={isDisabled}
              size={size}
              name={name ? `${name}-${option.value}` : undefined}
              value={option.value}
            />
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success indicator */}
      {value.length > 0 && !error && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{value.length} option{value.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}
    </div>
  );
}; 