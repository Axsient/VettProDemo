import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { validateSAPostalCode } from '@/lib/utils/validation';
import { NeumorphicInput } from '@/components/ui/neumorphic';
import { CheckCircle, AlertCircle, MapPin } from 'lucide-react';

interface AddressInputProps {
  value?: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };
  onChange?: (address: AddressInputProps['value']) => void;
  label?: string;
  className?: string;
}

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

export const AddressInput: React.FC<AddressInputProps> = ({
  value = {
    street: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
  },
  onChange,
  label = 'Address',
  className,
}) => {
  const [postalValidation, setPostalValidation] = useState<ReturnType<typeof validateSAPostalCode>>({ isValid: false });

  const handleFieldChange = (field: keyof typeof value, newValue: string) => {
    const updatedAddress = { ...value, [field]: newValue };
    
    if (field === 'postalCode') {
      const validation = validateSAPostalCode(newValue);
      setPostalValidation(validation);
    }
    
    onChange?.(updatedAddress);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-5 w-5 text-purple-400" />
        <label className="text-sm font-medium text-neumorphic-text-primary">
          {label}
        </label>
      </div>

      <div className="space-y-3">
        {/* Street Address */}
        <div>
          <label className="text-xs text-neumorphic-text-secondary mb-1 block">
            Street Address
          </label>
          <NeumorphicInput
            value={value.street}
            onChange={(e) => handleFieldChange('street', e.target.value)}
            placeholder="123 Main Street"
            className="w-full"
          />
        </div>

        {/* Suburb and City Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neumorphic-text-secondary mb-1 block">
              Suburb
            </label>
            <NeumorphicInput
              value={value.suburb}
              onChange={(e) => handleFieldChange('suburb', e.target.value)}
              placeholder="Sandton"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-xs text-neumorphic-text-secondary mb-1 block">
              City
            </label>
            <NeumorphicInput
              value={value.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder="Johannesburg"
              className="w-full"
            />
          </div>
        </div>

        {/* Province and Postal Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neumorphic-text-secondary mb-1 block">
              Province
            </label>
            <div className="relative">
              <select
                value={value.province}
                onChange={(e) => handleFieldChange('province', e.target.value)}
                className={cn(
                  'neumorphic-input-enhanced',
                  'px-[var(--neumorphic-spacing-md)] py-[var(--neumorphic-spacing-sm)]',
                  'rounded-[var(--neumorphic-radius-md)]',
                  'text-neumorphic-text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                  'w-full appearance-none cursor-pointer'
                )}
              >
                <option value="">Select Province</option>
                {SA_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-neumorphic-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-xs text-neumorphic-text-secondary mb-1 block">
              Postal Code
            </label>
            <div className="relative">
              <NeumorphicInput
                value={value.postalCode}
                onChange={(e) => handleFieldChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="2196"
                className="w-full pr-10"
                maxLength={4}
              />
              
              {/* Postal Code Validation Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {value.postalCode.length === 4 && (
                  postalValidation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )
                )}
              </div>
            </div>
            
            {/* Postal Code Error */}
            {postalValidation.error && value.postalCode.length > 0 && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {postalValidation.error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Preview */}
      {value.street && value.city && (
        <div className="mt-4 p-3 rounded-[var(--neumorphic-radius-md)] bg-neumorphic-card/30 border border-neumorphic-border/10">
          <p className="text-xs text-neumorphic-text-secondary mb-1">Address Preview:</p>
          <p className="text-sm text-neumorphic-text-primary">
            {[value.street, value.suburb, value.city, value.province, value.postalCode].filter(Boolean).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

AddressInput.displayName = 'AddressInput'; 