**Menu: Vetting Operations > Consent Management**

**1. Purpose:**

This section provides a centralized interface for the Super Admin (or other authorized users) to manage all aspects of the consent lifecycle for individuals and supplier contacts. It allows users to track the status of consent requests, send or resend consent links, review submitted consent forms (including digital signatures), and manually record consent if obtained through alternative channels. For the demo, this will highlight the system's capability to handle a critical compliance step, including the "link sent to mobile and digital signature received" requirement.

**2. Sample Data Strategy:**

*   **Storage Location:**
    *   Create a dedicated file: `src/lib/sample-data/consentRequestsSample.ts`
*   **Data Structure:**
    *   The data will be an array of objects, each representing a consent request. This will link to subjects (individuals or company contacts) and specific vetting cases or checks.
    *   Define TypeScript interfaces in `src/types/consent.ts` (or extend `vetting.ts`).

    ```typescript
    // In src/types/consent.ts (or vetting.ts)
    export enum ConsentRequestStatus {
      PENDING_SENT = 'Pending - Sent',
      LINK_OPENED = 'Link Opened', // Subject has clicked the link
      FORM_VIEWED = 'Form Viewed', // Subject has viewed the consent form
      SUBMITTED_AWAITING_VERIFICATION = 'Submitted - Awaiting Signature Verification',
      VERIFIED_APPROVED = 'Verified - Approved',
      VERIFIED_REJECTED_SIGNATURE_MISMATCH = 'Verified - Rejected (Signature Mismatch)',
      VERIFIED_REJECTED_OTHER = 'Verified - Rejected (Other Issue)',
      DECLINED_BY_SUBJECT = 'Declined by Subject',
      EXPIRED = 'Expired', // Link/request expired
      MANUALLY_RECORDED_APPROVED = 'Manually Recorded - Approved',
      ERROR_SENDING = 'Error Sending',
    }

    export enum ConsentChannel {
      SMS_LINK = 'SMS Link',
      EMAIL_LINK = 'Email Link',
      MANUAL_UPLOAD = 'Manual Upload',
    }

    export interface ConsentRequestItem {
      consentId: string; // Unique ID for the consent request, e.g., "CR20250601-001"
      vettingCaseId: string; // Links to ActiveVettingCase.caseId
      subjectName: string; // Individual's full name or Company Contact Name
      subjectId: string; // SA ID, Company Reg No. (for company context), or Staff ID
      entityType: VettingEntityType; // From vetting.ts
      projectId?: string; // If for Staff Medical
      projectName?: string; // Denormalized
      checksRequiringConsent: { checkId: string; checkName: string }[]; // List of specific checks this consent covers
      status: ConsentRequestStatus;
      channel: ConsentChannel;
      requestSentDate: string; // ISO Date string
      linkOpenedDate?: string; // ISO Date string
      formViewedDate?: string; // ISO Date string
      submittedDate?: string; // ISO Date string
      verifiedDate?: string; // ISO Date string
      expiryDate?: string; // ISO Date string for the consent link
      recipientMobile?: string; // Mobile number link was sent to
      recipientEmail?: string; // Email link was sent to
      digitalSignatureImageLink?: string; // Link to a sample image of a "digital signature" for demo
      uploadedConsentFormLink?: string; // Link to a sample PDF of a manually uploaded form
      verificationNotes?: string; // Notes from admin during signature verification or manual recording
      lastUpdated: string; // ISO Date string
    }
    ```

