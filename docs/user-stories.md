
---

### 1. User Story: Core Supplier Pre-Vetting (The "Happy Path")

**Persona:** Tumi, the Risk Agent.
**Goal:** Onboard a single, new supplier, "Innovate Steelworks," as quickly and efficiently as possible.

**Narrative:**

Tumi receives an email from the procurement department to urgently onboard a new supplier, "Innovate Steelworks."

1.  **Login & Initiate:** Tumi logs into VettPro and lands on her **Dashboard**. She navigates via the sidebar to **Vetting Operations** and clicks **"Initiate New Vetting."**

2.  **Case Creation:** On the **Initiate New Vetting Page**, she fills in the company details: name, registration number, and the primary contact's email. She selects the "Standard Supplier Pre-Vetting" package.

3.  **Consent Request:** The system creates the case and lands her on the **Vetting Case Detail View**. The status is `INITIATED`. She clicks the **"Request Consent"** button. The system sends a digital signature link to the supplier, and the case status updates to `PENDING CONSENT`.

4.  **Supplier Interaction (External):** Jabu, at Innovate Steelworks, receives the email, clicks the secure link, and signs on the **Public Consent Page**.

5.  **Automated Checks:** The system detects the consent, updates the case status to `CHECKS IN PROGRESS`, and the n8n workflow automatically dispatches the required checks (CIPC, Bank Account, etc.) to the **MIE Service**.

6.  **Receiving Results:** Over the next few days, the **MIE Service** sends results back asynchronously via webhooks. The n8n workflow catches these, updates the individual check statuses in the database, and Tumi can see this progress in real-time on the **Vetting Case Detail View**.

7.  **Final Report & Decision:** Once all checks are complete, the system automatically updates the case status to `COMPLETED`. Tumi receives a notification. She navigates to the **Vetting Case Detail View**, clicks **"View Report,"** reviews the consolidated findings which are all clear, and formally approves the supplier.


---

### 2. User Story: Individual Employee Vetting

**Persona:** Tumi, the Risk Agent.
**Goal:** Vet a potential new hire, John Doe, for a sensitive finance position.

**Narrative:**

HR has shortlisted John Doe and needs Tumi to perform an executive-level background check.

1.  **Initiation:** Tumi goes to the **"Initiate New Vetting"** page. This time, she selects the "Individual" entity type.
2.  **Case Creation:** The form adapts. She enters John's Full Name, SA ID Number, and email. She selects the "Executive Pre-Employment Screening" package, which includes checks like Criminal Record, Credit History, and Qualification Verification.
3.  **Consent & System Work:** The flow is identical to the supplier vetting: the case is created, she requests consent from the **Case Detail View**, John signs on the **Public Consent Page**, and the n8n workflow dispatches the required checks to MIE.
4.  **Review:** Tumi monitors the **Case Detail View** as results come in. She sees the Qualification check is taking longer. When all results are in, she opens the **Final Report**, sees that John's qualifications and credit history are clear, and sends the "All Clear" report to HR.


---

### 3. User Story: RFP & Invoice DNA Analysis

**Persona:** Tumi, the Risk Agent.
**Goal:** Investigate a suspicious invoice from a supplier, "Rapid Drillers," by comparing it to the original RFP.

**Narrative:**

An invoice from "Rapid Drillers" is automatically ingested from Coupa. The amount seems high to Tumi.

1.  **Investigation Start:** Tumi navigates to the **Financial Forensics -> Invoice Analysis Dashboard**. She sees the new invoice from "Rapid Drillers" has been automatically flagged by the system with a high "Fraud Probability Score."
2.  **Manual Upload (Alternative Start):** Alternatively, if the invoice came via email, she would go to **"Upload Invoice for Analysis,"** upload the PDF, and link it to the "Rapid Drillers" supplier and the original RFP for the project.
3.  **The "Invoice DNA" View:** Tumi clicks "View Analysis" on the invoice row. This takes her to a dedicated **Invoice vs. RFP Comparison Page**.
4.  **Analysis:** The screen shows a side-by-side view. On the left are the line items from the invoice, and on the right, the line items from the original RFP.
    *   **Green lines** automatically connect matching items (e.g., "Drill Bit XJ-5" on both).
    *   **A glowing red line** connects the "Site Transport" line item. The invoice shows R30,000, while the RFP quoted R15,000. The view explicitly highlights the "+100%" discrepancy.
    *   Another item, "Emergency Call-out Fee," appears on the invoice but has no corresponding item in the RFP, and is flagged as an "Unspecified Charge."
5.  **Action & Outcome:** Tumi now has concrete evidence. She updates the supplier's risk score, adds an event to their **Risk Events** log, and sends a query to the procurement team, attaching an export of the VettPro analysis. The potential fraud is caught before payment.


---

### 4. User Story: Field Operations & Physical Verification

**Persona:** Themba, the Field Agent & Tumi, the Risk Agent (as the dispatcher).
**Goal:** Physically verify the business address of a new supplier, "Rocksteady Logistics," in a remote area with poor connectivity.

**Narrative:**

1.  **Task Creation (Tumi):** During a pre-vetting case for "Rocksteady Logistics," Tumi needs to confirm their depot address. From the **Vetting Case Detail View**, she clicks "Add Task" and selects "Field Verification." This takes her to the **Verification Task Queue** page, where she creates a new task: "Verify Rocksteady Depot," enters the address, and assigns it to Themba.

2.  **Receiving the Task (Themba):** Themba, at the start of his day in an area with WiFi, opens the **Field Agent PWA** on his phone. The app syncs and his new task from Tumi appears in his personal queue. He can see all the instructions and the address on a map.

3.  **Offline Work:** Themba drives to the remote depot location, losing internet connectivity along the way. This is not a problem. He opens the task in the PWA, which works perfectly offline.
    *   He uses the app to take a time-stamped, geotagged photo of the depot entrance.
    *   He confirms the GPS coordinates match.
    *   He adds a note: "Depot is operational. Fleet of 10 trucks present."
    *   He gets a signature from the site foreman directly on his phone's screen.
    *   He clicks **"Submit."**

4.  **Offline Storage & Background Sync:** The PWA saves the entire report (photos, notes, signature) securely in the phone's local storage (IndexedDB). A "Pending Upload" status is shown.

5.  **Automated Completion:** Later that day, Themba drives back into town and his phone reconnects to a 4G network. The PWA's service worker automatically detects the connection and syncs the stored report to the VettPro backend in the background. Themba doesn't have to do anything.

6.  **Final Review (Tumi):** Tumi receives a notification in VettPro: "Field Verification for Rocksteady Logistics completed." She opens the **Vetting Case Detail View**, goes to the "Checks" tab, and can now see the completed verification report from Themba, including the photos and notes.

