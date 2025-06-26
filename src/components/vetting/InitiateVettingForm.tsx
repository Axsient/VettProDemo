'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  VettingCheckDefinition, 
  VettingPackage, 
  MiningProject, 
  VettingEntityType,
  CheckCategory,
  VettingSubmission,
  IndividualDetails,
  CompanyDetails,
  StaffMedicalDetails
} from '@/types/vetting';
import { 
  getChecksByEntityType, 
  getPackagesByEntityType, 
  calculateTotalCost, 
  calculateMaxTurnaround,
  getChecksInPackage 
} from '@/lib/sample-data/vettingChecksSample';

// UI Components
import { 
  NeumorphicCard, 
  NeumorphicInput,
  NeumorphicBadge,
  NeumorphicText,
  NeumorphicHeading
} from '@/components/ui/neumorphic';
import { NeumorphicSelect } from '@/components/forms/selection/NeumorphicSelect';
import { NeumorphicCheckbox } from '@/components/forms/selection/NeumorphicCheckbox';
import { Button } from '@/components/ui/button';

// Form Components
import { SAIdInput } from '@/components/forms/identity/SAIdInput';
import { PhoneInput } from '@/components/forms/identity/PhoneInput';
import { CompanyRegistrationInput } from '@/components/forms/business/CompanyRegistrationInput';
import { VATInput } from '@/components/forms/business/VATInput';

// Icons
import { User, Building2, Stethoscope, Package, CheckSquare, Clock, DollarSign, AlertCircle, Check } from 'lucide-react';

interface InitiateVettingFormProps {
  checks: VettingCheckDefinition[];
  packages: VettingPackage[];
  projects: MiningProject[];
  categories: CheckCategory[];
  entityTypes: VettingEntityType[];
}

// Helper component for labeled input
const LabeledInput = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-neumorphic-text-primary mb-2 block">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

