**VETTPRO Dashboard - Super Admin Menu Structure**

The main navigation will likely be your "Curved Sidebar Navigation" with inverse theming.

---

**1. Dashboard**
    *   **Purpose:** Provides a high-level, at-a-glance overview of the entire vetting ecosystem, key metrics, and urgent action items.
    *   **Sub-Menus/Sections:**
        *   **Overview:**
            *   **Key Actions:** View summaries, navigate to detailed sections.
            *   **Data Displayed:**
                *   KPI Cards: Total suppliers, active vetting cases, overdue checks, high-risk suppliers, recent fraud alerts, system health status.
                *   Charts (ApexCharts):
                    *   Vetting activity trend (line chart).
                    *   Risk distribution of suppliers (donut/bar chart).
                    *   Open RFPs by status (bar chart).
                *   Recent Activity Feed: Log of important system events or user actions.
                *   Alerts & Notifications: Critical system alerts or tasks requiring immediate attention.
            *   **UI Components:** `NeumorphicCard`, KPI display components, ApexCharts, `NeumorphicTable` (for activity/alerts).
        *   **My Tasks & Approvals:**
            *   **Key Actions:** Review and action pending tasks, approvals, or escalations.
            *   **Data Displayed:** List of items requiring admin attention (e.g., escalated risk flags, consent issues, overdue verifications).
            *   **UI Components:** `NeumorphicTable` with action buttons, `NeumorphicBadge` for status.

---

**2. Vetting Operations**
    *   **Purpose:** Core section for initiating, managing, and tracking all pre-vetting and post-vetting activities for both individuals and companies.
    *   **Sub-Menus:**
        *   **Initiate New Vetting:**
            *   **Purpose:** Start a new vetting process.
            *   **Key Actions:** Select vetting type (Individual, Company, Staff Medical), input initial subject details, select vetting package/checks, trigger consent process.
            *   **Data Displayed:** Forms for data entry.
            *   **UI Components:** `NeumorphicInput`, SA-specific form components (`SAIdInput`, `CompanyRegInput`), `NeumorphicSelect` (for check packages), `NeumorphicCheckbox` (for individual checks), `NeumorphicButton`.
        *   **Active Vetting Cases:**
            *   **Purpose:** Monitor ongoing vetting processes.
            *   **Key Actions:** View details, track progress, update status, view interim reports, manage escalations.
            *   **Data Displayed:**
                *   Table of all active cases (Individual, Company, Medical, Post-Vetting Audits).
                *   Columns: Case ID, Subject Name/Company, Vetting Type, Status, Progress (Progress Bar), Assigned To, Due Date, Risk Score (if available).
            *   **UI Components:** `NeumorphicTable` with advanced filtering/sorting, `NeumorphicProgress`, `NeumorphicBadge`, Modals for detailed views.
        *   **Consent Management:**
            *   **Purpose:** Manage the consent process for individuals and suppliers.
            *   **Key Actions:**
                *   View pending consent requests.
                *   Send/Resend consent links (to mobile/email).
                *   Verify digital signatures received.
                *   Manually record consent if obtained offline (with audit).
                *   View consent history.
            *   **Data Displayed:** Table of consent statuses (Subject, Date Sent, Status, Date Responded, Signature Status).
            *   **UI Components:** `NeumorphicTable`, `NeumorphicButton` (Send/Resend), Modal for viewing signature/details.
        *   **Completed Vetting Reports:**
            *   **Purpose:** Access and review finalized vetting reports.
            *   **Key Actions:** Search, filter, view, download/print PDF reports.
            *   **Data Displayed:** Table of completed reports (Subject, Date, Overall Risk, Report Link).
            *   **UI Components:** `NeumorphicTable`, `NeumorphicButton` (Download PDF).
        *   **Scheduled & Recurring Checks:**
            *   **Purpose:** Manage checks that need to be run periodically (e.g., annual COID, quarterly credit checks).
            *   **Key Actions:** View schedule, set up new recurring checks, modify existing ones.
            *   **Data Displayed:** Calendar view or table of scheduled checks.
            *   **UI Components:** `NeumorphicTable`, Date Pickers, forms for scheduling.

---