*   **Sample Data Content (`src/lib/sample-data/consentRequestsSample.ts`):**
    Create 10-15 diverse consent requests with various statuses, channels, and subject types. Include some that are pending, some verified, some with issues.

    ```typescript
    import { ConsentRequestItem, ConsentRequestStatus, ConsentChannel, VettingEntityType } from '@/types/consent'; // Assuming types are in consent.ts
    import { allVettingChecks } from './vettingChecksSample'; // To get check names

    const getCheckInfo = (id: string) => ({ checkId: id, checkName: allVettingChecks.find(c => c.id === id)?.name || 'Unknown Check' });

    export const sampleConsentRequests: ConsentRequestItem[] = [
      {
        consentId: 'CR20250601-001',
        vettingCaseId: 'VC20250601-002', // Johnathan Doe from active cases
        subjectName: 'Johnathan Doe',
        subjectId: '8501015000080',
        entityType: VettingEntityType.INDIVIDUAL,
        checksRequiringConsent: [getCheckInfo('id_verify_sa'), getCheckInfo('criminal_record_afis')],
        status: ConsentRequestStatus.PENDING_SENT,
        channel: ConsentChannel.SMS_LINK,
        requestSentDate: '2025-06-01T09:05:00Z',
        recipientMobile: '+27820000001',
        expiryDate: '2025-06-08T09:05:00Z',
        lastUpdated: '2025-06-01T09:05:00Z',
      },
      {
        consentId: 'CR20250602-001',
        vettingCaseId: 'VC20250602-001', // Sarah Connor from active cases (medical)
        subjectName: 'Sarah Connor',
        subjectId: '9003036000085',
        entityType: VettingEntityType.STAFF_MEDICAL,
        projectId: 'proj_SB001',
        projectName: 'Marikana K4 Expansion',
        checksRequiringConsent: [getCheckInfo('med_fitness_cert'), getCheckInfo('chronic_med_history'), getCheckInfo('drug_alcohol_screen')],
        status: ConsentRequestStatus.VERIFIED_APPROVED,
        channel: ConsentChannel.EMAIL_LINK,
        requestSentDate: '2025-05-20T11:05:00Z',
        linkOpenedDate: '2025-05-20T14:00:00Z',
        formViewedDate: '2025-05-20T14:02:00Z',
        submittedDate: '2025-05-20T14:05:00Z',
        verifiedDate: '2025-05-20T16:00:00Z',
        recipientEmail: 'sarah.connor@example.com',
        digitalSignatureImageLink: '/sample-data/signatures/sig_sarah_connor.png', // Placeholder link
        lastUpdated: '2025-05-20T16:00:00Z',
      },
      {
        consentId: 'CR20250528-001',
        vettingCaseId: 'VC20250601-001', // QuantumLeap (for a director's consent, if applicable)
        subjectName: 'Alice Smith (Director at QuantumLeap)',
        subjectId: '7501010000080', // Director's ID
        entityType: VettingEntityType.INDIVIDUAL, // Consent is for an individual, even if related to a company case
        checksRequiringConsent: [getCheckInfo('credit_check_ind'), getCheckInfo('pep_sanctions_ind')],
        status: ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION,
        channel: ConsentChannel.SMS_LINK,
        requestSentDate: '2025-05-28T10:00:00Z',
        linkOpenedDate: '2025-05-29T11:00:00Z',
        formViewedDate: '2025-05-29T11:01:00Z',
        submittedDate: '2025-05-29T11:05:00Z',
        recipientMobile: '+27830000002',
        digitalSignatureImageLink: '/sample-data/signatures/sig_alice_smith_blurry.png', // Example of a potentially problematic signature
        lastUpdated: '2025-05-29T11:05:00Z',
      },
      {
        consentId: 'CR20250603-001',
        vettingCaseId: 'VC_MANUAL_001', // Example of a manually recorded consent
        subjectName: 'Manual Upload Example Co.',
        subjectId: 'MANUAL_REC_001',
        entityType: VettingEntityType.COMPANY,
        checksRequiringConsent: [getCheckInfo('bank_acc_verify_biz')],
        status: ConsentRequestStatus.MANUALLY_RECORDED_APPROVED,
        channel: ConsentChannel.MANUAL_UPLOAD,
        requestSentDate: '2025-06-03T10:00:00Z', // Date admin initiated manual record
        verifiedDate: '2025-06-03T10:05:00Z',
        uploadedConsentFormLink: '/sample-data/consents/manual_consent_001.pdf', // Placeholder
        verificationNotes: 'Physical consent form received and verified by AdminUser on 2025-06-03.',
        lastUpdated: '2025-06-03T10:05:00Z',
      },
      // Add more:
      // - A request that is 'DECLINED_BY_SUBJECT'.
      // - A request that is 'EXPIRED'.
      // - A request with 'VERIFIED_REJECTED_SIGNATURE_MISMATCH'.
      // - A request in 'LINK_OPENED' or 'FORM_VIEWED' state.
      {
        consentId: 'CR20250520-001',
        vettingCaseId: 'VC_EXPIRED_001',
        subjectName: 'Expired Link User',
        subjectId: '9202020000080',
        entityType: VettingEntityType.INDIVIDUAL,
        checksRequiringConsent: [getCheckInfo('id_verify_sa')],
        status: ConsentRequestStatus.EXPIRED,
        channel: ConsentChannel.SMS_LINK,
        requestSentDate: '2025-05-20T10:00:00Z',
        recipientMobile: '+27840000003',
        expiryDate: '2025-05-27T10:00:00Z', // Expired
        lastUpdated: '2025-05-27T10:01:00Z',
      },
    ];
    ```

