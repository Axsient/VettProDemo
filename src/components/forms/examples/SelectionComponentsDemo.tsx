"use client";

import React, { useState } from 'react';
// Using div elements with neumorphic styling instead of Card components
import { 
  NeumorphicRadioGroup,
  NeumorphicCheckbox,
  NeumorphicCheckboxGroup,
  NeumorphicSelect,
  NeumorphicMultiSelect,
  type RadioOption,
  type SelectOption,
  type MultiSelectOption
} from '../selection';

const SelectionComponentsDemo: React.FC = () => {
  // Radio Group State
  const [applicantType, setApplicantType] = useState<string>('');
  const [verificationLevel, setVerificationLevel] = useState<string>('');

  // Checkbox States
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [documentsRequired, setDocumentsRequired] = useState<string[]>([]);

  // Select States
  const [province, setProvince] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');

  // Multi-Select States
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Data for components
  const applicantTypeOptions: RadioOption[] = [
    { value: 'individual', label: 'Individual', description: 'Personal vetting for an individual' },
    { value: 'employee', label: 'Employee', description: 'Staff member vetting' },
    { value: 'contractor', label: 'Contractor', description: 'Independent contractor vetting' },
    { value: 'supplier', label: 'Supplier', description: 'Business supplier vetting' }
  ];

  const verificationLevelOptions: RadioOption[] = [
    { value: 'basic', label: 'Basic Verification', description: 'ID and address verification only' },
    { value: 'standard', label: 'Standard Verification', description: 'Includes criminal background check' },
    { value: 'enhanced', label: 'Enhanced Verification', description: 'Full background, credit, and reference checks' },
    { value: 'executive', label: 'Executive Verification', description: 'Comprehensive verification for senior positions' }
  ];

  const documentOptions = [
    { value: 'id_copy', label: 'ID Document Copy' },
    { value: 'proof_of_address', label: 'Proof of Address' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'payslip', label: 'Recent Payslip' },
    { value: 'cv', label: 'Curriculum Vitae' },
    { value: 'qualifications', label: 'Qualification Certificates' }
  ];

  const provinceOptions: SelectOption[] = [
    { value: 'GP', label: 'Gauteng', description: 'Johannesburg, Pretoria' },
    { value: 'WC', label: 'Western Cape', description: 'Cape Town, Stellenbosch' },
    { value: 'KZN', label: 'KwaZulu-Natal', description: 'Durban, Pietermaritzburg' },
    { value: 'EC', label: 'Eastern Cape', description: 'Port Elizabeth, East London' },
    { value: 'FS', label: 'Free State', description: 'Bloemfontein, Welkom' },
    { value: 'LP', label: 'Limpopo', description: 'Polokwane, Tzaneen' },
    { value: 'MP', label: 'Mpumalanga', description: 'Nelspruit, Witbank' },
    { value: 'NW', label: 'North West', description: 'Mahikeng, Rustenburg' },
    { value: 'NC', label: 'Northern Cape', description: 'Kimberley, Upington' }
  ];

  const industryOptions: SelectOption[] = [
    { value: 'financial', label: 'Financial Services', group: 'Corporate' },
    { value: 'healthcare', label: 'Healthcare', group: 'Essential Services' },
    { value: 'education', label: 'Education', group: 'Essential Services' },
    { value: 'technology', label: 'Technology', group: 'Corporate' },
    { value: 'manufacturing', label: 'Manufacturing', group: 'Industrial' },
    { value: 'mining', label: 'Mining', group: 'Industrial' },
    { value: 'retail', label: 'Retail', group: 'Commercial' },
    { value: 'hospitality', label: 'Hospitality', group: 'Commercial' },
    { value: 'construction', label: 'Construction', group: 'Industrial' },
    { value: 'transport', label: 'Transport & Logistics', group: 'Commercial' }
  ];

  const languageOptions: MultiSelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'af', label: 'Afrikaans' },
    { value: 'zu', label: 'isiZulu' },
    { value: 'xh', label: 'isiXhosa' },
    { value: 'st', label: 'Sesotho' },
    { value: 'tn', label: 'Setswana' },
    { value: 've', label: 'Tshivenda' },
    { value: 'ts', label: 'Xitsonga' },
    { value: 'ss', label: 'siSwati' },
    { value: 'nr', label: 'isiNdebele' },
    { value: 'nso', label: 'Sepedi' }
  ];

  const skillOptions: MultiSelectOption[] = [
    { value: 'leadership', label: 'Leadership', group: 'Management' },
    { value: 'project_management', label: 'Project Management', group: 'Management' },
    { value: 'team_management', label: 'Team Management', group: 'Management' },
    { value: 'programming', label: 'Programming', group: 'Technical' },
    { value: 'data_analysis', label: 'Data Analysis', group: 'Technical' },
    { value: 'cybersecurity', label: 'Cybersecurity', group: 'Technical' },
    { value: 'sales', label: 'Sales', group: 'Commercial' },
    { value: 'marketing', label: 'Marketing', group: 'Commercial' },
    { value: 'customer_service', label: 'Customer Service', group: 'Commercial' },
    { value: 'accounting', label: 'Accounting', group: 'Finance' },
    { value: 'auditing', label: 'Auditing', group: 'Finance' },
    { value: 'risk_management', label: 'Risk Management', group: 'Finance' }
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neumorphic-text-primary mb-2">
          Selection Components Demo
        </h1>
        <p className="text-neumorphic-text-secondary">
          Comprehensive selection components for the South African vetting system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radio Groups */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neumorphic-text-primary mb-2">Radio Button Groups</h2>
            <p className="text-neumorphic-text-secondary">Single selection from multiple options</p>
          </div>
          <div className="space-y-6">
            <NeumorphicRadioGroup
              label="Applicant Type"
              name="applicant_type"
              options={applicantTypeOptions}
              value={applicantType}
              onChange={setApplicantType}
              required
            />

            <NeumorphicRadioGroup
              label="Verification Level"
              name="verification_level"
              options={verificationLevelOptions}
              value={verificationLevel}
              onChange={setVerificationLevel}
              orientation="vertical"
              size="sm"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neumorphic-text-primary mb-2">Checkboxes</h2>
            <p className="text-neumorphic-text-secondary">Multiple selections and boolean options</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <NeumorphicCheckbox
                label="I agree to the terms and conditions"
                description="Required to proceed with the vetting process"
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
                required
              />

              <NeumorphicCheckbox
                label="Subscribe to newsletter"
                description="Receive updates about vetting processes and compliance"
                checked={wantsNewsletter}
                onChange={setWantsNewsletter}
              />

              <NeumorphicCheckbox
                label="Has valid driver&apos;s license"
                description="Required for certain positions"
                checked={hasDriversLicense}
                onChange={setHasDriversLicense}
                size="lg"
              />
            </div>

            <NeumorphicCheckboxGroup
              label="Required Documents"
              options={documentOptions}
              value={documentsRequired}
              onChange={setDocumentsRequired}
              minSelections={2}
              maxSelections={4}
            />
          </div>
        </div>

        {/* Select Dropdowns */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neumorphic-text-primary mb-2">Select Dropdowns</h2>
            <p className="text-neumorphic-text-secondary">Single selection with search and grouping</p>
          </div>
          <div className="space-y-6">
            <NeumorphicSelect
              label="Province"
              placeholder="Select your province..."
              options={provinceOptions}
              value={province}
              onChange={(value) => setProvince(value || '')}
              searchable
              clearable
              required
            />

            <NeumorphicSelect
              label="Industry Sector"
              placeholder="Choose your industry..."
              options={industryOptions}
              value={industry}
              onChange={(value) => setIndustry(value || '')}
              searchable
              clearable
              size="lg"
            />
          </div>
        </div>

        {/* Multi-Select */}
        <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neumorphic-text-primary mb-2">Multi-Select Dropdowns</h2>
            <p className="text-neumorphic-text-secondary">Multiple selections with constraints</p>
          </div>
          <div className="space-y-6">
            <NeumorphicMultiSelect
              label="Languages Spoken"
              placeholder="Select languages..."
              options={languageOptions}
              value={languages}
              onChange={setLanguages}
              searchable
              clearable
              showSelectAll
              maxSelections={5}
              minSelections={1}
              required
            />

            <NeumorphicMultiSelect
              label="Professional Skills"
              placeholder="Choose your skills..."
              options={skillOptions}
              value={skills}
              onChange={setSkills}
              searchable
              clearable
              showSelectAll
              maxSelections={8}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="neumorphic-card p-6 rounded-[var(--neumorphic-radius-lg)]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neumorphic-text-primary mb-2">Form Summary</h2>
          <p className="text-neumorphic-text-secondary">Current selections and form state</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Radio Selections</h4>
            <p>Applicant Type: <span className="text-purple-600">{applicantType || 'None'}</span></p>
            <p>Verification Level: <span className="text-purple-600">{verificationLevel || 'None'}</span></p>
          </div>
          
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Checkboxes</h4>
            <p>Terms Agreed: <span className="text-purple-600">{agreedToTerms ? 'Yes' : 'No'}</span></p>
            <p>Newsletter: <span className="text-purple-600">{wantsNewsletter ? 'Yes' : 'No'}</span></p>
            <p>Driver&apos;s License: <span className="text-purple-600">{hasDriversLicense ? 'Yes' : 'No'}</span></p>
            <p>Documents: <span className="text-purple-600">{documentsRequired.length} selected</span></p>
          </div>
          
          <div>
            <h4 className="font-medium text-neumorphic-text-primary mb-2">Dropdowns</h4>
            <p>Province: <span className="text-purple-600">{province || 'None'}</span></p>
            <p>Industry: <span className="text-purple-600">{industry || 'None'}</span></p>
            <p>Languages: <span className="text-purple-600">{languages.length} selected</span></p>
            <p>Skills: <span className="text-purple-600">{skills.length} selected</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionComponentsDemo; 