**3. Supplier Management**
    *   **Purpose:** Central repository and management hub for all supplier entities.
    *   **Sub-Menus:**
        *   **All Suppliers:**
            *   **Purpose:** View and manage the master list of all suppliers.
            *   **Key Actions:** Search, filter (by risk, industry, status), view supplier profiles, initiate vetting/audits.
            *   **Data Displayed:** `NeumorphicTable` (Supplier Name, Reg No., Contact, Overall Risk, Last Vetted Date, Status).
            *   **UI Components:** Advanced `NeumorphicTable`, Search Input, Filter Dropdowns.
        *   **Supplier Profile View (on selecting a supplier):**
            *   **Purpose:** Deep dive into a specific supplier.
            *   **Key Actions:** Edit details, view all associated vetting history, documents, risk analyses, notes.
            *   **Data Displayed:**
                *   Tabs: Overview, Vetting History, Documents, Risk Analysis, Communication Log, Post-Vetting Audits.
                *   Supplier details, contact info, BEE status, CIPC info.
                *   List of all historical and active checks with their status and reports.
                *   Uploaded documents.
                *   Charts: Risk trend over time, breakdown of current risk score (radar chart).
            *   **UI Components:** `NeumorphicCard` sections, `NeumorphicTabs`, `NeumorphicTable` (for checks/docs), ApexCharts, File Upload/Viewer.
        *   **Add New Supplier:**
            *   **Purpose:** Manually add a new supplier to the system.
            *   **Key Actions:** Input supplier details.
            *   **Data Displayed:** Form for company information.
            *   **UI Components:** `NeumorphicInput`, SA Business Forms.
        *   **Supplier Risk Dashboard:**
            *   **Purpose:** Aggregate view of risk across the supplier base.
            *   **Key Actions:** Filter by various risk metrics.
            *   **Data Displayed:** Charts (ApexCharts): Suppliers by risk category, risk trends across industries, common red flags. Heatmap of supplier risk vs. verification types.
            *   **UI Components:** ApexCharts, `NeumorphicCard`.

---

**4. RFP & Invoice Management (Post-Vetting Focus)**
    *   **Purpose:** Manage Request for Proposals and link them to invoice analysis for fraud detection.
    *   **Sub-Menus:**
        *   **RFP Dashboard:**
            *   **Purpose:** Overview of all RFP activities.
            *   **Key Actions:** View active RFPs, track submission deadlines.
            *   **Data Displayed:** KPI cards (Open RFPs, Submissions Due), Table of RFPs.
            *   **UI Components:** `NeumorphicCard`, `NeumorphicTable`.
        *   **Manage RFPs:**
            *   **Purpose:** Create, edit, and track RFPs.
            *   **Key Actions:** Use RFP builder, send RFP invites, manage supplier submissions, link verifications.
            *   **Data Displayed:** Table of RFPs with status, associated suppliers, documents.
            *   **UI Components:** `NeumorphicTable`, Modals for RFP creation/editing, File Upload.
        *   **Invoice Analysis (Fraud Detection):**
            *   **Purpose:** Compare submitted invoices against RFP terms and market values.
            *   **Key Actions:** Upload invoices, link to RFPs, trigger AI analysis (simulated for demo), view discrepancy reports.
            *   **Data Displayed:** Table of invoices, comparison views (RFP vs. Invoice), AI-generated insights/flags.
            *   **UI Components:** `NeumorphicTable`, File Upload, specialized comparison views, `NeumorphicBadge` for flags.

---

**5. Field Operations (Location Vetting)**
    *   **Purpose:** Manage and track physical location verifications.
    *   **Sub-Menus:**
        *   **Location Verification Queue:**
            *   **Purpose:** Assign and track pending physical site visits.
            *   **Key Actions:** Assign tasks to field agents, view status.
            *   **Data Displayed:** Table of locations to be verified (Supplier, Address, Assigned Agent, Status).
            *   **UI Components:** `NeumorphicTable`.
        *   **Map Overview:**
            *   **Purpose:** Visualize supplier locations and verification points.
            *   **Key Actions:** View locations on a map, filter by status or region.
            *   **Data Displayed:** Interactive map with pins for supplier addresses, color-coded by verification status or risk. Animated pins for recently verified/flagged locations.
            *   **UI Components:** Map Component (e.g., React Leaflet styled neumorphically), `NeumorphicCard` for map controls.
        *   **Submitted Location Verifications:**
            *   **Purpose:** Review data submitted by field agents.
            *   **Key Actions:** View photos, GPS coordinates, agent notes.
            *   **Data Displayed:** Table of submitted verifications, with links to detailed reports including images.
            *   **UI Components:** `NeumorphicTable`, Image viewer, Map snippet showing captured GPS.

---

