### VettPro Menu & Page Content Breakdown

#### **1. Main Dashboard / Home (`/dashboard`)**

*   **Context:** This is the user's "at-a-glance" landing page. Its purpose is to immediately orient the user and surface the most urgent and relevant information based on their role, allowing them to decide what to do next without having to search.
*   **Content:**
    *   **For a Risk Agent (Sarah):**
        *   **"My Priority Queue" Widget:** A list of the top 5 cases requiring her immediate attention (e.g., awaiting her review, consent expired, adverse finding received).
        *   **"Active Cases Overview" Widget:** High-level counts of her cases, broken down by status (e.g., `12 In Progress`, `5 Pending Consent`).
        *   **"Recent Activity Feed":** A live feed of recent updates on her cases (e.g., "Consent received for ABC Mining," "MIE check completed for XYZ Logistics").
    *   **For a Super Admin (David):**
        *   **"System Health" Widget:** Status indicators for key systems (Database, n8n, MIE Integration).
        *   **"User Activity" Widget:** Metrics like "Users Online," "Failed Logins (24h)."
        *   **"Audit Log" Snippet:** A feed of the 5 most recent high-privilege actions (e.g., "David created new user," "Sarah cancelled case").

#### **2. Vetting Operations** (Core workspace for daily tasks)

*   **2.1. Initiate New Vetting (`/vetting/initiate`)**
    *   **Context:** The single starting point for creating any new vetting case (pre-vetting, employee, etc.). The goal is clean, fast, and accurate data capture.
    *   **Content:** A multi-step form/wizard. Step 1: Select entity type (Company, Employee). Step 2: Fill in the core details (name, identifier, contact info). Step 3: Select the required vetting package or individual checks. Step 4: Review and submit.

*   **2.2. Active Cases Mission Board (`/vetting/active-cases`)**
    *   **Context:** The primary workspace for Risk Agents. This is not just a list; it's an interactive "mission control" for managing all ongoing cases. The goal is to provide clarity on status and identify bottlenecks.
    *   **Content:** A powerful data table of all active cases. Key features will include:
        *   Advanced filtering (by status, agent, priority).
        *   A visual progress bar for each case.
        *   Quick action buttons on each row (e.g., "Resend Consent Link," "View Details").

*   **2.3. Consent Management Hub (`/vetting/consent`)**
    *   **Context:** A specialized view to manage the single biggest time-sink in the vetting process. This page is designed to help agents quickly resolve consent-related issues.
    *   **Content:** A dashboard focused solely on consent.
        *   A data table of all cases currently in `Pending Consent` status.
        *   Columns showing when the request was sent and when the link expires.
        *   A "Consent Journey" stepper for each request (`Sent -> Opened -> Submitted`).
        *   Tools for batch-resending reminders or escalating unresponsive requests.

*   **2.4. Completed Reports (`/vetting/completed`)**
    *   **Context:** The searchable archive of all finalized vetting cases. This serves as the library of historical intelligence.
    *   **Content:** A data table of all cases with a `Completed` status.
        *   Powerful search functionality to find past reports by entity name, identifier, or date.
        *   Each row will have a "View Report" button leading to a clean, printable summary of the case findings.
        *   Includes an "Export to PDF" function.

*   **2.5. Post-Vetting Schedule (`/vetting/post-vetting`)**
    *   **Context:** A forward-looking calendar/schedule that provides visibility into the automated continuous monitoring system.
    *   **Content:** A calendar view and a list view showing all suppliers and their next scheduled re-vetting date. It will allow Risk Agents to see which suppliers are due for a check in the coming weeks/months and to manually trigger a re-vetting if needed.


#### **3. Vetting Projects** (The proactive, campaign-management workspace)

*   **3.1. Vetting Projects List (`/vetting/projects`)**
    *   **Context:** This is the portfolio view for all batch-vetting campaigns. It allows Risk Agents and Managers to see the status of all ongoing and past projects at a high level.
    *   **Content:** A data table listing all projects. Each row displays the project name, its overall completion progress (via a progress bar), the number of cases it contains, and its current status (e.g., `In Progress`, `Completed`). It includes a primary button to launch the "Create New Project" wizard.

*   **3.2. Project Creation Wizard (`/vetting/projects/new`)**
    *   **Context:** A dedicated, multi-step user flow for creating a new batch-vetting campaign. This is where the Risk Agent defines the project, builds the supplier cohort using advanced filters, and selects the checks to be run.
    *   **Content:** A full-screen modal wizard guiding the user through: (1) Naming the project, (2) Using an advanced filter interface to select a group of suppliers, (3) Choosing a standard set of vetting checks for the batch, and (4) Reviewing and executing the project.

*   **3.3. Project Dashboard (`/vetting/projects/[id]`)**
    *   **Context:** A dynamic page that serves as the "mission control" for a single, active vetting project. It provides an aggregate view of the entire campaign's health and progress.
    *   **Content:** A dashboard featuring high-level KPIs and charts (e.g., a large progress gauge for overall completion, a breakdown of cases by status) and a detailed data table listing every individual vetting case that is part of that specific project.


