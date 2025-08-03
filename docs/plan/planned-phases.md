### A New, Decisive & Actionable Project Plan

Here is a revised, more detailed, and better-aligned project plan that incorporates all the new information. This plan is a synthesis of the Purple Softworks proposal and your specific directives.

**Guiding Philosophy:** We will follow the phased approach from the proposal, but with your technical choices and priorities baked in. We will build the backend "plumbing" first (Supabase, n8n, MIE) and then build the frontend UI on top of that solid foundation.

---

### **VettPro 14-Week Production Development Plan (Revision 2)**

#### **Phase 0: Foundational Headstart (July 15 – July 31)**

This phase runs in parallel with final UI/UX design in Figma. It's about preparing the technical groundwork.

*   **Milestone Goal (End of July):** A fully configured development environment with a live database connection and a skeleton application ready for feature development.
*   **Developer 1 (Backend & Infra Focus):**
    *   **Task 1: Setup Supabase Project:** Create the new Supabase project. Secure and store the project URL and `anon` / `service_role` keys in a secrets manager (e.g., Doppler, or a simple `.env.local` for now).
    *   **Task 2: Initial Schema & Migrations:** Using Prisma, define and migrate the schemas for the **first set of core tables** needed for Epic 4.1 & 4.2: `main.users`, `main.accounts`, `main.sessions`, `main.vetting_cases`, and `audit.logs`.
    *   **Task 3: Setup n8n:** Configure the n8n instance (self-hosted via Docker is fine) and establish a secure connection to the Supabase database.
*   **Developer 2 (Frontend Focus):**
    *   **Task 1: Setup Next.js Project:** Initialize the Next.js 15 project using the structure of your demo app.
    *   **Task 2: Integrate Supabase Client:** Install the Supabase JS client and configure it within the Next.js application.
    *   **Task 3: Component Library Scaffolding:** Set up `shadcn/ui` and create the folder structure for our custom Neumorphic components.
    *   **Task 4: Setup Authentication:** Implement the `NextAuth.js` scaffolding with the Supabase adapter.

---

#### **Phase 1: MVP Core Launch (August 1 – September 12)**

**Goal:** Deliver a production-ready platform that solves the core pre-vetting workflow. This aligns with Phase 1 of the Purple Softworks proposal.

*   **Weeks 1-2 (Aug 1 - Aug 15): Core Engine & MIE Integration**
    *   **Milestone:** The MIE vetting workflow is fully automated from a trigger to a result in the database.
    *   **Developer 1 (n8n & Backend):**
        *   **PRIORITY 1:** Adapt your existing n8n workflow. Replace the Google Sheets node with a Supabase/Postgres node. The workflow should now read a `vetting_case` ID, call MIE, and update the `individual_checks` table in Supabase upon receiving the webhook.
        *   Build out the full n8n workflows for **all MIE checks** listed in the provided image (`BAV`, `CONTRACE`, `COID`, etc.), using the "Adapter Pattern" we discussed.
        *   Build the backend API (`POST /api/vetting/cases`) that creates a case and triggers this n8n workflow.
    *   **Developer 2 (Auth & UI Foundation):**
        *   Build the full, functional UI for **User Authentication** (Epic 4.1) and **User Management** (for the Super Admin).
        *   Build the UI for the **Admin Audit Trail** (Epic 4.4), connecting it to the `audit.logs` table.

*   **Weeks 3-4 (Aug 16 - Aug 29): Vetting & Consent UI**
    *   **Milestone:** A Risk Agent can fully manage a pre-vetting case from initiation to completion via the UI.
    *   **Developer 1 (Backend & PDF):**
        *   Finalize all backend logic for the `Vetting Case Detail View`.
        *   Implement the server-side PDF generation for the "Consolidated Final Report" and the "Interim Dossier."
    *   **Developer 2 (Frontend):**
        *   Build the UI for the **"Initiate New Vetting"** wizard (Epic 4.2).
        *   Build the UI for the **`LiveMissionControl`** data table.
        *   Build the UI for the **"Vetting Case Detail View"** and the **"Interim Dossier"** modal (Epic 4.2 & 4.3).

*   **Weeks 5-6 (Aug 30 - Sep 12): Testing, UAT, and Hardening**
    *   **Milestone:** A stable, tested, and secure MVP is ready for deployment.
    *   **Both Developers:**
        *   **End-to-End Testing:** Rigorously test the entire flow: create a user, log in, initiate a case, have n8n run a *real* MIE check, see the result in the UI, view the dossier.
        *   **Security Hardening:** Implement all security requirements from PRD Section 8.0 for the features built so far.
        *   **Bug Fixing & UAT Support:** Address bugs found during testing and support client UAT.

---

#### **Phase 2: Advanced Capabilities (September 15 – October 17)**

This aligns with Phase 2 of the Purple Softworks proposal but with our specific epic breakdown.

*   **Weeks 7-9 (Sep 15 - Oct 3): Project Campaigns & Continuous Vetting**
    *   **Milestone:** The "Project-Based Vetting" and "Continuous Post-Vetting" features are fully functional.
    *   **Developer 1 (Backend & n8n):**
        *   Implement the backend APIs for creating and managing projects (`/api/projects`).
        *   Build the "Intelligent Project Execution Engine" n8n workflow that handles cohort processing and skips unnecessary checks.
        *   Build the cron-job-triggered n8n workflow for continuous post-vetting.
    *   **Developer 2 (Frontend):**
        *   Build the UI for the **"Project Creation Wizard"** (Epic 4.6).
        *   Build the UI for the **"Project Dashboard & Monitoring"** page (Epic 4.6).
        *   Build the UI for the **"Admin Schedule Configuration"** for post-vetting (Epic 4.5).

*   **Weeks 10-12 (Oct 4 - Oct 24): AI & Field Operations**
    *   **Milestone:** The AI engine and Field Agent PWA are complete.
    *   **Developer 1 (AI & Backend):**
        *   Integrate with the chosen LLM API.
        *   Build the n8n workflow for "Unstructured-to-JSON" extraction.
        *   Build the backend APIs for the **"Invoice DNA" engine** (Epic 4.6) and the **Rules Engine** (Epic 4.8).
    *   **Developer 2 (Frontend & PWA):**
        *   Build the UI for the **"AI Verification Queue"** (Human-in-the-Loop).
        *   Build the UI for the "Invoice DNA" side-by-side comparison view.
        *   Build the complete **Field Agent PWA** with offline storage and background sync capabilities (Epic 4.7).

*   **Weeks 13-14 (Oct 25 - Nov 7): Final Integration, Executive Dashboard & Handoff**
    *   **Milestone:** All features from the PRD are complete, tested, and ready for final project handoff.
    *   **Both Developers:**
        *   Build the full **Executive Dashboard**, integrating the advanced visualization libraries (`deck.gl`, `react-force-graph`).
        *   Final, full-system integration testing.
        *   Address all remaining bugs and UAT feedback.
        *   Finalize all documentation for project handoff.