**6. Reporting & Analytics**
    *   **Purpose:** Generate and view comprehensive reports and analytical insights.
    *   **Sub-Menus:**
        *   **Standard Reports:**
            *   **Purpose:** Access pre-defined system reports.
            *   **Key Actions:** Select report type, set parameters (date range, supplier group), generate, view, download PDF.
            *   **Data Displayed:** List of available reports (e.g., Overall Vetting Summary, Risk Category Distribution, Compliance Status Report, SLA Performance, Cost Analysis).
            *   **UI Components:** `NeumorphicSelect` for report type, Date Range Pickers, `NeumorphicButton` (Generate/Download).
        *   **Custom Report Builder:**
            *   **Purpose:** Allow admins to create their own reports.
            *   **Key Actions:** Select data fields, apply filters, choose chart types, save report templates.
            *   **Data Displayed:** Interface for dragging/dropping fields, setting up visualizations.
            *   **UI Components:** More complex interactive builder UI.
        *   **AI Insights Dashboard (LLM Driven):**
            *   **Purpose:** View insights generated by the LLM on vetting results and potential fraud.
            *   **Key Actions:** Explore summarized findings, red flags, and recommendations.
            *   **Data Displayed:** Text summaries, lists of potential issues, confidence scores.
            *   **UI Components:** `NeumorphicCard` for text display, `NeumorphicBadge`.
        *   **Endleleni Financials (Verification Costs):**
            *   **Purpose:** Track costs associated with verifications ordered via Endleleni (or other 3rd parties).
            *   **Key Actions:** View cost breakdowns, reconcile invoices.
            *   **Data Displayed:** Table of verification orders, costs, payment status. Charts showing cost trends.
            *   **UI Components:** `NeumorphicTable`, ApexCharts.

---

**7. Administration**
    *   **Purpose:** System-level configuration, user management, and monitoring for Super Admins.
    *   **Sub-Menus:**
        *   **User Management:**
            *   Manage Users: Add, edit, deactivate users. Assign roles.
            *   Manage Roles & Permissions: Define roles (e.g., Admin, Vetting Officer, Read-Only) and their specific access rights (RBAC).
            *   **UI Components:** `NeumorphicTable`, Forms for user/role creation.
        *   **System Configuration:**
            *   **Vetting Check Management:** Define/edit available vetting checks (from page 19 of overview & `vetting.pdf`), associate data sources (MIE, CPB, etc.), set default validity periods, costs, risk scoring rules.
            *   **API Integration Management:** Configure and monitor status of integrations with 3rd party services (MIE, XDS, n8n, Coupa, LLMs).
            *   **Notification Templates:** Customize email/SMS templates for consent, alerts, etc.
            *   **PDF Report Templates:** Manage/upload templates for standardized PDF reports.
            *   **White-Label Settings:** Configure branding for white-label clients (logo, colors).
            *   **Platform Settings:** General app settings (e.g., default currency ZAR, date formats).
            *   **UI Components:** Forms, `NeumorphicTable`, File Uploads.
        *   **Audit Logs:**
            *   User Activity Log: Track actions performed by users.
            *   System Event Log: Log important system events, errors, API calls.
            *   Data Access & Changes Log: Who accessed/modified what data and when (POPIA).
            *   **UI Components:** `NeumorphicTable` with robust filtering.
        *   **Platform Health & Monitoring:**
            *   **Purpose:** Monitor system performance and status.
            *   **Data Displayed:** Server status, API latencies, database connections, error rates.
            *   **UI Components:** KPI Cards, Line charts (ApexCharts).
        *   **Data Management:**
            *   Data Import/Export (for bulk operations if needed).
            *   Data Archival Rules.
            *   Duplicate Detection Management (rules and overrides).
            *   **UI Components:** Forms, `NeumorphicTable`.

---

**8. Help & Support**
    *   **Purpose:** Provide assistance and resources to users.
    *   **Sub-Menus:**
        *   **Knowledge Base / FAQs:** Searchable articles and guides.
        *   **System Documentation:** Detailed guides on VETTPRO features.
        *   **Contact Support:** Form or details to reach out for help.
        *   **Release Notes:** Information on new features and updates.

---

**9. [User Avatar/Name] (Top Right or Sidebar Bottom)**
    *   **Purpose:** Logged-in user's personal settings.
    *   **Sub-Menus (typically a dropdown):**
        *   **My Profile:** View/edit personal details.
        *   **Account Settings:** Change password, manage 2FA, notification preferences.
        *   **Theme Toggle:** (If not a global button) Switch between Light/Dark Neumorphic themes.
        *   **Logout.**

