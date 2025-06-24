import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SAIdInput } from '../identity/SAIdInput';
import { PhoneInput } from '../identity/PhoneInput';
import { AddressInput } from '../identity/AddressInput';
import { CompanyRegistrationInput } from '../business/CompanyRegistrationInput';
import { VATInput } from '../business/VATInput';
import { DatePicker } from '../advanced/DatePicker';
import { validateEmail } from '@/lib/utils/validation';
import { NeumorphicInput } from '@/components/ui/neumorphic';
import { AlertCircle, CheckCircle, User, Building, Calendar as CalendarIcon, Mail } from 'lucide-react';

interface FormData {
  // Identity
  idNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | undefined;
  address: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };
  
  // Business
  companyReg: string;
  vatNumber: string;
  
  // Advanced
  appointmentDate: Date | undefined;
}

export const FormComponentsDemo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    idNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: undefined,
    address: {
      street: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
    },
    companyReg: '',
    vatNumber: '',
    appointmentDate: undefined,
  });

  const [emailValidation, setEmailValidation] = useState({ isValid: false, error: '' });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    
    const validation = validateEmail(value);
    setEmailValidation({ isValid: validation.isValid, error: validation.error || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neumorphic-text-primary mb-2">
          🇿🇦 South African Vetting Form Components
        </h1>
        <p className="text-neumorphic-text-secondary">
          Comprehensive form components designed for South African vetting and verification systems
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Phase 1: Identity & Personal Information */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-neumorphic-text-primary">
              Phase 1: Identity & Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SA ID Number */}
            <div className="md:col-span-2">
              <SAIdInput
                value={formData.idNumber}
                onChange={(value) => setFormData(prev => ({ ...prev, idNumber: value }))}
                showDetails={true}
              />
            </div>

            {/* Name Fields */}
            <div>
              <label className="text-sm font-medium text-neumorphic-text-primary mb-2 block">
                First Name
              </label>
              <NeumorphicInput
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neumorphic-text-primary mb-2 block">
                Last Name
              </label>
              <NeumorphicInput
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Smith"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-neumorphic-text-primary flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-purple-400" />
                Email Address
              </label>
              <div className="relative">
                <NeumorphicInput
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="john@example.com"
                  className={cn(
                    'w-full pr-10',
                    emailValidation.isValid && formData.email.length > 0 && 'border-green-500/30',
                    emailValidation.error && formData.email.length > 0 && 'border-red-500/30'
                  )}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {formData.email.length > 0 && (
                    emailValidation.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )
                  )}
                </div>
              </div>
              {emailValidation.error && formData.email.length > 0 && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {emailValidation.error}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                showType={true}
              />
            </div>

            {/* Date of Birth */}
            <div className="md:col-span-2">
              <DatePicker
                value={formData.dateOfBirth}
                onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                label="Date of Birth"
                placeholder="Select your date of birth"
                maxDate={new Date()} // Can't be born in the future
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <AddressInput
                value={formData.address}
                onChange={(address) => setFormData(prev => ({ ...prev, address: address || prev.address }))}
                label="Residential Address"
              />
            </div>
          </div>
        </div>

        {/* Phase 2: Business & Financial Information */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-neumorphic-text-primary">
              Phase 2: Business & Financial Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Registration */}
            <div>
              <CompanyRegistrationInput
                value={formData.companyReg}
                onChange={(value) => setFormData(prev => ({ ...prev, companyReg: value }))}
                showType={true}
              />
            </div>

            {/* VAT Number */}
            <div>
              <VATInput
                value={formData.vatNumber}
                onChange={(value) => setFormData(prev => ({ ...prev, vatNumber: value }))}
              />
            </div>
          </div>
        </div>

        {/* Phase 3: Advanced Components */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-neumorphic-text-primary">
              Phase 3: Advanced Components
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Date with Time */}
            <div>
              <DatePicker
                value={formData.appointmentDate}
                onChange={(date) => setFormData(prev => ({ ...prev, appointmentDate: date }))}
                label="Appointment Date & Time"
                placeholder="Schedule your appointment"
                minDate={new Date()} // Can't schedule in the past
                showTime={true}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className={cn(
              'neumorphic-button-enhanced',
              'px-8 py-3 rounded-[var(--neumorphic-radius-md)]',
              'text-white font-semibold',
              'bg-gradient-to-r from-purple-500 to-purple-600',
              'hover:from-purple-600 hover:to-purple-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'transition-all duration-200',
              'shadow-lg hover:shadow-xl'
            )}
          >
            Submit Vetting Application
          </button>
        </div>
      </form>

      {/* Component Information */}
      <div className="mt-12 p-6 bg-neumorphic-card/50 rounded-[var(--neumorphic-radius-lg)] border border-neumorphic-border/10">
        <h3 className="text-lg font-semibold text-neumorphic-text-primary mb-4">
          🎯 Component Features Demonstrated
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Identity Components</h4>
            <ul className="space-y-1 text-neumorphic-text-secondary">
              <li>✅ SA ID Number validation with Luhn algorithm</li>
              <li>✅ Real-time ID information extraction</li>
              <li>✅ Phone number formatting & validation</li>
              <li>✅ Comprehensive address input</li>
              <li>✅ Email validation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Business Components</h4>
            <ul className="space-y-1 text-neumorphic-text-secondary">
              <li>✅ Company registration validation</li>
              <li>✅ Company type detection</li>
              <li>✅ VAT number validation</li>
              <li>✅ SARS-compliant formats</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Advanced Features</h4>
            <ul className="space-y-1 text-neumorphic-text-secondary">
              <li>✅ Custom date picker with calendar</li>
              <li>✅ Time selection support</li>
              <li>✅ Date range restrictions</li>
              <li>✅ Neumorphic styling throughout</li>
              <li>✅ Real-time validation feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

FormComponentsDemo.displayName = 'FormComponentsDemo'; 