**Menu: Vetting Operations > Initiate New Vetting**

**1. Purpose:**

This section allows a Super Admin (or other authorized users, based on RBAC in the full app) to initiate a new vetting process for an individual, a company/supplier, or specifically for staff medical checks related to a project. It involves selecting the entity type, providing necessary identification details, choosing the required vetting checks (either individually or as a pre-defined package), and triggering the subsequent workflow, including consent acquisition. For the demo, this will showcase the data entry process, the available checks, and the start of a vetting lifecycle.

**2. Sample Data Strategy:**

*   **Storage Location:**
    *   `src/lib/sample-data/vettingChecksSample.ts`: For definitions of all available vetting checks and packages.
    *   `src/lib/sample-data/projectsSample.ts`: For a list of mining projects (relevant for medical checks).
*   **Data Structure:**
    *   Define TypeScript interfaces in `src/types/vetting.ts` (or `index.ts`).

    ```typescript
    // In src/types/vetting.ts
    export enum VettingEntityType {
      INDIVIDUAL = 'Individual',
      COMPANY = 'Company',
      STAFF_MEDICAL = 'Staff Medical',
    }

    export enum CheckCategory {
      IDENTITY = 'Identity',
      FINANCIAL = 'Financial',
      CRIMINAL = 'Criminal',
      COMPLIANCE = 'Compliance',
      OPERATIONAL = 'Operational',
      REPUTATIONAL = 'Reputational',
      MEDICAL = 'Medical', // New category for demo
      BUSINESS_SPECIFIC = 'Business Specific',
    }

    export interface VettingCheckDefinition {
      id: string; // e.g., 'id_verification', 'cipc_check', 'chronic_med_history'
      name: string; // User-friendly name, e.g., "SA ID Verification", "CIPC Company Check", "Chronic Medication History"
      description: string;
      category: CheckCategory;
      applicableTo: VettingEntityType[]; // Which entity types this check can be run on
      estimatedCostZAR?: number; // For demo, can be indicative
      estimatedTurnaroundDays?: number; // For demo
      consentRequired: boolean; // Does this specific check require explicit consent?
      provider?: string; // e.g., "MIE", "XDS", "Internal", "Specialized Medical Lab"
    }

    export interface VettingPackage {
      id: string; // e.g., 'basic_supplier_vet', 'comprehensive_director_check', 'mining_staff_medical_std'
      name: string; // e.g., "Basic Supplier Vetting", "Comprehensive Director Check", "Standard Mining Staff Medical"
      description: string;
      applicableTo: VettingEntityType[];
      checkIds: string[]; // Array of VettingCheckDefinition ids included in this package
      totalEstimatedCostZAR?: number;
      totalEstimatedTurnaroundDays?: number;
    }

    export interface MiningProject {
      id: string;
      name: string;
      location: string; // e.g., "Rustenburg Platinum Mine", "Sishen Iron Ore Mine"
      clientCompany: string; // e.g., "Sibanye Stillwater", "Anglo American"
    }
    ```

