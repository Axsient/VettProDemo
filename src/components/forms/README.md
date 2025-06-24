# 🇿🇦 South African Vetting Form Components

A comprehensive, production-ready library of form components specifically designed for South African vetting and verification systems. All components feature neumorphic styling, real-time validation, and compliance with South African data formats.

## 🎯 Overview

This form component library provides specialized inputs for South African identity verification, business registration, and general form needs. Each component includes built-in validation, formatting, and user-friendly feedback designed specifically for the South African market.

## 📁 Project Structure

```
src/components/forms/
├── identity/                 # Personal identity components
│   ├── SAIdInput.tsx        # SA ID number with Luhn validation
│   ├── PhoneInput.tsx       # SA phone number formatting
│   └── AddressInput.tsx     # Complete SA address input
├── business/                # Business & financial components
│   ├── CompanyRegistrationInput.tsx  # Company reg numbers
│   └── VATInput.tsx         # VAT registration numbers
├── advanced/                # Advanced UI components
│   └── DatePicker.tsx       # Custom date/time picker
├── validation/              # Validation utilities
└── examples/                # Demo and examples
    ├── FormComponentsDemo.tsx
    └── README.md
```

## 🚀 Implementation Phases

### ✅ Phase 1: Core Identity Components (COMPLETE)
- **SAIdInput** - South African ID number validation with Luhn algorithm
- **PhoneInput** - Phone number formatting and validation (mobile/landline detection)
- **AddressInput** - Comprehensive address input with postal code validation
- **Email validation** - Enhanced email validation with SA domain awareness

### ✅ Phase 2: Business & Financial Components (COMPLETE)
- **CompanyRegistrationInput** - Company registration number validation (CC/Pty/Ltd)
- **VATInput** - VAT registration number validation
- **Bank account validation** - SA bank account format checking

### ✅ Phase 3: Advanced UI Components (COMPLETE)
- **DatePicker** - Custom calendar with time selection
- **Multi-step forms** - Wizard-style form navigation
- **File upload** - Document upload with validation

### ✅ Phase 4: Validation & Utilities (COMPLETE)
- **Comprehensive validation library** - All SA-specific validations
- **Real-time feedback** - Instant validation with visual indicators
- **Accessibility features** - ARIA labels and keyboard navigation

### ✅ Phase 5: Core Selection Components (COMPLETE)
- **NeumorphicRadioGroup** - Radio button groups with keyboard navigation
- **NeumorphicCheckbox** - Individual and group checkboxes with constraints
- **NeumorphicSelect** - Dropdown selectors with search and grouping
- **NeumorphicMultiSelect** - Multiple selection with tags and limits

## 🛠️ Core Components

### Identity Components

#### SAIdInput
```tsx
import { SAIdInput } from '@/components/forms/identity/SAIdInput';

<SAIdInput
  value={idNumber}
  onChange={(value, validation) => {
    setIdNumber(value);
    if (validation.isValid) {
      console.log('Age:', validation.details?.age);
      console.log('Gender:', validation.details?.gender);
    }
  }}
  showDetails={true}
  label="South African ID Number"
/>
```

**Features:**
- ✅ Real-time Luhn algorithm validation
- ✅ Automatic age calculation
- ✅ Gender extraction (0-4 = Female, 5-9 = Male)
- ✅ Citizenship status detection
- ✅ Date of birth extraction and validation
- ✅ Formatted display (123456 7890 123)

#### PhoneInput
```tsx
import { PhoneInput } from '@/components/forms/identity/PhoneInput';

<PhoneInput
  value={phone}
  onChange={(value, validation) => {
    setPhone(value);
    console.log('Type:', validation.type); // 'Mobile' or 'Landline'
  }}
  showType={true}
  label="Phone Number"
/>
```

**Features:**
- ✅ SA phone number format validation
- ✅ Automatic formatting (+27 82 123 4567)
- ✅ Mobile vs Landline detection
- ✅ Multiple input formats supported
- ✅ Real-time validation feedback

#### AddressInput
```tsx
import { AddressInput } from '@/components/forms/identity/AddressInput';

<AddressInput
  value={address}
  onChange={setAddress}
  label="Residential Address"
/>
```

**Features:**
- ✅ Complete SA address structure
- ✅ Province dropdown (all 9 provinces)
- ✅ Postal code validation (4-digit format)
- ✅ Address preview generation
- ✅ Responsive grid layout

### Business Components

#### CompanyRegistrationInput
```tsx
import { CompanyRegistrationInput } from '@/components/forms/business/CompanyRegistrationInput';

<CompanyRegistrationInput
  value={companyReg}
  onChange={(value, validation) => {
    setCompanyReg(value);
    console.log('Company Type:', validation.type);
  }}
  showType={true}
/>
```

**Features:**
- ✅ Close Corporation (CK) validation
- ✅ Private Company (Pty Ltd) validation
- ✅ Public Company (Ltd) validation
- ✅ Automatic company type detection
- ✅ Format examples and guidance

#### VATInput
```tsx
import { VATInput } from '@/components/forms/business/VATInput';

<VATInput
  value={vatNumber}
  onChange={(value, validation) => {
    setVatNumber(value);
  }}
  label="VAT Registration Number"
/>
```

**Features:**
- ✅ 10-digit VAT number validation
- ✅ SARS format compliance
- ✅ Checksum validation
- ✅ Real-time feedback

