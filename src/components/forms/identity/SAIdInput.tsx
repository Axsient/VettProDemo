import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { validateSAIdNumber, formatSAIdNumber } from '@/lib/utils/validation';
import { NeumorphicBadge } from '@/components/ui/neumorphic';
import { CheckCircle, AlertCircle, User, Calendar, MapPin } from 'lucide-react';

interface SAIdInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, validation: ReturnType<typeof validateSAIdNumber>) => void;
  showDetails?: boolean;
  label?: string;
  error?: string;
}

export const SAIdInput = React.forwardRef<HTMLInputElement, SAIdInputProps>(
  ({ className, value = '', onChange, showDetails = true, label = 'South African ID Number', error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [validation, setValidation] = useState<ReturnType<typeof validateSAIdNumber>>({ isValid: false });
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, '').slice(0, 13);
      setInputValue(newValue);
      
      const validationResult = validateSAIdNumber(newValue);
      setValidation(validationResult);
      
      onChange?.(newValue, validationResult);
    };

    const displayValue = isFocused ? inputValue : formatSAIdNumber(inputValue);

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neumorphic-text-primary">
            {label}
          </label>
          
          <div className="relative">
            <input
              ref={ref}
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="9001014800088"
              className={cn(
                'neumorphic-input-enhanced',
                'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
                'rounded-[var(--neumorphic-radius-md)]',
                'text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                'w-full font-mono text-lg tracking-wider',
                validation.isValid && inputValue.length === 13 && 'border-green-500/30',
                validation.error && inputValue.length > 0 && 'border-red-500/30',
                className
              )}
              {...props}
            />
            
            {/* Validation Icon */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {inputValue.length === 13 && (
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
        </div>

        {/* ID Details Display */}
        {showDetails && validation.isValid && validation.details && (
          <div className="p-4 rounded-[var(--neumorphic-radius-md)] bg-neumorphic-card/50 border border-neumorphic-border/10">
            <h4 className="text-sm font-semibold text-neumorphic-text-primary mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              ID Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-neumorphic-text-secondary">Date of Birth</p>
                  <p className="text-sm font-medium text-neumorphic-text-primary">
                    {validation.details.dateOfBirth.toLocaleDateString('en-ZA')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-pink-400" />
                <div>
                  <p className="text-xs text-neumorphic-text-secondary">Gender</p>
                  <p className="text-sm font-medium text-neumorphic-text-primary">
                    {validation.details.gender}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-lg">🎂</span>
                <div>
                  <p className="text-xs text-neumorphic-text-secondary">Age</p>
                  <p className="text-sm font-medium text-neumorphic-text-primary">
                    {validation.details.age} years old
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-xs text-neumorphic-text-secondary">Status</p>
                  <NeumorphicBadge 
                    variant={validation.details.citizenship === 'SA Citizen' ? 'success' : 'info'}
                    className="text-xs"
                  >
                    {validation.details.citizenship}
                  </NeumorphicBadge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SAIdInput.displayName = 'SAIdInput'; 