*   **Sample Data Content:**

    *   **`src/lib/sample-data/vettingChecksSample.ts`:**
        Include a wide variety of checks from your `project-doc.md`, page 19 of `Vetter Pro Process Overview - v1.pdf`, and the `vetting.pdf`, plus the new medical checks.

        ```typescript
        import { VettingCheckDefinition, CheckCategory, VettingEntityType } from '@/types/vetting';

        export const allVettingChecks: VettingCheckDefinition[] = [
          // Individual Checks (examples)
          { id: 'id_verify_sa', name: 'SA ID Verification', description: 'Verifies South African ID number validity and details.', category: CheckCategory.IDENTITY, applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 50, estimatedTurnaroundDays: 1, consentRequired: true, provider: 'MIE' },
          { id: 'criminal_record_afis', name: 'Criminal Record Check (AFIS)', description: 'Checks against SAPS criminal database via AFIS.', category: CheckCategory.CRIMINAL, applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 150, estimatedTurnaroundDays: 2, consentRequired: true, provider: 'MIE' },
          { id: 'credit_check_ind', name: 'Individual Credit Report', description: 'Comprehensive credit history and score for an individual.', category: CheckCategory.FINANCIAL, applicableTo: [VettingEntityType.INDIVIDUAL], estimatedCostZAR: 120, estimatedTurnaroundDays: 1, consentRequired: true, provider: 'XDS' },
          { id: 'education_verify', name: 'Education Qualification Verification', description: 'Verifies claimed educational qualifications.', category: CheckCategory.IDENTITY, applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 200, estimatedTurnaroundDays: 3, consentRequired: true, provider: 'MIE' },
          { id: 'lifestyle_audit_ind', name: 'Individual Lifestyle Audit (Basic)', description: 'Basic assessment of lifestyle indicators.', category: CheckCategory.REPUTATIONAL, applicableTo: [VettingEntityType.INDIVIDUAL], estimatedCostZAR: 500, estimatedTurnaroundDays: 5, consentRequired: true, provider: 'Internal/Specialist' },
          { id: 'pep_sanctions_ind', name: 'PEP & Sanctions Screening (Individual)', description: 'Checks against Politically Exposed Persons and global sanctions lists.', category: CheckCategory.COMPLIANCE, applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 80, estimatedTurnaroundDays: 1, consentRequired: true, provider: 'LexisNexis' },

          // Company Checks (examples)
          { id: 'cipc_company_check', name: 'CIPC Company Registration Check', description: 'Verifies company registration details, directors, and status with CIPC.', category: CheckCategory.BUSINESS_SPECIFIC, applicableTo: [VettingEntityType.COMPANY], estimatedCostZAR: 100, estimatedTurnaroundDays: 1, consentRequired: false, provider: 'MIE' },
          { id: 'business_credit_report', name: 'Business Credit Report', description: 'Comprehensive credit history and score for a company.', category: CheckCategory.FINANCIAL, applicableTo: [VettingEntityType.COMPANY], estimatedCostZAR: 300, estimatedTurnaroundDays: 1, consentRequired: false, provider: 'CPB' },
          { id: 'vat_verify_sars', name: 'VAT Registration Verification (SARS)', description: 'Verifies VAT registration status with SARS.', category: CheckCategory.COMPLIANCE, applicableTo: [VettingEntityType.COMPANY], estimatedCostZAR: 70, estimatedTurnaroundDays: 1, consentRequired: false, provider: 'Internal/SARS Link' },
          { id: 'bank_acc_verify_biz', name: 'Business Bank Account Verification', description: 'Verifies the legitimacy of the business bank account.', category: CheckCategory.FINANCIAL, applicableTo: [VettingEntityType.COMPANY], estimatedCostZAR: 90, estimatedTurnaroundDays: 1, consentRequired: true, provider: 'MIE' },
          { id: 'physical_loc_verify', name: 'Physical Location Verification', description: 'On-site verification of business address.', category: CheckCategory.OPERATIONAL, applicableTo: [VettingEntityType.COMPANY], estimatedCostZAR: 800, estimatedTurnaroundDays: 3, consentRequired: false, provider: 'Field Agent' }, // Consent might be implicit in contract

          // Staff Medical Checks (for demo)
          { id: 'med_fitness_cert', name: 'Certificate of Fitness (Mining)', description: 'Standard medical fitness assessment for mining work.', category: CheckCategory.MEDICAL, applicableTo: [VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 600, estimatedTurnaroundDays: 2, consentRequired: true, provider: 'Occupational Health Clinic' },
          { id: 'chronic_med_history', name: 'Chronic Medication History Review', description: 'Review of declared and/or historical chronic medication usage relevant to job role.', category: CheckCategory.MEDICAL, applicableTo: [VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 250, estimatedTurnaroundDays: 3, consentRequired: true, provider: 'Specialized Medical Reviewer' },
          { id: 'drug_alcohol_screen', name: 'Drug & Alcohol Screening', description: 'Standard panel drug and alcohol test.', category: CheckCategory.MEDICAL, applicableTo: [VettingEntityType.STAFF_MEDICAL], estimatedCostZAR: 350, estimatedTurnaroundDays: 1, consentRequired: true, provider: 'Pathology Lab' },
          // ... add more checks from your documents (AML, COID, Deeds, Social Media, etc.)
        ];

        export const vettingPackages: VettingPackage[] = [
          { id: 'pkg_basic_supplier', name: 'Basic Supplier Onboarding', description: 'Essential checks for new suppliers.', applicableTo: [VettingEntityType.COMPANY], checkIds: ['cipc_company_check', 'vat_verify_sars', 'bank_acc_verify_biz', 'business_credit_report'], totalEstimatedCostZAR: 560, totalEstimatedTurnaroundDays: 2 },
          { id: 'pkg_high_risk_ind', name: 'High-Risk Individual Due Diligence', description: 'Comprehensive checks for individuals in sensitive roles.', applicableTo: [VettingEntityType.INDIVIDUAL], checkIds: ['id_verify_sa', 'criminal_record_afis', 'credit_check_ind', 'pep_sanctions_ind', 'lifestyle_audit_ind'], totalEstimatedCostZAR: 950, totalEstimatedTurnaroundDays: 5 },
          { id: 'pkg_mining_medical_std', name: 'Standard Mining Staff Medical', description: 'Standard medical checks for mine workers.', applicableTo: [VettingEntityType.STAFF_MEDICAL], checkIds: ['id_verify_sa', 'med_fitness_cert', 'chronic_med_history', 'drug_alcohol_screen'], totalEstimatedCostZAR: 1250, totalEstimatedTurnaroundDays: 3 },
          // ... more packages
        ];
        ```

    *   **`src/lib/sample-data/projectsSample.ts`:**
        ```typescript
        import { MiningProject } from '@/types/vetting';

        export const sampleMiningProjects: MiningProject[] = [
          { id: 'proj_SB001', name: 'Marikana K4 Expansion', location: 'Marikana, North West', clientCompany: 'Sibanye Stillwater' },
          { id: 'proj_AA005', name: 'Mogalakwena North Pit', location: 'Mokopane, Limpopo', clientCompany: 'Anglo American Platinum' },
          { id: 'proj_EXX002', name: 'Grootegeluk Coal Mine Ops', location: 'Lephalale, Limpopo', clientCompany: 'Exxaro Resources' },
        ];
        ```