### Advanced Components

#### DatePicker
```tsx
import { DatePicker } from '@/components/forms/advanced/DatePicker';

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  label="Appointment Date"
  showTime={true}
  minDate={new Date()}
  maxDate={new Date(2025, 11, 31)}
/>
```

**Features:**
- ✅ Custom calendar interface
- ✅ Time selection support
- ✅ Date range restrictions
- ✅ South African date formatting
- ✅ Keyboard navigation
- ✅ Responsive design

## 🔧 Validation Library

The validation library (`src/lib/utils/validation.ts`) provides comprehensive validation functions:

```tsx
import {
  validateSAIdNumber,
  validateSAPhoneNumber,
  validateSAPostalCode,
  validateSACompanyNumber,
  validateSAVATNumber,
  validateEmail,
  formatSAIdNumber,
  formatSAPhoneNumber
} from '@/lib/utils/validation';

// ID Number validation
const idValidation = validateSAIdNumber('9001014800088');
if (idValidation.isValid) {
  console.log('Age:', idValidation.details?.age);
  console.log('Gender:', idValidation.details?.gender);
}

// Phone number validation
const phoneValidation = validateSAPhoneNumber('0821234567');
console.log('Formatted:', phoneValidation.formatted); // +27 82 123 4567
```

## 🎨 Styling & Theming

All components use the neumorphic design system with CSS custom properties:

```css
/* Neumorphic variables used throughout */
--neumorphic-spacing-sm: 0.5rem;
--neumorphic-spacing-md: 0.75rem;
--neumorphic-radius-md: 0.75rem;
--neumorphic-radius-lg: 1rem;
```

### Component Classes
- `neumorphic-input-enhanced` - Enhanced input styling
- `neumorphic-card` - Card container styling
- `neumorphic-button-enhanced` - Button styling
- `text-neumorphic-text-primary` - Primary text color
- `text-neumorphic-text-secondary` - Secondary text color

## 📱 Responsive Design

All components are fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interfaces
- Proper spacing on all devices

## ♿ Accessibility Features

- **ARIA Labels**: All inputs have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Semantic HTML structure
- **Error Announcements**: Validation errors are announced

## 🧪 Testing Examples

### Valid Test Data

```tsx
// Valid SA ID Numbers for testing
const validIds = [
  '9001014800088', // Male, born 1990-01-01
  '0001014800089', // Female, born 2000-01-01
];

// Valid phone numbers
const validPhones = [
  '0821234567',     // Mobile
  '+27821234567',   // International mobile
  '0112345678',     // Landline
];

// Valid company registrations
const validCompanies = [
  '2023/123456/07', // Private Company
  'CK2023/123456',  // Close Corporation
];
```

## 🚀 Getting Started

1. **Import the components you need:**
```tsx
import { SAIdInput, PhoneInput, AddressInput } from '@/components/forms';
```

2. **Use in your forms:**
```tsx
function VettingForm() {
  const [formData, setFormData] = useState({
    idNumber: '',
    phone: '',
    address: null,
  });

  return (
    <form>
      <SAIdInput
        value={formData.idNumber}
        onChange={(value) => setFormData(prev => ({ ...prev, idNumber: value }))}
      />
      {/* Add other components */}
    </form>
  );
}
```

3. **View the demo:**
Navigate to `/dashboard` to see all components in action with the `FormComponentsDemo`.

## 🔄 Integration with Existing Systems

### Data Format Compatibility
- All components return standardized data formats
- Validation results include detailed information
- Easy integration with form libraries (React Hook Form, Formik)
- TypeScript support throughout

### API Integration
```tsx
// Example: Submitting form data
const submitVettingForm = async (formData) => {
  const payload = {
    identity: {
      idNumber: formData.idNumber,
      phone: formData.phone,
      address: formData.address,
    },
    business: {
      companyRegistration: formData.companyReg,
      vatNumber: formData.vatNumber,
    }
  };
  
  await api.post('/vetting/submit', payload);
};
```

## 🎯 Use Cases

Perfect for:
- **Vetting Applications** - Complete identity verification
- **KYC/AML Compliance** - Know Your Customer processes
- **Employee Onboarding** - Staff verification systems
- **Supplier Registration** - Vendor verification
- **Financial Applications** - Banking and insurance forms
- **Government Systems** - Civic service applications

## 🛡️ Security Considerations

- **Client-side validation only** - Always validate on server
- **No sensitive data storage** - Components don't persist data
- **Input sanitization** - All inputs are cleaned and validated
- **GDPR/POPIA compliance** - Designed with privacy in mind

## 📈 Performance

- **Lightweight** - Minimal bundle impact
- **Tree-shakeable** - Import only what you need
- **Optimized rendering** - React.memo and useCallback where appropriate
- **Lazy loading** - Components load on demand

## 🔮 Future Enhancements

- **Biometric integration** - Fingerprint/face verification
- **Document scanning** - ID document OCR
- **Address validation** - Integration with postal services
- **Credit bureau integration** - Real-time credit checks
- **Multi-language support** - Afrikaans, Zulu, Xhosa, etc.

---

## 📞 Support & Documentation

For additional help or feature requests, refer to the main project documentation or create an issue in the project repository.

**Component Status**: ✅ Production Ready  
**Last Updated**: December 2024  
**Version**: 1.0.0 