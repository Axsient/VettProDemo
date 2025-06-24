/**
 * South African Validation Utilities
 * Comprehensive validation functions for SA-specific data formats
 */

// South African ID Number Validation using Luhn Algorithm
export function validateSAIdNumber(idNumber: string): {
  isValid: boolean;
  details?: {
    dateOfBirth: Date;
    gender: 'Male' | 'Female';
    citizenship: 'SA Citizen' | 'Permanent Resident';
    age: number;
  };
  error?: string;
} {
  // Remove any spaces or non-numeric characters
  const cleanId = idNumber.replace(/\D/g, '');
  
  // Check if it's exactly 13 digits
  if (cleanId.length !== 13) {
    return { isValid: false, error: 'ID number must be exactly 13 digits' };
  }

  // Extract date of birth (YYMMDD)
  const year = parseInt(cleanId.substring(0, 2));
  const month = parseInt(cleanId.substring(2, 4));
  const day = parseInt(cleanId.substring(4, 6));
  
  // Determine century (if year > 21, assume 1900s, else 2000s)
  const fullYear = year > 21 ? 1900 + year : 2000 + year;
  
  // Validate date
  const dateOfBirth = new Date(fullYear, month - 1, day);
  if (
    dateOfBirth.getFullYear() !== fullYear ||
    dateOfBirth.getMonth() !== month - 1 ||
    dateOfBirth.getDate() !== day ||
    month < 1 || month > 12 ||
    day < 1 || day > 31
  ) {
    return { isValid: false, error: 'Invalid date of birth in ID number' };
  }

  // Check if date is not in the future
  if (dateOfBirth > new Date()) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Extract gender (7th digit: 0-4 = Female, 5-9 = Male)
  const genderDigit = parseInt(cleanId.substring(6, 7));
  const gender = genderDigit < 5 ? 'Female' : 'Male';

  // Extract citizenship (11th digit: 0 = SA Citizen, 1 = Permanent Resident)
  const citizenshipDigit = parseInt(cleanId.substring(10, 11));
  const citizenship = citizenshipDigit === 0 ? 'SA Citizen' : 'Permanent Resident';

  // Validate using Luhn Algorithm
  const digits = cleanId.split('').map(Number);
  
  // Sum odd-positioned digits (1st, 3rd, 5th, etc.)
  let oddSum = 0;
  for (let i = 0; i < 12; i += 2) {
    oddSum += digits[i];
  }

  // Concatenate even-positioned digits and double the result
  let evenDigits = '';
  for (let i = 1; i < 12; i += 2) {
    evenDigits += digits[i];
  }
  const doubledEven = (parseInt(evenDigits) * 2).toString();
  
  // Sum the digits of the doubled even number
  let evenSum = 0;
  for (const digit of doubledEven) {
    evenSum += parseInt(digit);
  }

  // Calculate checksum
  const total = oddSum + evenSum;
  const calculatedChecksum = (10 - (total % 10)) % 10;
  const actualChecksum = digits[12];

  if (calculatedChecksum !== actualChecksum) {
    return { isValid: false, error: 'Invalid checksum - ID number is not valid' };
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return {
    isValid: true,
    details: {
      dateOfBirth,
      gender,
      citizenship,
      age,
    },
  };
}

// South African Phone Number Validation
export function validateSAPhoneNumber(phone: string): {
  isValid: boolean;
  formatted?: string;
  type?: 'Mobile' | 'Landline';
  error?: string;
} {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check various SA phone number formats
  if (cleanPhone.length === 10) {
    // Local format: 0123456789
    if (cleanPhone.startsWith('0')) {
      const areaCode = cleanPhone.substring(1, 3);
      const isMobile = ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89'].includes(areaCode);
      
      return {
        isValid: true,
        formatted: `+27 ${cleanPhone.substring(1, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`,
        type: isMobile ? 'Mobile' : 'Landline',
      };
    }
  } else if (cleanPhone.length === 11) {
    // International format without +: 27123456789
    if (cleanPhone.startsWith('27')) {
      const localPart = cleanPhone.substring(2);
      const areaCode = localPart.substring(0, 2);
      const isMobile = ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89'].includes(areaCode);
      
      return {
        isValid: true,
        formatted: `+27 ${areaCode} ${localPart.substring(2, 5)} ${localPart.substring(5)}`,
        type: isMobile ? 'Mobile' : 'Landline',
      };
    }
  }

  return { isValid: false, error: 'Invalid South African phone number format' };
}

// Email Validation (enhanced)
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

// South African Postal Code Validation
export function validateSAPostalCode(postalCode: string): {
  isValid: boolean;
  error?: string;
} {
  const cleanCode = postalCode.replace(/\D/g, '');
  
  if (cleanCode.length !== 4) {
    return { isValid: false, error: 'South African postal codes must be 4 digits' };
  }

  const code = parseInt(cleanCode);
  if (code < 1000 || code > 9999) {
    return { isValid: false, error: 'Invalid postal code range' };
  }

  return { isValid: true };
}

// Company Registration Number Validation (CK/CC numbers)
export function validateSACompanyNumber(regNumber: string): {
  isValid: boolean;
  type?: 'Close Corporation' | 'Private Company' | 'Public Company';
  error?: string;
} {
  const cleanReg = regNumber.replace(/\s/g, '').toUpperCase();
  
  // Close Corporation: CK followed by year and sequential number
  if (cleanReg.match(/^CK\d{4}\/\d{6}$/)) {
    return { isValid: true, type: 'Close Corporation' };
  }
  
  // Private Company: year/sequential number/07
  if (cleanReg.match(/^\d{4}\/\d{6}\/07$/)) {
    return { isValid: true, type: 'Private Company' };
  }
  
  // Public Company: year/sequential number/06
  if (cleanReg.match(/^\d{4}\/\d{6}\/06$/)) {
    return { isValid: true, type: 'Public Company' };
  }

  return { isValid: false, error: 'Invalid South African company registration format' };
}

// VAT Number Validation
export function validateSAVATNumber(vatNumber: string): {
  isValid: boolean;
  error?: string;
} {
  const cleanVAT = vatNumber.replace(/\D/g, '');
  
  if (cleanVAT.length !== 10) {
    return { isValid: false, error: 'SA VAT numbers must be 10 digits' };
  }

  // Basic format check (more complex validation would require SARS API)
  if (!cleanVAT.startsWith('4')) {
    return { isValid: false, error: 'SA VAT numbers typically start with 4' };
  }

  return { isValid: true };
}

// Bank Account Number Validation (basic format checking)
export function validateSABankAccount(accountNumber: string): {
  isValid: boolean;
  error?: string;
} {
  const cleanAccount = accountNumber.replace(/\D/g, '');
  
  if (cleanAccount.length < 8 || cleanAccount.length > 11) {
    return { isValid: false, error: 'SA bank account numbers are typically 8-11 digits' };
  }

  // Additional validation could be added based on specific bank formats
  return { isValid: true };
}

// Utility function to format ID number for display
export function formatSAIdNumber(idNumber: string): string {
  const clean = idNumber.replace(/\D/g, '');
  if (clean.length === 13) {
    return `${clean.substring(0, 6)} ${clean.substring(6, 10)} ${clean.substring(10, 13)}`;
  }
  return idNumber;
}

// Utility function to format phone number
export function formatSAPhoneNumber(phone: string): string {
  const validation = validateSAPhoneNumber(phone);
  return validation.formatted || phone;
} 