*   **Data Fetching (Simulated):**
    The page component (`src/app/vetting/initiate-new/page.tsx`) will "fetch" these definitions to populate dropdowns and selection lists.

    ```typescript
    // In src/app/vetting/initiate-new/page.tsx
    import { allVettingChecks, vettingPackages, sampleMiningProjects } from '@/lib/sample-data/vettingChecksSample'; // Assuming projects are moved or imported from projectsSample.ts
    import { VettingCheckDefinition, VettingPackage, MiningProject } from '@/types/vetting';
    // ... other imports

    async function getVettingSetupData() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        checks: allVettingChecks,
        packages: vettingPackages,
        projects: sampleMiningProjects, // from projectsSample.ts
      };
    }

    export default async function InitiateNewVettingPage() {
      const { checks, packages, projects } = await getVettingSetupData();
      // Pass checks, packages, projects to a client component that handles the form logic
      return <InitiateVettingForm checks={checks} packages={packages} projects={projects} />;
    }
    ```

**3. UI Components & Functionality:**

This page will be a multi-step or dynamically changing form within a `NeumorphicCard`.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the entire "Initiate New Vetting" form.
    *   **Header:** Title "Initiate New Vetting" (`<h2>` or `<h3>`).

*   **Step 1: Select Vetting Entity Type**
    *   `NeumorphicRadioGroup` (shadcn/ui RadioGroup styled neumorphically):
        *   Options: "Individual," "Company/Supplier," "Staff Medical."
        *   Selection here dynamically changes the subsequent form sections.

*   **Step 2: Entity Details (Dynamic based on Step 1 selection)**

    *   **If "Individual" or "Staff Medical" is selected:**
        *   `NeumorphicInput` for "First Name" (Required)
        *   `NeumorphicInput` for "Last Name" (Required)
        *   `SAIdInput` (custom SA identity form component from `src/components/forms/identity/`): For "South African ID Number" (with real-time Luhn validation and demographic extraction display).
        *   `NeumorphicInput` for "Passport Number" (Optional, for non-SA).
        *   `NeumorphicSelect` for "Nationality".
        *   `NeumorphicInput` for "Mobile Number (for Consent)" (Required, SA phone format validation).
        *   `NeumorphicInput` for "Email Address (for Consent)" (Optional).
        *   **If "Staff Medical":**
            *   `NeumorphicSelect` to choose "Project Name" (populated from `sampleMiningProjects`). (Required)
            *   `NeumorphicInput` for "Staff/Employee ID Number (for Project)". (Optional)
            *   `NeumorphicInput` for "Job Role/Title". (Required)

    *   **If "Company/Supplier" is selected:**
        *   `NeumorphicInput` for "Company Name" (Required).
        *   `CompanyRegInput` (custom SA business form component from `src/components/forms/business/`): For "Company Registration Number (CIPC)" (with format validation).
        *   `VatNumberInput` (custom SA business form component): For "VAT Number (SARS)".
        *   `NeumorphicInput` for "Primary Contact Person Name".
        *   `NeumorphicInput` for "Primary Contact Mobile Number (for Consent if applicable to contact)".
        *   `NeumorphicInput` for "Primary Contact Email Address".