*   **Data Fetching (Simulated):**
    The page component (`src/app/vetting/consent-management/page.tsx`) will fetch this data.

    ```typescript
    // In src/app/vetting/consent-management/page.tsx
    import { sampleConsentRequests } from '@/lib/sample-data/consentRequestsSample';
    import { ConsentRequestItem } from '@/types/consent';
    // ... other imports

    async function getConsentRequests(): Promise<ConsentRequestItem[]> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      return sampleConsentRequests;
    }

    export default async function ConsentManagementPage() {
      const consentRequests = await getConsentRequests();
      // Pass to a client component for interactive table display
      return <ConsentManagementTable consentRequests={consentRequests} />;
    }
    ```

**3. UI Components & Functionality:**

This page will primarily feature an interactive data table for managing consent requests.

*   **Main Container:**
    *   `NeumorphicCard`: Encloses the "Consent Management" section.
    *   **Header:** Title "Consent Management" (`<h2>` or `<h3>`).
    *   **Toolbar (above the table):**
        *   `NeumorphicInput` (with Lucide search icon): Search by Consent ID, Vetting Case ID, Subject Name, Subject ID.
        *   `NeumorphicSelect` / `DropdownMenu`: Filter by:
            *   Status (`ConsentRequestStatus`)
            *   Channel (`ConsentChannel`)
            *   Entity Type (`VettingEntityType`)
        *   `NeumorphicDatePicker` / `DateRangePicker`: Filter by Request Sent Date or Last Updated Date.
        *   `NeumorphicButton` (filter icon): Apply filters.
        *   `NeumorphicButton` (refresh icon): Refresh list.
        *   `NeumorphicButton` (plus icon, "Record Manual Consent"): Opens a modal to manually record consent.

*   **Consent Requests Table (`NeumorphicTable`):**
    *   **Purpose:** Display the list of consent requests.
    *   **Columns:**
        1.  **Consent ID:** `consentId` (Clickable, opens a detailed view modal).
        2.  **Subject Name:** `subjectName`.
        3.  **Subject ID:** `subjectId`.
        4.  **Entity Type:** `entityType`.
        5.  **Checks Covered:** A summary or count of `checksRequiringConsent` (e.g., "3 Checks"). Tooltip on hover to list them.
        6.  **Status:** `NeumorphicBadge` for `ConsentRequestStatus` (color-coded).
        7.  **Channel:** `channel`.
        8.  **Sent Date:** Formatted `requestSentDate`.
        9.  **Expiry Date:** Formatted `expiryDate` (highlight if nearing expiry or expired).
        10. **Last Updated:** Formatted `lastUpdated`.
        11. **Actions:** `DropdownMenu` (more-horizontal icon) per row:
            *   **View Details:** Opens a `NeumorphicDialog` with all consent request information.
            *   **Resend Request:** (Simulated, enabled if status allows, e.g., PENDING_SENT, EXPIRED). Shows `Sonner` toast.
            *   **Verify Submitted Consent:** (Enabled if `status` is `SUBMITTED_AWAITING_VERIFICATION`). Opens a modal for signature/document review.
            *   **Manually Record Outcome:** (Enabled if status allows). Opens a modal to change status and add notes (e.g., if subject called to decline).
            *   **View Vetting Case:** Navigates to the related `ActiveVettingCase` page (using `vettingCaseId`).

