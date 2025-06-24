import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { validateSAPhoneNumber } from '@/lib/utils/validation';
import { NeumorphicBadge } from '@/components/ui/neumorphic';
import { CheckCircle, AlertCircle, Phone, Smartphone } from 'lucide-react';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, validation: ReturnType<typeof validateSAPhoneNumber>) => void;
  label?: string;
  error?: string;
  showType?: boolean;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, label = 'Phone Number', error, showType = true, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [validation, setValidation] = useState<ReturnType<typeof validateSAPhoneNumber>>({ isValid: false });
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^\d+]/g, '');
      setInputValue(newValue);
      
      const validationResult = validateSAPhoneNumber(newValue);
      setValidation(validationResult);
      
      onChange?.(newValue, validationResult);
    };

    const displayValue = isFocused ? inputValue : (validation.formatted || inputValue);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neumorphic-text-primary">
          {label}
        </label>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <span className="text-sm text-neumorphic-text-secondary">🇿🇦</span>
          </div>
          
          <input
            ref={ref}
            type="tel"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="+27 82 123 4567"
            className={cn(
              'neumorphic-input-enhanced',
              'pl-12 pr-12 py-[var(--neumorphic-spacing-sm)]',
              'rounded-[var(--neumorphic-radius-md)]',
              'text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'w-full',
              validation.isValid && 'border-green-500/30',
              validation.error && inputValue.length > 0 && 'border-red-500/30',
              className
            )}
            {...props}
          />
          
          {/* Validation Icon and Type Badge */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {showType && validation.isValid && validation.type && (
              <NeumorphicBadge 
                variant={validation.type === 'Mobile' ? 'info' : 'default'}
                className="text-xs flex items-center gap-1"
              >
                {validation.type === 'Mobile' ? (
                  <Smartphone className="h-3 w-3" />
                ) : (
                  <Phone className="h-3 w-3" />
                )}
                {validation.type}
              </NeumorphicBadge>
            )}
            
            {inputValue.length > 0 && (
              validation.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )
            )}
          </div>
        </div>

        {/* Error Message */}
        {(error || validation.error) && inputValue.length > 0 && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error || validation.error}
          </p>
        )}

        {/* Helper Text */}
        {!error && !validation.error && (
          <p className="text-xs text-neumorphic-text-secondary">
            Enter a South African phone number (e.g., 082 123 4567 or +27 82 123 4567)
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput'; 