#### **4. Supplier Intelligence** (The master database of knowledge)

*   **4.1. Supplier Directory (`/suppliers`)**
    *   **Context:** The master CRM for all suppliers, both active and historical. This is the central repository of knowledge.
    *   **Content:** A comprehensive data table listing every supplier in the system.
        *   Columns for name, status (`Active`, `Suspended`), overall risk score, and last vetting date.
        *   Clicking a supplier's name will navigate to their detailed "Supplier 360° View."

*   **4.2. Supplier Risk Dashboard (`/suppliers/risk-dashboard`)**
    *   **Context:** A high-level business intelligence dashboard for managers and senior risk officers to understand the overall risk landscape of their supplier base.
    *   **Content:** A series of interactive charts and KPIs, including:
        *   A pie chart showing the distribution of suppliers by risk tier (Low, Medium, High).
        *   A bar chart showing the top 10 riskiest suppliers.
        *   A map of South Africa showing the geographic concentration of high-risk suppliers.
        *   A trend line chart showing the average supplier risk score over time.

*   **4.3. Supplier 360° View (`/suppliers/[id]`)**
    *   **Context:** A dynamic page that serves as the definitive profile for a single supplier. This page aggregates every piece of information VettPro has on the entity.
    *   **Content:** A multi-tabbed view:
        *   **Summary Tab:** Core details, current status, and overall risk score.
        *   **Vetting History Tab:** A list of all vetting cases (pre- and post-vetting) ever conducted for this supplier.
        *   **Risk Events Tab:** A chronological log of every event that has impacted their risk score (from the `risk_events` table).
        *   **Financials Tab:** A history of all invoices analyzed and their associated fraud scores.

#### **5. Financial Forensics** (The fraud-fighting module)

*   **5.1. Invoice Analysis Dashboard (`/financials/invoice-dashboard`)**
    *   **Context:** The central hub for the "Invoice DNA" engine, allowing agents to see the results of automated fraud analysis.
    *   **Content:** A queue of recently analyzed invoices. Each entry shows the invoice number, supplier, amount, and a "Fraud Probability Score." High-risk invoices are flagged in red. Clicking an entry opens the detailed comparison view.

*   **5.2. Upload Invoice for Analysis (`/financials/analyze`)**
    *   **Context:** The tool for manually submitting an invoice for analysis.
    *   **Content:** A simple form with a file uploader for the invoice PDF and fields to link it to a specific supplier and, optionally, an RFP. Submitting the form triggers the n8n analysis workflow.

*   **5.3. RFP Management (`/financials/rfps`)**
    *   **Context:** A repository to store and manage the "baseline" RFP documents that invoices will be compared against.
    *   **Content:** A data table of all uploaded RFPs. Users can upload new RFPs and the system will use AI to extract the key line items and pricing to be stored as the baseline for comparison.

#### **6. Field Operations Command** (The back-office for on-site work)

*   **6.1. Operations Map View (`/field-ops/map`)**
    *   **Context:** A real-time, geographical command center for managing on-site tasks.
    *   **Content:** An interactive map (using Leaflet) displaying pins for all active verification tasks. Pins will be color-coded by status (e.g., blue for 'Assigned', green for 'Completed'). Clicking a pin shows a summary of the task and the assigned agent.

*   **6.2. Verification Task Queue (`/field-ops/queue`)**
    *   **Context:** The administrative tool for creating and assigning physical verification jobs.
    *   **Content:** A data table where a Risk Agent or Admin can create a new task (e.g., "Verify address for ABC Mining"), write instructions, set a due date, and assign it to a specific Field Agent (Themba).

*   **6.3. Field Agent Management (`/field-ops/agents`)**
    *   **Context:** The CRM for the field agent workforce.
    *   **Content:** A list of all registered field agents, with details on their current workload, performance metrics (e.g., average task completion time), and status.

#### **7. Administration** (The Super Admin's toolbox)

*   **7.1. User Management (`/admin/users`)**
    *   **Context:** The interface for all user-related administrative tasks.
    *   **Content:** A data table for performing full CRUD (Create, Read, Update, Deactivate) operations on user accounts and managing their roles.

*   **7.2. System Configuration (`/admin/config`)**
    *   **Context:** A central place for admins to tune the system's behavior without code changes.
    *   **Content:** A tabbed interface with sub-pages for:
        *   **Post-Vetting Rules:** The UI to set the re-vetting frequencies for different risk tiers.
        *   **Risk Engine Rules:** The UI for the business rules engine, allowing admins to define conditions and their impact on risk scores.
        *   **Integrations:** A secure area to manage API keys and credentials for external services like MIE and the email provider.

*   **7.3. Platform Health & Monitoring (`/admin/health`)**
    *   **Context:** A technical dashboard for monitoring the PaaS instance.
    *   **Content:** Real-time status checks and simple metrics for the application server, database connection, and n8n workflow engine.

*   **7.4. Audit Trail (`/admin/audit-logs`)**
    *   **Context:** The user-facing interface for the immutable audit log, designed for compliance and security investigations.
    *   **Content:** The powerful, searchable, and filterable data table of all system actions as defined in the PRD.
---