*   **Modals / Dialogs (`NeumorphicDialog` / `NeumorphicAlertDialog`):**
    *   **View Consent Details Modal:**
        *   **Triggered by:** Clicking Consent ID or "View Details" action.
        *   **Content:**
            *   All fields from `ConsentRequestItem`.
            *   List of "Checks Requiring Consent" clearly displayed.
            *   If `digitalSignatureImageLink` exists, display the sample signature image.
            *   If `uploadedConsentFormLink` exists, provide a link to "download/view" the sample PDF.
            *   `verificationNotes`.
        *   **Actions:** "Close."
    *   **Verify Submitted Consent Modal:**
        *   **Triggered by:** "Verify Submitted Consent" action.
        *   **Content:**
            *   Displays subject details.
            *   Displays the `digitalSignatureImageLink` (sample signature image).
            *   Instructions for admin: "Compare the submitted signature with any reference signature (if available). Ensure clarity and authenticity."
            *   `NeumorphicRadioGroup` for outcome: "Approve Signature," "Reject - Signature Mismatch," "Reject - Other Issue."
            *   `NeumorphicTextarea` for "Verification Notes."
        *   **Actions:** "Submit Verification," "Cancel." (On submit, shows `Sonner` toast and updates row status optimistically).
    *   **Record Manual Consent Modal:**
        *   **Triggered by:** Toolbar button "Record Manual Consent."
        *   **Content:**
            *   Form to input: `vettingCaseId`, `subjectName`, `subjectId`, `entityType`, select `checksRequiringConsent` (multi-select dropdown or checkboxes).
            *   `NeumorphicRadioGroup` for consent outcome: "Approved," "Declined."
            *   `NeumorphicFileUpload` (simulated) to "upload scanned consent form."
            *   `NeumorphicTextarea` for "Admin Notes."
        *   **Actions:** "Save Manual Consent," "Cancel." (Shows `Sonner` toast).
    *   **Manually Record Outcome Modal:** Similar to above, but pre-filled with existing consent request data.

*   **Notifications (`Sonner` with neumorphic variants):**
    *   Feedback for actions: "Consent request resent," "Consent verified and approved," "Manual consent recorded."

**4. Functionality to be Seen/Simulated for Demo:**

*   **Loading State:** `NeumorphicSkeleton` for the table.
*   **Filtering & Searching:** Dynamically filters the `sampleConsentRequests` array.
*   **Sorting:** Table sorts by clickable headers (e.g., Sent Date, Status, Subject Name).
*   **Interactive Actions:**
    *   "Resend Request" shows a toast.
    *   "Verify Submitted Consent" modal allows interaction and simulated approval/rejection with status update.
    *   "Record Manual Consent" modal allows form entry and simulated recording.
*   **Visual Cues:** Expired dates highlighted, status badges clearly indicate state.
*   **Navigation:** Link to the associated "Active Vetting Case."
*   **Digital Signature Display:** The demo should show a placeholder image for the "digital signature" when viewing details of a submitted consent.
*   **Responsive Behavior:** Table and modals adapt to screen sizes.

**5. Adherence to Project Documentation:**

*   **Neumorphic Design:** All UI elements must adhere to the VETTPRO neumorphic design system.
*   **Technology Stack:** Consistent use of Tailwind, TypeScript, Lucide Icons, shadcn/ui (with neumorphic variants), Radix UI primitives, Sonner.
*   **Accessibility:** Keyboard navigable, ARIA attributes.
