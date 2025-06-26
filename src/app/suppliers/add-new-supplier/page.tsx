"use client";

import React, { useState } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import { Input } from '@/components/ui/input';
import { CompanyRegistrationInput } from '@/components/forms/business/CompanyRegistrationInput';
import { PhoneInput } from '@/components/forms/identity/PhoneInput';
import { AddressInput } from '@/components/forms/identity/AddressInput';
import { NeumorphicSelect, SelectOption } from '@/components/forms/selection/NeumorphicSelect';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeftIcon, SaveIcon, BuildingIcon, UserIcon, MapPinIcon, FileTextIcon } from 'lucide-react';

const AddNewSupplierPage: React.FC = () => {
  const router = useRouter();
  
  // Form state
  const [supplierData, setSupplierData] = useState({
    name: '',
    registrationNumber: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    physicalAddress: { street: '', suburb: '', city: '', province: '', postalCode: '' },
    industry: '',
    beeLevel: '',
    notes: ''
  });

  // Industry options
  const industryOptions: SelectOption[] = [
    { value: 'mining', label: 'Mining & Extraction', group: 'Industrial' },
    { value: 'manufacturing', label: 'Manufacturing', group: 'Industrial' },
    { value: 'construction', label: 'Construction', group: 'Industrial' },
    { value: 'engineering', label: 'Engineering Services', group: 'Professional' },
    { value: 'it', label: 'IT Services', group: 'Professional' },
    { value: 'consulting', label: 'Consulting', group: 'Professional' },
    { value: 'logistics', label: 'Logistics & Transport', group: 'Commercial' },
    { value: 'catering', label: 'Catering & Hospitality', group: 'Commercial' },
    { value: 'security', label: 'Security Services', group: 'Commercial' },
    { value: 'maintenance', label: 'Maintenance & Facilities', group: 'Commercial' },
    { value: 'financial', label: 'Financial Services', group: 'Professional' },
    { value: 'legal', label: 'Legal Services', group: 'Professional' },
  ];

  // BEE Level options
  const beeLevelOptions: SelectOption[] = [
    { value: 'level-1', label: 'Level 1 (135% Procurement Recognition)', description: 'Highest BEE level' },
    { value: 'level-2', label: 'Level 2 (125% Procurement Recognition)', description: 'Very good BEE level' },
    { value: 'level-3', label: 'Level 3 (110% Procurement Recognition)', description: 'Good BEE level' },
    { value: 'level-4', label: 'Level 4 (100% Procurement Recognition)', description: 'Standard BEE level' },
    { value: 'level-5', label: 'Level 5 (80% Procurement Recognition)', description: 'Below average BEE level' },
    { value: 'level-6', label: 'Level 6 (60% Procurement Recognition)', description: 'Low BEE level' },
    { value: 'level-7', label: 'Level 7 (50% Procurement Recognition)', description: 'Very low BEE level' },
    { value: 'level-8', label: 'Level 8 (10% Procurement Recognition)', description: 'Poor BEE level' },
    { value: 'non-compliant', label: 'Non-Compliant (0% Procurement Recognition)', description: 'No BEE compliance' },
    { value: 'pending', label: 'Pending Assessment', description: 'BEE assessment in progress' },
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!supplierData.name || !supplierData.registrationNumber || !supplierData.contactPerson || !supplierData.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Supplier added successfully! Redirecting to supplier profile...');
      
      // Redirect to the new supplier's profile (using a mock ID)
      setTimeout(() => {
        router.push('/suppliers/sup-new-001');
      }, 1500);
    }, 1000);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setSupplierData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle address changes
  const handleAddressChange = (address: { street: string; suburb: string; city: string; province: string; postalCode: string; } | undefined) => {
    setSupplierData(prev => ({
      ...prev,
      physicalAddress: address || { street: '', suburb: '', city: '', province: '', postalCode: '' }
    }));
  };

  return (
    <NeumorphicBackground>
      <div className="container mx-auto p-6">
        <NeumorphicCard className="p-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <NeumorphicButton
              onClick={() => router.back()}
              className="px-3 py-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </NeumorphicButton>
            <div>
              <NeumorphicHeading>Add New Supplier</NeumorphicHeading>
              <NeumorphicText className="text-neumorphic-text-secondary mt-2">
                Register a new supplier for vetting and onboarding
              </NeumorphicText>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BuildingIcon className="w-5 h-5 text-blue-500" />
                <NeumorphicText className="text-lg font-semibold">Company Information</NeumorphicText>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neumorphic-text-primary">Company Name *</label>
                  <Input
                    type="text"
                    value={supplierData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Westonaria Mining Supplies"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <CompanyRegistrationInput
                    value={supplierData.registrationNumber}
                    onChange={(value) => handleInputChange('registrationNumber', value)}
                    label="Company Registration Number *"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <NeumorphicSelect
                    label="Industry *"
                    placeholder="Select industry sector..."
                    options={industryOptions}
                    value={supplierData.industry}
                    onChange={(value) => handleInputChange('industry', value || '')}
                    required
                    searchable
                  />
                </div>

                <div className="space-y-2">
                  <NeumorphicSelect
                    label="BEE Level"
                    placeholder="Select BEE compliance level..."
                    options={beeLevelOptions}
                    value={supplierData.beeLevel}
                    onChange={(value) => handleInputChange('beeLevel', value || '')}
                    searchable
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-5 h-5 text-green-500" />
                <NeumorphicText className="text-lg font-semibold">Contact Information</NeumorphicText>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neumorphic-text-primary">Contact Person *</label>
                  <Input
                    type="text"
                    value={supplierData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neumorphic-text-primary">Contact Email *</label>
                  <Input
                    type="email"
                    value={supplierData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g., john@company.co.za"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <PhoneInput
                    value={supplierData.contactPhone}
                    onChange={(value) => handleInputChange('contactPhone', value)}
                    label="Contact Phone Number"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="w-5 h-5 text-purple-500" />
                <NeumorphicText className="text-lg font-semibold">Address Information</NeumorphicText>
              </div>
              
              <div className="space-y-2">
                <AddressInput
                  value={supplierData.physicalAddress}
                  onChange={handleAddressChange}
                  label="Physical Address"
                />
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileTextIcon className="w-5 h-5 text-orange-500" />
                <NeumorphicText className="text-lg font-semibold">Additional Information</NeumorphicText>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neumorphic-text-primary">Notes & Comments</label>
                <textarea
                  value={supplierData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes about this supplier..."
                  rows={4}
                  className="w-full px-3 py-2 border border-neumorphic-border rounded-[var(--neumorphic-radius)] 
                           bg-neumorphic-background text-neumorphic-text-primary
                           focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50
                           resize-vertical"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-neumorphic-border">
              <NeumorphicButton
                type="button"
                onClick={() => router.back()}
                className="px-6"
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                type="submit"
                className="px-6 bg-blue-500 hover:bg-blue-600"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Add Supplier
              </NeumorphicButton>
            </div>
          </form>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
};

export default AddNewSupplierPage; 