import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { validateSACompanyNumber } from '@/lib/utils/validation';
import { NeumorphicBadge } from '@/components/ui/neumorphic';
import { CheckCircle, AlertCircle, Building2 } from 'lucide-react';

interface CompanyRegistrationInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, validation: ReturnType<typeof validateSACompanyNumber>) => void;
  label?: string;
  error?: string;
  showType?: boolean;
}

export const CompanyRegistrationInput = React.forwardRef<HTMLInputElement, CompanyRegistrationInputProps>(
  ({ className, value = '', onChange, label = 'Company Registration Number', error, showType = true, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [validation, setValidation] = useState<ReturnType<typeof validateSACompanyNumber>>({ isValid: false });

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase();
      setInputValue(newValue);
      
      const validationResult = validateSACompanyNumber(newValue);
      setValidation(validationResult);
      
      onChange?.(newValue, validationResult);
    };

    const getTypeColor = (type?: string) => {
      switch (type) {
        case 'Close Corporation':
          return 'info';
        case 'Private Company':
          return 'success';
        case 'Public Company':
          return 'warning';
        default:
          return 'default';
      }
    };

    const getTypeIcon = (type?: string) => {
      switch (type) {
        case 'Close Corporation':
          return '🏪';
        case 'Private Company':
          return '🏢';
        case 'Public Company':
          return '🏛️';
        default:
          return '🏢';
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neumorphic-text-primary flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-400" />
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="2023/123456/07 or CK2023/123456"
            className={cn(
              'neumorphic-input-enhanced',
              'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
              'rounded-[var(--neumorphic-radius-md)]',
              'text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'w-full font-mono tracking-wide',
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
                variant={getTypeColor(validation.type)}
                className="text-xs flex items-center gap-1"
              >
                <span>{getTypeIcon(validation.type)}</span>
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
          <div className="text-xs text-neumorphic-text-secondary space-y-1">
            <p>Enter a South African company registration number:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Private Company: YYYY/NNNNNN/07 (e.g., 2023/123456/07)</li>
              <li>Public Company: YYYY/NNNNNN/06 (e.g., 2023/123456/06)</li>
              <li>Close Corporation: CKYYYY/NNNNNN (e.g., CK2023/123456)</li>
            </ul>
          </div>
        )}

        {/* Company Type Information */}
        {validation.isValid && validation.type && (
          <div className="p-3 rounded-[var(--neumorphic-radius-md)] bg-neumorphic-card/30 border border-neumorphic-border/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getTypeIcon(validation.type)}</span>
              <h4 className="text-sm font-semibold text-neumorphic-text-primary">
                {validation.type}
              </h4>
            </div>
            
            <p className="text-xs text-neumorphic-text-secondary">
              {validation.type === 'Close Corporation' && 
                'A Close Corporation (CC) is a juristic person with limited liability, suitable for small businesses with 1-10 members.'
              }
              {validation.type === 'Private Company' && 
                'A Private Company (Pty Ltd) is a separate legal entity with limited liability, suitable for most businesses.'
              }
              {validation.type === 'Public Company' && 
                'A Public Company (Ltd) can offer shares to the public and is subject to additional regulatory requirements.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

CompanyRegistrationInput.displayName = 'CompanyRegistrationInput'; 