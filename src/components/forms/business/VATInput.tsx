import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { validateSAVATNumber } from '@/lib/utils/validation';
import { CheckCircle, AlertCircle, Receipt } from 'lucide-react';

interface VATInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, validation: ReturnType<typeof validateSAVATNumber>) => void;
  label?: string;
  error?: string;
}

export const VATInput = React.forwardRef<HTMLInputElement, VATInputProps>(
  ({ className, value = '', onChange, label = 'VAT Registration Number', error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [validation, setValidation] = useState<ReturnType<typeof validateSAVATNumber>>({ isValid: false });

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
      setInputValue(newValue);
      
      const validationResult = validateSAVATNumber(newValue);
      setValidation(validationResult);
      
      onChange?.(newValue, validationResult);
    };

    const formatVATNumber = (vatNumber: string) => {
      if (vatNumber.length <= 10) {
        return vatNumber.replace(/(\d{10})/, '$1');
      }
      return vatNumber;
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neumorphic-text-primary flex items-center gap-2">
          <Receipt className="h-4 w-4 text-purple-400" />
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={formatVATNumber(inputValue)}
            onChange={handleInputChange}
            placeholder="4123456789"
            className={cn(
              'neumorphic-input-enhanced',
              'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
              'rounded-[var(--neumorphic-radius-md)]',
              'text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'w-full font-mono text-lg tracking-wider',
              validation.isValid && inputValue.length === 10 && 'border-green-500/30',
              validation.error && inputValue.length > 0 && 'border-red-500/30',
              className
            )}
            {...props}
          />
          
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {inputValue.length === 10 && (
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
          <div className="text-xs text-neumorphic-text-secondary space-y-1">
            <p>Enter a 10-digit South African VAT registration number</p>
            <p>VAT numbers typically start with 4 and are issued by SARS</p>
          </div>
        )}

        {/* VAT Information */}
        {validation.isValid && (
          <div className="p-3 rounded-[var(--neumorphic-radius-md)] bg-neumorphic-card/30 border border-neumorphic-border/10">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-green-400" />
              <h4 className="text-sm font-semibold text-neumorphic-text-primary">
                Valid VAT Registration
              </h4>
            </div>
            
            <p className="text-xs text-neumorphic-text-secondary">
              This appears to be a valid South African VAT registration number format. 
              For complete verification, check with SARS or use their online VAT verification system.
            </p>
          </div>
        )}
      </div>
    );
  }
);

VATInput.displayName = 'VATInput'; 