export function InitiateVettingForm({ 
  checks, // eslint-disable-line @typescript-eslint/no-unused-vars
  packages, 
  projects
}: InitiateVettingFormProps) {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [entityType, setEntityType] = useState<VettingEntityType | ''>('');
  const [selectionType, setSelectionType] = useState<'package' | 'individual'>('package');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [preAuthConfirmed, setPreAuthConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Entity details state
  const [individualDetails, setIndividualDetails] = useState<Partial<IndividualDetails>>({});
  const [companyDetails, setCompanyDetails] = useState<Partial<CompanyDetails>>({});
  const [staffMedicalDetails, setStaffMedicalDetails] = useState<Partial<StaffMedicalDetails>>({});

  // Filtered data based on entity type
  const [availableChecks, setAvailableChecks] = useState<VettingCheckDefinition[]>([]);
  const [availablePackages, setAvailablePackages] = useState<VettingPackage[]>([]);

  // Constants (for future use in address forms)
  // const saProvinces = [
  //   'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  //   'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  // ];

  const commonNationalities = [
    'South African', 'Zimbabwean', 'Botswanan', 'Namibian', 'Mozambican',
    'Zambian', 'Malawian', 'Lesotho', 'Swazi', 'Other'
  ];

  // Update available checks and packages when entity type changes
  useEffect(() => {
    if (entityType) {
      setAvailableChecks(getChecksByEntityType(entityType));
      setAvailablePackages(getPackagesByEntityType(entityType));
      // Reset selections when entity type changes
      setSelectedPackage('');
      setSelectedChecks([]);
    }
  }, [entityType]);

  // Calculate total cost and turnaround (helper function for future use)
  // const getCurrentChecks = () => {
  //   if (selectionType === 'package' && selectedPackage) {
  //     const pkg = packages.find(p => p.id === selectedPackage);
  //     return pkg ? getChecksInPackage(selectedPackage) : [];
  //   }
  //   return checks.filter(check => selectedChecks.includes(check.id));
  // };

  const totalCost = selectionType === 'package' && selectedPackage 
    ? packages.find(p => p.id === selectedPackage)?.totalEstimatedCostZAR || 0
    : calculateTotalCost(selectedChecks);

  const totalTurnaround = selectionType === 'package' && selectedPackage
    ? packages.find(p => p.id === selectedPackage)?.totalEstimatedTurnaroundDays || 0
    : calculateMaxTurnaround(selectedChecks);

  // Validation functions
  const validateStep1 = () => entityType !== '';
  
  const validateStep2 = () => {
    if (entityType === VettingEntityType.INDIVIDUAL || entityType === VettingEntityType.STAFF_MEDICAL) {
      const details = entityType === VettingEntityType.STAFF_MEDICAL ? staffMedicalDetails : individualDetails;
      return details.firstName && details.lastName && details.mobileNumber && 
             (details.idNumber || details.passportNumber);
    } else if (entityType === VettingEntityType.COMPANY) {
      return companyDetails.companyName && companyDetails.registrationNumber;
    }
    return false;
  };

  const validateStep3 = () => {
    return (selectionType === 'package' && selectedPackage) || 
           (selectionType === 'individual' && selectedChecks.length > 0);
  };

  const validateStep4 = () => preAuthConfirmed;

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep4()) {
      toast.error('Please confirm pre-authorization before submitting.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const entityDetails = entityType === VettingEntityType.INDIVIDUAL ? individualDetails :
                           entityType === VettingEntityType.COMPANY ? companyDetails :
                           staffMedicalDetails;

      const submission: VettingSubmission = {
        entityType: entityType as VettingEntityType,
        entityDetails: entityDetails as IndividualDetails | CompanyDetails | StaffMedicalDetails,
        selectionType,
        selectedPackage: selectionType === 'package' ? selectedPackage : undefined,
        selectedChecks: selectionType === 'individual' ? selectedChecks : undefined,
        priority: 'Medium',
        preAuthorizationConfirmed: preAuthConfirmed
      };

      // Log submission for demo
      console.log('Vetting submission:', submission);
      
      const subjectName = entityType === VettingEntityType.COMPANY 
        ? companyDetails.companyName 
        : `${individualDetails.firstName || staffMedicalDetails.firstName} ${individualDetails.lastName || staffMedicalDetails.lastName}`;
      
      const contactInfo = entityType === VettingEntityType.COMPANY
        ? companyDetails.primaryContactMobile || companyDetails.primaryContactEmail
        : individualDetails.mobileNumber || staffMedicalDetails.mobileNumber;

      toast.success(
        `Vetting process initiated for ${subjectName}. Consent request sent to ${contactInfo}. Case reference: VET-${Date.now().toString().slice(-6)}`
      );

      // Reset form
      setCurrentStep(1);
      setEntityType('');
      setSelectedPackage('');
      setSelectedChecks([]);
      setPreAuthConfirmed(false);
      setIndividualDetails({});
      setCompanyDetails({});
      setStaffMedicalDetails({});

    } catch (error) {
      toast.error('Failed to initiate vetting process. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual check selection
  const toggleCheck = (checkId: string) => {
    setSelectedChecks(prev => 
      prev.includes(checkId) 
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Group checks by category for better organization
  const checksByCategory = availableChecks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<CheckCategory, VettingCheckDefinition[]>);

  return (
    <NeumorphicCard className="p-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`h-1 w-16 mx-2 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <NeumorphicText variant="secondary" size="sm">Entity Type</NeumorphicText>
          <NeumorphicText variant="secondary" size="sm">Details</NeumorphicText>
          <NeumorphicText variant="secondary" size="sm">Checks</NeumorphicText>
          <NeumorphicText variant="secondary" size="sm">Submit</NeumorphicText>
        </div>
      </div>

      {/* Step 1: Entity Type Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <NeumorphicHeading className="mb-2">Select Vetting Entity Type</NeumorphicHeading>
            <NeumorphicText variant="primary" className="mb-6 opacity-80">
              Choose the type of entity you want to perform vetting on.
            </NeumorphicText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                value: VettingEntityType.INDIVIDUAL,
                label: "Individual",
                description: "Personal vetting for contractors, consultants, or individual verification",
                icon: <User className="w-6 h-6 text-primary" />
              },
              {
                value: VettingEntityType.COMPANY,
                label: "Company/Supplier", 
                description: "Business verification for suppliers, vendors, and corporate entities",
                icon: <Building2 className="w-6 h-6 text-primary" />
              },
              {
                value: VettingEntityType.STAFF_MEDICAL,
                label: "Staff Medical",
                description: "Medical clearance and health checks for mining/industrial staff", 
                icon: <Stethoscope className="w-6 h-6 text-primary" />
              }
            ].map((option) => (
              <NeumorphicCard 
                key={option.value}
                className={`p-6 cursor-pointer transition-all ${
                  entityType === option.value ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                }`}
                onClick={() => setEntityType(option.value)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="entityType"
                    value={option.value}
                    checked={entityType === option.value}
                    onChange={() => setEntityType(option.value)}
                    className="mt-1"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    {option.icon}
                    <div>
                      <NeumorphicText className="font-medium">{option.label}</NeumorphicText>
                      <NeumorphicText variant="secondary" size="sm">
                        {option.description}
                      </NeumorphicText>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Entity Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <NeumorphicHeading className="mb-2">Entity Details</NeumorphicHeading>
            <NeumorphicText variant="primary" className="mb-6 opacity-80">
              Provide the required information for the selected entity type.
            </NeumorphicText>
          </div>

          {/* Individual Details Form */}
          {entityType === VettingEntityType.INDIVIDUAL && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LabeledInput label="First Name" required>
                <NeumorphicInput
                  value={individualDetails.firstName || ''}
                  onChange={(e) => setIndividualDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </LabeledInput>
              
              <LabeledInput label="Last Name" required>
                <NeumorphicInput
                  value={individualDetails.lastName || ''}
                  onChange={(e) => setIndividualDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </LabeledInput>

              <SAIdInput
                value={individualDetails.idNumber || ''}
                onChange={(value) => setIndividualDetails(prev => ({ ...prev, idNumber: value }))}
                placeholder="Enter SA ID number"
              />

              <LabeledInput label="Passport Number (Non-SA)">
                <NeumorphicInput
                  value={individualDetails.passportNumber || ''}
                  onChange={(e) => setIndividualDetails(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="Enter passport number"
                />
              </LabeledInput>

              <NeumorphicSelect
                label="Nationality"
                value={individualDetails.nationality || ''}
                onChange={(value) => setIndividualDetails(prev => ({ ...prev, nationality: value }))}
                options={commonNationalities.map(nat => ({ value: nat, label: nat }))}
                placeholder="Select nationality"
              />

              <PhoneInput
                value={individualDetails.mobileNumber || ''}
                onChange={(value) => setIndividualDetails(prev => ({ ...prev, mobileNumber: value }))}
                required
                placeholder="Enter mobile number"
              />

              <LabeledInput label="Email Address (Optional)">
                <NeumorphicInput
                  type="email"
                  value={individualDetails.emailAddress || ''}
                  onChange={(e) => setIndividualDetails(prev => ({ ...prev, emailAddress: e.target.value }))}
                  placeholder="Enter email address"
                />
              </LabeledInput>
            </div>
          )}

          {/* Company Details Form */}
          {entityType === VettingEntityType.COMPANY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <LabeledInput label="Company Name" required>
                  <NeumorphicInput
                    value={companyDetails.companyName || ''}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </LabeledInput>
              </div>

              <CompanyRegistrationInput
                value={companyDetails.registrationNumber || ''}
                onChange={(value) => setCompanyDetails(prev => ({ ...prev, registrationNumber: value }))}
                required
                placeholder="Enter registration number"
              />

              <VATInput
                value={companyDetails.vatNumber || ''}
                onChange={(value) => setCompanyDetails(prev => ({ ...prev, vatNumber: value }))}
                placeholder="Enter VAT number"
              />

              <LabeledInput label="Primary Contact Name">
                <NeumorphicInput
                  value={companyDetails.primaryContactName || ''}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, primaryContactName: e.target.value }))}
                  placeholder="Enter contact person name"
                />
              </LabeledInput>

              <PhoneInput
                value={companyDetails.primaryContactMobile || ''}
                onChange={(value) => setCompanyDetails(prev => ({ ...prev, primaryContactMobile: value }))}
                placeholder="Enter contact mobile"
              />

              <div className="md:col-span-2">
                <LabeledInput label="Primary Contact Email">
                  <NeumorphicInput
                    type="email"
                    value={companyDetails.primaryContactEmail || ''}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, primaryContactEmail: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                </LabeledInput>
              </div>
            </div>
          )}

          {/* Staff Medical Details Form */}
          {entityType === VettingEntityType.STAFF_MEDICAL && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LabeledInput label="First Name" required>
                  <NeumorphicInput
                    value={staffMedicalDetails.firstName || ''}
                    onChange={(e) => setStaffMedicalDetails(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                </LabeledInput>
                
                <LabeledInput label="Last Name" required>
                  <NeumorphicInput
                    value={staffMedicalDetails.lastName || ''}
                    onChange={(e) => setStaffMedicalDetails(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </LabeledInput>

                <SAIdInput
                  value={staffMedicalDetails.idNumber || ''}
                  onChange={(value) => setStaffMedicalDetails(prev => ({ ...prev, idNumber: value }))}
                  placeholder="Enter SA ID number"
                />

                <PhoneInput
                  value={staffMedicalDetails.mobileNumber || ''}
                  onChange={(value) => setStaffMedicalDetails(prev => ({ ...prev, mobileNumber: value }))}
                  required
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="border-t border-neumorphic-border/20 my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NeumorphicSelect
                  label="Project Name"
                  value={staffMedicalDetails.projectId || ''}
                  onChange={(value) => setStaffMedicalDetails(prev => ({ ...prev, projectId: value }))}
                  options={projects.filter(p => p.status === 'Active').map(project => ({ 
                    value: project.id, 
                    label: `${project.name} - ${project.clientCompany}` 
                  }))}
                  required
                  placeholder="Select project"
                />

                <LabeledInput label="Staff/Employee ID">
                  <NeumorphicInput
                    value={staffMedicalDetails.staffEmployeeId || ''}
                    onChange={(e) => setStaffMedicalDetails(prev => ({ ...prev, staffEmployeeId: e.target.value }))}
                    placeholder="Enter employee ID"
                  />
                </LabeledInput>

                <LabeledInput label="Job Role/Title" required>
                  <NeumorphicInput
                    value={staffMedicalDetails.jobRole || ''}
                    onChange={(e) => setStaffMedicalDetails(prev => ({ ...prev, jobRole: e.target.value }))}
                    placeholder="Enter job role"
                  />
                </LabeledInput>

                <LabeledInput label="Department">
                  <NeumorphicInput
                    value={staffMedicalDetails.department || ''}
                    onChange={(e) => setStaffMedicalDetails(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
                </LabeledInput>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Select Checks/Package */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <NeumorphicHeading className="mb-2">Select Vetting Checks</NeumorphicHeading>
            <NeumorphicText variant="primary" className="mb-6 opacity-80">
              Choose a pre-defined package or select individual verification checks.
            </NeumorphicText>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: 'package',
                  label: 'Select Package',
                  description: 'Choose from pre-defined vetting packages',
                  icon: <Package className="w-4 h-4 text-primary" />
                },
                {
                  value: 'individual', 
                  label: 'Individual Checks',
                  description: 'Select specific verification checks',
                  icon: <CheckSquare className="w-4 h-4 text-primary" />
                }
              ].map((option) => (
                <NeumorphicCard 
                  key={option.value}
                  className={`p-4 cursor-pointer transition-all ${
                    selectionType === option.value ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectionType(option.value as 'package' | 'individual')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="selectionType"
                      value={option.value}
                      checked={selectionType === option.value}
                      onChange={() => setSelectionType(option.value as 'package' | 'individual')}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      {option.icon}
                      <div>
                        <NeumorphicText className="font-medium">{option.label}</NeumorphicText>
                        <NeumorphicText variant="secondary" size="sm">{option.description}</NeumorphicText>
                      </div>
                    </div>
                  </div>
                </NeumorphicCard>
              ))}
            </div>

            {/* Package Selection */}
            {selectionType === 'package' && (
              <div className="space-y-4">
                {availablePackages.map((pkg) => (
                  <NeumorphicCard 
                    key={pkg.id} 
                    className={`p-6 cursor-pointer transition-all ${
                      selectedPackage === pkg.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="package"
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <NeumorphicText className="font-medium">{pkg.name}</NeumorphicText>
                            {pkg.isPopular && <NeumorphicBadge variant="info">Popular</NeumorphicBadge>}
                          </div>
                          <NeumorphicText variant="secondary" size="sm" className="mt-1">{pkg.description}</NeumorphicText>
                          <div className="flex items-center space-x-4 mt-3 text-sm">
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <NeumorphicText size="sm">R{pkg.totalEstimatedCostZAR?.toLocaleString()}</NeumorphicText>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <NeumorphicText size="sm">{pkg.totalEstimatedTurnaroundDays} days</NeumorphicText>
                            </span>
                            <NeumorphicText variant="secondary" size="sm">
                              {pkg.checkIds.length} checks included
                            </NeumorphicText>
                          </div>
                        </div>
                      </div>
                      {pkg.discountPercentage && (
                        <NeumorphicBadge variant="success">
                          {pkg.discountPercentage}% off
                        </NeumorphicBadge>
                      )}
                    </div>
                    
                    {selectedPackage === pkg.id && (
                      <div className="mt-4 pt-4 border-t border-neumorphic-border/20">
                        <NeumorphicText className="font-medium mb-2">Included Checks:</NeumorphicText>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getChecksInPackage(pkg.id).map((check) => (
                            <NeumorphicText key={check.id} variant="secondary" size="sm">
                              • {check.name}
                            </NeumorphicText>
                          ))}
                        </div>
                      </div>
                    )}
                  </NeumorphicCard>
                ))}
              </div>
            )}

            {/* Individual Checks Selection */}
            {selectionType === 'individual' && (
              <div className="space-y-4">
                {Object.entries(checksByCategory).map(([category, categoryChecks]) => {
                  const isExpanded = expandedCategories[category] || false;
                  const toggleExpanded = () => {
                    setExpandedCategories(prev => ({
                      ...prev,
                      [category]: !isExpanded
                    }));
                  };
                  
                  return (
                    <NeumorphicCard key={category} className="p-4">
                      <button
                        onClick={toggleExpanded}
                        className="w-full text-left p-2 hover:bg-neumorphic-button/10 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <NeumorphicText className="font-medium">{category}</NeumorphicText>
                          <div className="flex items-center space-x-2">
                            <NeumorphicText variant="secondary" size="sm">
                              {categoryChecks.length} checks available
                            </NeumorphicText>
                            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="space-y-3 mt-3">
                          {categoryChecks.map((check) => (
                            <NeumorphicCard key={check.id} className="p-4">
                              <div className="flex items-start space-x-3">
                                <NeumorphicCheckbox
                                  checked={selectedChecks.includes(check.id)}
                                  onChange={() => toggleCheck(check.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <NeumorphicText className="font-medium">{check.name}</NeumorphicText>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <span className="flex items-center space-x-1">
                                        <DollarSign className="w-3 h-3" />
                                        <NeumorphicText size="sm">R{check.estimatedCostZAR}</NeumorphicText>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <NeumorphicText size="sm">{check.estimatedTurnaroundDays}d</NeumorphicText>
                                      </span>
                                      <NeumorphicBadge 
                                        variant={check.riskLevel === 'High' ? 'danger' : 
                                                 check.riskLevel === 'Medium' ? 'warning' : 'default'}
                                      >
                                        {check.riskLevel}
                                      </NeumorphicBadge>
                                    </div>
                                  </div>
                                  <NeumorphicText variant="secondary" size="sm" className="mt-1">
                                    {check.description}
                                  </NeumorphicText>
                                  <div className="flex items-center space-x-2 mt-2 text-xs">
                                    <NeumorphicText variant="secondary" size="sm">Provider: {check.provider}</NeumorphicText>
                                    {check.consentRequired && (
                                      <span className="flex items-center space-x-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <NeumorphicText variant="secondary" size="sm">Consent Required</NeumorphicText>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </NeumorphicCard>
                          ))}
                        </div>
                      )}
                    </NeumorphicCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cost Summary */}
          {((selectionType === 'package' && selectedPackage) || 
            (selectionType === 'individual' && selectedChecks.length > 0)) && (
            <NeumorphicCard className="p-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <NeumorphicText className="font-medium">Total Estimated Cost & Time</NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">
                    {selectionType === 'package' ? 'Package pricing' : `${selectedChecks.length} individual checks`}
                  </NeumorphicText>
                </div>
                <div className="text-right">
                  <NeumorphicText size="lg" className="font-semibold">R{totalCost.toLocaleString()}</NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">{totalTurnaround} days max</NeumorphicText>
                </div>
              </div>
            </NeumorphicCard>
          )}
        </div>
      )}

      {/* Step 4: Summary & Consent */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <NeumorphicHeading className="mb-2">Summary & Consent</NeumorphicHeading>
            <NeumorphicText variant="primary" className="mb-6 opacity-80">
              Review your selections and confirm authorization to proceed.
            </NeumorphicText>
          </div>

          {/* Summary */}
          <NeumorphicCard className="p-6">
            <NeumorphicText className="font-medium mb-4">Vetting Summary</NeumorphicText>
            
            <div className="space-y-4">
              <div>
                <NeumorphicText variant="secondary" size="sm">Entity Type:</NeumorphicText>
                <NeumorphicText className="font-medium">{entityType}</NeumorphicText>
              </div>

              <div>
                <NeumorphicText variant="secondary" size="sm">Subject:</NeumorphicText>
                <NeumorphicText className="font-medium">
                  {entityType === VettingEntityType.COMPANY 
                    ? companyDetails.companyName 
                    : `${individualDetails.firstName || staffMedicalDetails.firstName} ${individualDetails.lastName || staffMedicalDetails.lastName}`}
                </NeumorphicText>
              </div>

              <div>
                <NeumorphicText variant="secondary" size="sm">Contact Information:</NeumorphicText>
                <NeumorphicText className="font-medium">
                  {entityType === VettingEntityType.COMPANY
                    ? `${companyDetails.primaryContactMobile || companyDetails.primaryContactEmail}`
                    : `${individualDetails.mobileNumber || staffMedicalDetails.mobileNumber}`}
                </NeumorphicText>
              </div>

              {entityType === VettingEntityType.STAFF_MEDICAL && (
                <div>
                  <NeumorphicText variant="secondary" size="sm">Project:</NeumorphicText>
                  <NeumorphicText className="font-medium">
                    {projects.find(p => p.id === staffMedicalDetails.projectId)?.name}
                  </NeumorphicText>
                </div>
              )}

              <div>
                <NeumorphicText variant="secondary" size="sm">Selected Checks:</NeumorphicText>
                <NeumorphicText className="font-medium">
                  {selectionType === 'package' 
                    ? packages.find(p => p.id === selectedPackage)?.name
                    : `${selectedChecks.length} individual checks`}
                </NeumorphicText>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neumorphic-border/20">
                <NeumorphicText className="font-medium">Total Estimated Cost:</NeumorphicText>
                <NeumorphicText size="lg" className="font-semibold">R{totalCost.toLocaleString()}</NeumorphicText>
              </div>
              
              <div className="flex justify-between items-center">
                <NeumorphicText className="font-medium">Maximum Turnaround:</NeumorphicText>
                <NeumorphicText className="font-medium">{totalTurnaround} days</NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>

          {/* Consent Confirmation */}
          <NeumorphicCard className="p-6">
            <div className="flex items-start space-x-3">
              <NeumorphicCheckbox
                checked={preAuthConfirmed}
                onChange={setPreAuthConfirmed}
                required
              />
              <div>
                <NeumorphicText className="font-medium">Pre-Authorization Confirmation</NeumorphicText>
                <NeumorphicText variant="secondary" size="sm" className="mt-1">
                  I confirm that necessary pre-authorization/notification has been given to the subject 
                  for initiating this vetting process. I understand that consent requests will be sent 
                  for applicable checks.
                </NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="neumorphic-outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-3">
          {currentStep < 4 ? (
            <Button
              variant="neumorphic-outline"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !validateStep1()) ||
                (currentStep === 2 && !validateStep2()) ||
                (currentStep === 3 && !validateStep3())
              }
            >
              Next
            </Button>
          ) : (
            <Button
              variant="neumorphic-outline"
              onClick={handleSubmit}
              disabled={!validateStep4() || loading}
            >
              {loading ? 'Initiating...' : 'Initiate Vetting & Send Consent Request'}
            </Button>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
}