*   **Step 3: Select Vetting Checks / Package**
    *   `NeumorphicRadioGroup` or `NeumorphicTabs`:
        *   Option 1: "Select a Vetting Package"
            *   `NeumorphicSelect` populated with `vettingPackages` (filtered by `applicableTo` based on Step 1 selection).
            *   Display selected package description and included checks (read-only list).
        *   Option 2: "Select Individual Checks"
            *   A list/grid of `NeumorphicCheckbox` components for each `VettingCheckDefinition` (filtered by `applicableTo`).
            *   Group checks by `CheckCategory` using `NeumorphicAccordion` or section headers.
            *   Display `estimatedCostZAR` and `estimatedTurnaroundDays` next to each check.
            *   A `NeumorphicMultiSelectDropdown` (if you build one, or multiple checkboxes) could also work here.

*   **Step 4: Summary & Consent Trigger (Simulated)**
    *   Read-only summary of selected entity, details, and chosen checks/package.
    *   Display total `estimatedCostZAR` and `totalEstimatedTurnaroundDays` (calculated if individual checks were selected).
    *   `NeumorphicCheckbox` (Required): "I confirm that necessary pre-authorization/notification has been given to the subject for initiating this vetting process." (This is distinct from the specific check consents).
    *   `NeumorphicButton` (Primary): "Initiate Vetting & Send Consent Request"
        *   **Action:**
            1.  Form validation (all required fields filled).
            2.  On successful validation, show a `Sonner` toast: "Vetting process initiated for [Subject Name]. Consent request sent to [Mobile Number/Email]."
            3.  (Simulated) Add a new entry to a list representing "Active Vetting Cases" (for demo purposes, this might just be a console log or a state update if this page were to show a summary of recent initiations).
            4.  (Simulated) If any selected checks require consent (`consentRequired: true`), the system would "send a link to mobile for digital signature." For the demo, this is just part of the success message.
            5.  Optionally, redirect to the "Active Vetting Cases" page or clear the form for a new entry.

*   **Other UI Components:**
    *   `NeumorphicTooltip`: For descriptions of checks or fields.
    *   Validation messages next to input fields (as per your `project-doc.md` form system).

**4. Functionality to be Seen/Simulated for Demo:**

*   **Dynamic Form Changes:** User sees the form adapt based on the "Vetting Entity Type" selection.
*   **SA-Specific Input Validation:** Real-time validation feedback for SA ID, Company Reg, VAT, Phone numbers.
*   **Package vs. Individual Check Selection:** User can choose either path. If a package is selected, individual checks are shown but disabled.
*   **Cost/Time Estimation Display:** User sees indicative costs and turnaround times.
*   **Submission & Feedback:**
    *   Validation errors are clearly shown if required fields are missed.
    *   Successful submission shows a clear `Sonner` toast message, including the "consent sent" part.
*   **Responsive Behavior:** The form layout should adapt gracefully to different screen sizes.
*   **Loading States (Minimal for this form, but good practice):** If fetching check definitions/packages were a real API call, a loader would be shown. For the demo, the data is pre-loaded.

**5. Adherence to Project Documentation:**

*   **Neumorphic Design:** All form elements, buttons, cards, etc., must strictly adhere to the VETTPRO neumorphic design system.
*   **Tailwind CSS:** For layout and custom styling.
*   **TypeScript:** All data (check definitions, packages, form state) and props strictly typed.
*   **shadcn/ui & Radix UI Primitives:** Used as the base for enhanced neumorphic components, especially for forms, radio groups, selects, checkboxes.
*   **Lucide Icons:** For any icons within buttons or input fields.
*   **Accessibility:** Forms should be keyboard navigable, labels correctly associated with inputs, ARIA attributes used where necessary.