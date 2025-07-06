# VettPro - Design & UX Specification

---

## **1.1: Login Page**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 4.1):** "As a registered user (like Sarah the Risk Agent or David the Admin), I need a secure, clear, and simple way to log into the VettPro platform so that I can access my dashboard and perform my duties."
*   **Design Intent:** To provide a frictionless and secure entry point to the application. The page must be visually clean, immediately establish the VettPro brand identity through its Neumorphic design, and instill a sense of trust and professionalism. The focus is on clarity and ease of use, minimizing cognitive load for the user.

**2. Layout & Wireframe**
*   **Description:** A single-column, vertically and horizontally centered layout. The background will feature the animated wave effect defined in `globals.css` to create a dynamic, high-tech feel.
    ```
    - **Page Layout:** Full-screen container with centered content.
      - [ELEMENT: Animated Wave Background] - Full-screen, z-index -1, using styles from globals.css.
      - **Center Column (max-width: 450px):**
        - [COMPONENT: VettPro Logo] - Prominently displayed at the top.
        - [COMPONENT: NeumorphicCard] - Inset style, containing the login form.
          - [ELEMENT: H1 Title] - "Welcome Back"
          - [ELEMENT: P Subtitle] - "Log in to your VettPro account."
          - [COMPONENT: Email Input Field]
          - [COMPONENT: Password Input Field]
          - [CONTAINER: Options Row] - Flexbox container with space-between.
            - [COMPONENT: NeumorphicCheckbox] - "Remember Me"
            - [ELEMENT: Link] - "Forgot Password?"
          - [COMPONENT: NeumorphicButton (Primary)] - "Log In"
    ```

**3. Component Breakdown & Specification**
*   **Component: `VettPro Logo`**
    *   **Type:** `Image`
    *   **Content:** The `public/vettpro-logo.svg` file.
    *   **Interaction:** Non-interactive.
*   **Component: `NeumorphicCard`**
    *   **Type:** A `div` styled with Neumorphic `inset` styling from `neumorphic.css`.
    *   **Content:** Contains all form elements.
    *   **Styling:** Will have a soft `inset` shadow and a slightly blurred `glassmorphism` background effect as defined in `custom.css` and `neumorphic.css` to sit subtly above the animated background.
*   **Component: `Email Input Field`**
    *   **Type:** `NeumorphicInput` (A styled `Input` from `shadcn/ui`).
    *   **Content:**
        *   `Label`: "Email Address"
        *   `Placeholder`: "sarah.jones@vettpro.com"
        *   `Icon (Lucide React)`: `Mail` icon on the left.
    *   **Interaction:** Standard text input. Real-time validation for email format.
*   **Component: `Password Input Field`**
    *   **Type:** `NeumorphicInput`.
    *   **Content:**
        *   `Label`: "Password"
        *   `Placeholder`: "••••••••"
        *   `Icon (Lucide React)`: `Lock` icon on the left.
        *   `Toggle Visibility Icon (Lucide React)`: `Eye` / `EyeOff` on the right.
    *   **Interaction:** Password type input. Clicking the visibility icon toggles between password and text type.
*   **Component: `NeumorphicCheckbox`**
    *   **Type:** `NeumorphicCheckbox` from `src/components/forms/selection/`.
    *   **Content:**
        *   `Label`: "Remember Me"
    *   **Interaction:** On click, toggles between checked/unchecked states with a smooth `inset` shadow transition.
*   **Component: `NeumorphicButton`**
    *   **Type:** `Button` from `shadcn/ui` with primary neumorphic variant styles.
    *   **Content:**
        *   `Text`: "Log In"
    *   **Interaction:**
        *   **State:** Disabled until both email and password fields are non-empty and email is valid.
        *   **Action:** On click, triggers `POST /api/auth/login`.
        *   **Animation:** Standard "press-down" neumorphic animation. While the API call is pending, the text is replaced by a `CircularProgressRing` component.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The background wave animation from `globals.css` is active. The central login card is hidden.
    2.  **Animation:** The `NeumorphicCard` uses Framer Motion to animate in, referencing the `slide-up-fade` keyframes in `animations.css`. `initial={{ opacity: 0, y: 20 }}` and `animate={{ opacity: 1, y: 0 }}` with a `duration` of 0.5s and `ease: "easeOut"`.
*   **Flow 2: Login Success**
    1.  **User Action:** User clicks "Log In" with valid credentials.
    2.  **Animation:** After the API call succeeds, the `NeumorphicCard` animates out using Framer Motion's `AnimatePresence` with an `exit={{ opacity: 0, scale: 0.95 }}` prop. The application then navigates to the `/dashboard` route.
*   **Flow 3: Login Failure**
    1.  **User Action:** User clicks "Log In" with invalid credentials.
    2.  **Feedback:** The `NeumorphicCard` performs a slight horizontal shake animation to indicate an error.
    3.  **Notification:** A toast notification using the `Sonner` component (from `src/components/ui/sonner.tsx`) appears at the top of the screen with the message: "Invalid email or password. Please try again." The toast will have a `destructive` variant style.

**5. Responsive Design Behavior**
*   **Tablet (max-width: 768px):** The layout is maintained. The `max-width` of the central card is preserved to prevent it from becoming too wide on tablet screens.
*   **Mobile (max-width: 480px):**
    *   The `NeumorphicCard`'s horizontal padding is reduced, and its `width` is set to `90vw`.
    *   Font sizes are adjusted using the responsive text classes (e.g., `responsive-text-base`) from `custom.css`.
    *   The VettPro logo's size is slightly reduced.

**6. Edge Cases & Empty States**
*   **Error State (API Down):** If the `POST /api/auth/login` call fails due to a server error (e.g., 500), the `Sonner` toast will display a generic error: "Unable to connect to VettPro. Please check your internet connection or try again later."
*   **Empty State:** Not applicable as the form is the primary content.
*   **"Forgot Password?" Link:** Clicking this link will navigate the user to the `/forgot-password` page. The specification for this page will be created in a subsequent task.

---

## **1.2: Main Dashboard / Home**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 4.1 & ux-design-menu.md):** "As a user logging in, I need an 'at-a-glance' landing page that immediately orients me by surfacing the most urgent and relevant information for my role, so I can decide what to do next without having to search."
*   **Design Intent:** To create a role-specific, dynamic command center. The dashboard should be modular, presenting data in easily digestible, neumorphic widgets. For a Risk Agent, the focus is on actionable tasks and case updates. For a Super Admin, the focus is on system health and user oversight. The design must be clean, prioritize information hierarchy, and use animations to guide the user's attention.

**2. Layout & Wireframe**
*   **Description:** A responsive grid layout that adapts to screen size. The page will utilize the main `DashboardLayout` which includes the `CurvedSidebar` and `TopMenuBar`.
    ```
    - **Page Layout:** Main content area using a responsive grid (e.g., `responsive-grid` from custom.css).
      - **Grid Columns:** 3 on desktop, 2 on tablet, 1 on mobile.
      - **Page Title:** "Dashboard"

    - **WIDGETS FOR RISK AGENT (SARAH):**
      - [WIDGET 1: Priority Queue] - Spans 2 columns on desktop.
      - [WIDGET 2: Active Cases Overview]
      - [WIDGET 3: Recent Activity Feed] - Spans 3 columns on desktop.

    - **WIDGETS FOR SUPER ADMIN (DAVID):**
      - [WIDGET 1: System Health]
      - [WIDGET 2: User Activity]
      - [WIDGET 3: Audit Log Snippet]
    ```

**3. Component Breakdown & Specification**
*   **Component: `Dashboard Widget` (Base Component)**
    *   **Type:** `NeumorphicCard` (Elevated style). This will be a reusable wrapper component.
    *   **Content:**
        *   `Header`: Contains an `Icon (Lucide React)` and a `H2 Title`.
        *   `Body`: Content area for lists, charts, or KPIs.
    *   **Styling:** Uses `var(--neumorphic-card-bg)`, `var(--neumorphic-shadow-convex)`, and `var(--neumorphic-shadow-concave)`. Will have a subtle hover effect (slight lift).
*   **Component: `Priority Queue Widget` (For Risk Agent)**
    *   **Content:**
        *   `Header`: `Icon: AlertTriangle`, `Title: My Priority Queue`.
        *   `Body`: An ordered list of the top 5 cases requiring attention. Each list item shows:
            *   Entity Name (e.g., "ABC Mining").
            *   Case ID.
            *   Reason for priority (e.g., "Adverse Finding Received").
            *   A `NeumorphicButton` (subtle variant) for "View Case".
    *   **Interaction:** Clicking "View Case" navigates to `/vetting/cases/{id}`.
*   **Component: `Active Cases Overview Widget` (For Risk Agent)**
    *   **Content:**
        *   `Header`: `Icon: FolderKanban`, `Title: Active Cases`.
        *   `Body`: A set of KPI displays. Each display is a `NeumorphicCard` (inset style) with a large number and a label (e.g., "12 In Progress", "5 Pending Consent", "2 Overdue").
*   **Component: `Recent Activity Feed Widget` (For Risk Agent)**
    *   **Content:**
        *   `Header`: `Icon: History`, `Title: Recent Activity`.
        *   `Body`: A chronological list of events. Each item shows:
            *   Timestamp (e.g., "5 mins ago").
            *   Description (e.g., "Consent received for XYZ Logistics").
*   **Component: `System Health Widget` (For Super Admin)**
    *   **Content:**
        *   `Header`: `Icon: Server`, `Title: System Health`.
        *   `Body`: A list of key systems (e.g., "Database", "n8n Workflow", "MIE Integration"). Each system has a status indicator dot (Green for 'Online', Red for 'Offline').
*   **Component: `User Activity Widget` (For Super Admin)**
    *   **Content:**
        *   `Header`: `Icon: Users`, `Title: User Activity`.
        *   `Body`: KPI displays similar to the Agent's overview (e.g., "15 Users Online", "3 Failed Logins (24h)").
*   **Component: `Audit Log Snippet Widget` (For Super Admin)**
    *   **Content:**
        *   `Header`: `Icon: ShieldCheck`, `Title: Recent High-Privilege Actions`.
        *   `Body`: A list of the 5 most recent audit log entries.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The grid is populated with `SkeletonLoader` components matching the size of each widget.
    2.  **Animation:** On data fetch, the `SkeletonLoader`s fade out. The widgets animate in using a staggered effect with Framer Motion. Each widget will use `initial={{ opacity: 0, y: 15 }}` and `animate={{ opacity: 1, y: 0 }}`, with the `transition` prop having a `delay` based on the widget's index (e.g., `delay: index * 0.1`).

**5. Responsive Design Behavior**
*   **Tablet (max-width: 1024px):** The grid collapses to 2 columns. Widgets will reflow naturally. The `Priority Queue` will now span 2 columns, taking a full row.
*   **Mobile (max-width: 768px):** The grid collapses to a single column. All widgets take the full width, stacked vertically. Font sizes are adjusted via `responsive-text-*` classes.

**6. Edge Cases & Empty States**
*   **Empty State (Priority Queue):** If the Risk Agent has no priority items, the widget body will display an illustration (e.g., a coffee cup), a `H3` title "All Clear!", and a message "You have no priority items in your queue."
*   **Empty State (Activity Feed):** If there is no recent activity, a message "No recent activity to display." will be shown.
*   **Error State (Data Fetch Failure):** If data for a specific widget fails to load, that widget will be replaced by an `ErrorState` component showing a "Could not load widget data" message and a "Retry" button that re-triggers the data fetch for that specific widget.

---

## **2. Vetting Operations**

---

### **2.1: Initiate New Vetting**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 4.2 & ux-design-menu.md):** "As a Risk Agent, I need a streamlined, guided process to start a new vetting case for any entity type, ensuring all required information is captured accurately and efficiently upfront to minimize downstream errors."
*   **Design Intent:** To create an intuitive, multi-step wizard that simplifies the complex process of initiating a vetting case. The design will use clear, sequential steps to reduce cognitive load. Each step will focus on a specific piece of information, using neumorphic form components for a consistent and clean aesthetic. Framer Motion will be used to provide smooth transitions between steps, making the process feel fluid and responsive.

**2. Layout & Wireframe**
*   **Description:** A single, centered `NeumorphicCard` that contains a progress stepper and the content for the current step.
    ```
    - **Page Layout:** Centered content within the main DashboardLayout.
      - **Page Title:** "Initiate New Vetting Case"
      - **Main Container (max-width: 800px):**
        - [COMPONENT: NeumorphicCard (Elevated)]
          - [COMPONENT: Stepper Component] - Shows current progress (e.g., Step 1 of 4: Select Type).
          - [CONTAINER: Step Content] - Animated container for the current step's form fields. Managed by Framer Motion's AnimatePresence.
            - [VIEW: Step 1: Entity Type]
            - [VIEW: Step 2: Core Details]
            - [VIEW: Step 3: Select Checks]
            - [VIEW: Step 4: Review & Submit]
          - [CONTAINER: Navigation Buttons] - A flex container at the bottom.
            - [COMPONENT: NeumorphicButton (Secondary)] - "Back" (hidden on Step 1).
            - [COMPONENT: NeumorphicButton (Primary)] - "Next" / "Submit".
    ```

**3. Component Breakdown & Specification**
*   **Component: `Stepper Component`**
    *   **Type:** Custom component.
    *   **Content:** Displays steps: "Entity Type", "Core Details", "Select Checks", "Review & Submit". The current step is highlighted.
    *   **Styling:** Uses neumorphic principles; active step is inset, future steps are flat.
*   **VIEW: `Step 1: Entity Type`**
    *   **Content:**
        *   `H2 Title`: "Select Entity Type"
        *   `NeumorphicRadioGroup`: With options "Company" and "Individual".
*   **VIEW: `Step 2: Core Details`** (Content changes based on Step 1 selection)
    *   **If "Company":**
        *   `H2 Title`: "Enter Company Details"
        *   `CompanyRegistrationInput`: For Company Name & Reg Number.
        *   `VATInput`: For VAT Number.
        *   `AddressInput`: For physical address.
        *   `PhoneInput`: For primary contact number.
        *   `NeumorphicInput`: For primary contact email.
    *   **If "Individual":**
        *   `H2 Title`: "Enter Individual's Details"
        *   `NeumorphicInput`: For Full Name & Surname.
        *   `SAIdInput`: For South African ID number.
        *   `PhoneInput`: For mobile number.
        *   `NeumorphicInput`: For email address.
*   **VIEW: `Step 3: Select Checks`**
    *   **Content:**
        *   `H2 Title`: "Select Vetting Package"
        *   `NeumorphicSelect`: To choose a pre-defined package (e.g., "Standard Pre-Vetting", "Executive Screening").
        *   `H3 Title`: "Or Select Individual Checks"
        *   A list of `NeumorphicCheckbox` components for each available check (e.g., "CIPC Check", "Credit Check", "Criminal Record Check"). Selecting a package pre-selects the relevant checkboxes.
*   **VIEW: `Step 4: Review & Submit`**
    *   **Content:**
        *   `H2 Title`: "Review Case Details"
        *   A read-only summary of all information entered in previous steps, grouped by section. Each section has an "Edit" button that navigates the user back to the corresponding step.
*   **Component: `Navigation Buttons`**
    *   **"Back" Button:** Navigates to the previous step. Disabled on Step 1.
    *   **"Next" Button:** Navigates to the next step. Disabled until the current step's required fields are valid. On Step 4, this button's text changes to "Submit".
    *   **"Submit" Button:** Triggers the `POST /api/vetting/cases` API call with all form data.

**4. User Interaction & Animations**
*   **Flow 1: Navigating Steps**
    1.  **User Action:** Clicks "Next" or "Back".
    2.  **Animation:** The current step's content slides out to the left (if going "Next") or right (if going "Back"), while fading out. The new step's content slides in from the opposite direction and fades in. This will be handled by `AnimatePresence` and custom variants. For example, `initial={{ opacity: 0, x: 50 }}` and `exit={{ opacity: 0, x: -50 }}`.
*   **Flow 2: Submission**
    1.  **User Action:** Clicks "Submit" on the final step.
    2.  **Animation:** The "Submit" button shows a `CircularProgressRing`.
    3.  **On Success:** A `Sonner` toast appears: "Case created successfully!". The user is then redirected to the "Active Cases Mission Board" (`/vetting/active-cases`).
    4.  **On Failure:** A `Sonner` toast appears with a `destructive` style: "Error: Could not create case. Please check details and try again." The form remains on Step 4.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `NeumorphicCard` takes up `95%` of the viewport width.
    *   The Stepper component might collapse to show only icons or numbers to save space.
    *   Form fields will stack vertically with full width.

**6. Edge Cases & Empty States**
*   **Validation:** Each field will have real-time validation. Invalid fields will show a subtle red border and a small error message below them. The "Next" button remains disabled until all fields in the current step are valid.
*   **State Persistence:** If the user accidentally navigates away and comes back, the form state should ideally be preserved using local storage or a state management library to prevent data loss.

---

### **2.2: Active Cases Mission Board**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 4.2 & ux-design-menu.md):** "As a Risk Agent, I need an interactive 'mission control' for managing all ongoing cases, not just a static list, so I can clearly see the status of each case, identify bottlenecks, and take immediate action."
*   **Design Intent:** To create a powerful, data-dense, and highly interactive workspace. This page will be built around an advanced data table that provides clarity and control. The neumorphic design will be used to differentiate interactive filter controls from the data display. The goal is efficiency; enabling agents to sort, filter, and act on cases with minimal clicks.

**2. Layout & Wireframe**
*   **Description:** A full-width layout dominated by the `NeumorphicDataTable`. Controls for filtering and searching are positioned above the table in a clean, organized bar.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Active Cases Mission Board"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by entity name or case ID..."
        - [COMPONENT: NeumorphicSelect] - "Filter by Status" (All, In Progress, Pending Consent, etc.)
        - [COMPONENT: NeumorphicSelect] - "Filter by Agent" (For Admins)
        - [COMPONENT: NeumorphicButton (Subtle)] - "More Filters" (opens a popover with advanced date range filters).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Displays all active vetting cases.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable`**
    *   **Type:** `NeumorphicDataTable` from `src/components/ui/`. This is an enhanced `TanStack Table`.
    *   **Content & Columns:**
        *   `Case ID`: Text.
        *   `Entity Name`: Text.
        *   `Status`: A `Badge` component with color-coding.
        *   `Progress`: A visual `CheckProgressIndicator` component showing completion percentage.
        *   `Assigned Agent`: Text.
        *   `Date Initiated`: Text.
        *   `Actions`: A cell with multiple `NeumorphicButton`s (icon-only, subtle variant).
    *   **Features:**
        *   Clickable column headers for sorting.
        *   Client-side or server-side pagination.
        *   Row selection with checkboxes on the left.
*   **Component: `Filter Controls`**
    *   **Type:** A combination of `NeumorphicInput`, `NeumorphicSelect`, and `NeumorphicButton` components.
    *   **Interaction:** Typing in the search input or changing a select value will instantly (with debounce) refetch and update the data in the table.
*   **Component: `Action Buttons` (in Actions column)**
    *   **Type:** `NeumorphicButton` (icon-only, subtle).
    *   **Content:**
        *   `View Details (Icon: Eye)`: Navigates to the Vetting Case Detail View (`/vetting/cases/{id}`).
        *   `Resend Consent (Icon: Send)`: Triggers API to resend consent link. Disabled if status is not 'Pending Consent'.
        *   `More Options (Icon: MoreHorizontal)`: Opens a `ContextMenu` with further actions like "Assign Agent" or "Cancel Case".

**4. User Interaction & Animations**
*   **Flow 1: Page Load & Data Fetch**
    1.  **Initial State:** The table displays a skeleton screen with rows and cells matching the table structure, shimmering with a subtle animation.
    2.  **Animation:** Once data is fetched, the skeleton screen fades out, and the table rows animate in using a staggered fade-in effect via Framer Motion. `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, with a per-row delay.
*   **Flow 2: Filtering Data**
    1.  **User Action:** User types in the search bar or changes a filter.
    2.  **Animation:** The current table body content quickly fades to 50% opacity while new data is being fetched. Once loaded, the old content is replaced, and the new content fades in to 100% opacity.
*   **Flow 3: Hovering Rows**
    1.  **User Action:** User hovers over a table row.
    2.  **Animation:** The background of the hovered row subtly changes color, transitioning smoothly. The `Actions` buttons, normally at low opacity, become fully opaque to indicate interactivity.

**5. Responsive Design Behavior**
*   **Tablet (max-width: 1024px):** The layout is maintained. Some less critical columns (e.g., `Date Initiated`) might be hidden to save space.
*   **Mobile (max-width: 768px):**
    *   The `Controls Bar` wraps into two lines.
    *   The table itself becomes horizontally scrollable, as defined in `custom.css`. Only the most critical columns (`Entity Name`, `Status`, `Actions`) are visible without scrolling.
    *   Row height and font sizes are adjusted for touch-friendliness.

**6. Edge Cases & Empty States**
*   **Empty State (No Active Cases):** If there are no active cases in the system at all, the area where the table would be will display an empty state component with an illustration, a `H2` title "No Active Cases", and a `NeumorphicButton` to "Initiate a New Case" which links to `/vetting/initiate`.
*   **Empty State (No Filter Results):** If filters are applied and no cases match, the table body will display a single row with a message: "No cases match your current filters. Try adjusting your search."
*   **Error State (Data Fetch Failure):** If the API call fails, the table body is replaced with an `ErrorState` component with a "Could not load active cases" message and a "Retry" button.

---

### **2.3: Consent Management Hub**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 4.3 & ux-design-menu.md):** "As a Risk Agent, I need a specialized dashboard to manage all consent-related issues, so I can quickly identify and resolve bottlenecks in the consent process, which is often the biggest time-sink."
*   **Design Intent:** To create a highly focused and actionable hub for all things consent. This page moves beyond a simple filtered list and provides specific tools and visualizations to help agents proactively manage consent. The design prioritizes clarity on status, timing, and provides tools for efficient batch operations.

**2. Layout & Wireframe**
*   **Description:** A dashboard-style layout with high-level KPIs at the top for a quick overview, followed by the main data table of pending requests.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Consent Management Hub"
      - **KPI Row:** A responsive grid of 3 `NeumorphicCard` components.
        - [KPI CARD 1]: "Pending Consent" - Count of all cases awaiting consent.
        - [KPI CARD 2]: "Expiring Soon" - Count of requests expiring in the next 24 hours (highlighted in amber).
        - [KPI CARD 3]: "Expired" - Count of requests that have expired (highlighted in red).
      - **Controls Bar:** Above the table.
        - [COMPONENT: NeumorphicButton (Primary, Disabled by default)] - "Batch Resend Reminders"
        - [COMPONENT: Search Input] - To filter the list by entity name.
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Displays all cases with status 'Pending Consent'.
    ```

**3. Component Breakdown & Specification**
*   **Component: `KPI Card`**
    *   **Type:** `NeumorphicCard (Elevated)`.
    *   **Content:** A large number and a descriptive label. Cards for "Expiring Soon" and "Expired" will have a subtle, colored glow effect to draw attention.
    *   **Interaction:** Clicking on a card will filter the data table below to show only the corresponding cases.
*   **Component: `NeumorphicDataTable` (Consent Hub variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Checkbox`: For row selection and batch actions.
        *   `Entity Name`: Text.
        *   `Request Sent`: Timestamp (e.g., "2 days ago").
        *   `Link Expires`: Timestamp / Countdown (e.g., "in 23 hours").
        *   `Consent Journey`: The `ConsentJourneyStepper` component, visually showing `Sent -> Opened -> Submitted`.
        *   `Actions`: `NeumorphicButton`s for row-level actions.
*   **Component: `ConsentJourneyStepper`**
    *   **Type:** A custom component.
    *   **Content:** A horizontal stepper with 3 stages. Completed stages are filled in, the current stage pulses.
    *   **Styling:** Uses neumorphic inset effects for the track and raised effects for the steps.
*   **Component: `Batch Action Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Disabled by default. Becomes enabled when one or more rows in the table are selected via checkbox. Clicking it triggers the API to resend consent reminders for all selected cases.
*   **Component: `Action Buttons` (in Actions column)**
    *   **Content:**
        *   `Resend (Icon: Send)`: Resends consent for a single row.
        *   `Copy Link (Icon: Link)`: Copies the unique consent link to the clipboard.
        *   `View Case (Icon: Eye)`: Navigates to the case detail view.

**4. User Interaction & Animations**
*   **Flow 1: Batch Actions**
    1.  **User Action:** User clicks one or more checkboxes in the table.
    2.  **Animation:** As the first checkbox is clicked, the "Batch Resend Reminders" button animates from disabled (lower opacity, no shadow) to enabled (full opacity, `convex` shadow) using a quick fade-and-scale effect.
*   **Flow 2: KPI Filtering**
    1.  **User Action:** User clicks the "Expiring Soon" KPI card.
    2.  **Animation:** The card depresses slightly (deeper `inset` shadow) to show it's active. The data table content fades and reloads (as in the Mission Board) to show only the filtered results. A "Clear Filter" button appears next to the page title.

**5. Responsive Design Behavior**
*   **Tablet (max-width: 1024px):** The 3 KPI cards remain in a row. Table columns may be slightly condensed.
*   **Mobile (max-width: 768px):**
    *   The KPI cards stack vertically at the top.
    *   The `Controls Bar` may wrap.
    *   The table becomes horizontally scrollable. The `ConsentJourneyStepper` might be hidden on mobile, with the status shown as text instead to save space.

**6. Edge Cases & Empty States**
*   **Empty State:** If there are no cases pending consent, the page displays a large checkmark icon, a `H2` title "Consent Queue is Clear!", and a message "All active cases have received consent."
*   **Error State:** If the data fails to load, the KPI cards and table are replaced by a single `ErrorState` component with a "Could not load consent data" message and a "Retry" button.

---

### **2.4: Completed Reports**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent or Manager, I need a searchable archive of all finalized vetting cases, so that I can quickly retrieve historical intelligence, review past findings, and export reports for compliance or decision-making."
*   **Design Intent:** To create an efficient and powerful "library of intelligence." The page's primary function is search and retrieval. The design will feature robust filtering and a clean data table, prioritizing speed and ease of finding specific historical reports. An export function is a key deliverable.

**2. Layout & Wireframe**
*   **Description:** A layout similar to the Mission Board, with powerful search and filter controls positioned above a `NeumorphicDataTable`.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Completed Vetting Reports"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by entity name, ID, or report content..."
        - [COMPONENT: NeumorphicButton (Subtle)] - "Date Range Filter" (opens a `NeumorphicCalendar` popover).
        - [COMPONENT: NeumorphicButton (Primary)] - "Export to PDF" (icon: `Download`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Displays all completed vetting cases.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Completed Reports variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Case ID`: Text.
        *   `Entity Name`: Text.
        *   `Final Risk Score`: A `Badge` with color-coding (Green/Low, Amber/Medium, Red/High).
        *   `Completion Date`: Timestamp.
        *   `Report Type`: Text (e.g., "Pre-vetting", "Employee Screening").
        *   `Actions`: `NeumorphicButton`s for row-level actions.
*   **Component: `Filter Controls`**
    *   **Search Input:** A powerful search that queries multiple fields.
    *   **Date Range Filter:** A button that opens a `Popover` containing the `NeumorphicCalendar` component, allowing users to select a "from" and "to" date.
*   **Component: `Export to PDF Button`**
    *   **Type:** `NeumorphicButton` (Primary).
    *   **Interaction:** Becomes active when rows are selected. If no rows are selected, it's disabled or exports the current view. Clicking it triggers a background job to generate a PDF of the selected reports. A `Sonner` toast will appear: "Your export is being generated and will be downloaded shortly."
*   **Component: `Action Buttons` (in Actions column)**
    *   **Content:**
        *   `View Report (Icon: FileText)`: Opens a `Dialog` or new page (`ReportDossierModal`) with a clean, printable summary of the case findings.
        *   `Export PDF (Icon: Download)`: Exports the individual report for that row.

**4. User Interaction & Animations**
*   **Flow 1: Viewing a Report**
    1.  **User Action:** User clicks the "View Report" icon on a row.
    2.  **Animation:** A `Dialog` modal animates in, scaling up from the center (`initial={{ opacity: 0, scale: 0.9 }}`). The background is overlaid with a semi-transparent dark layer. The report content inside the modal fades in.
*   **Flow 2: Exporting**
    1.  **User Action:** Clicks "Export PDF".
    2.  **Animation:** The button's icon is replaced with a `CircularProgressRing` to indicate the export process has started. The `Sonner` toast animates in from the top of the screen.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Controls Bar` will wrap, placing the "Export" button on a second line if necessary.
    *   The table becomes horizontally scrollable. Only the most critical columns (`Entity Name`, `Final Risk Score`, `Actions`) will be visible without scrolling.

**6. Edge Cases & Empty States**
*   **Empty State (No Completed Reports):** If no reports have been completed yet, the page will show an empty state with an illustration, a `H2` title "No Reports Found", and the message "Once vetting cases are completed, their reports will appear here."
*   **Empty State (No Filter Results):** If search or date filters yield no results, the table body will display a single row with the message: "No reports match your search criteria."
*   **Error State (Data Fetch Failure):** The table will be replaced by an `ErrorState` component with a "Could not load completed reports" message and a "Retry" button.

---

### **2.5: Post-Vetting Schedule**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent, I need a forward-looking calendar and list that provides clear visibility into the automated continuous monitoring system, so I can see which suppliers are due for a re-check and manually trigger a re-vetting if necessary."
*   **Design Intent:** To create a clear, predictable, and transparent view of future automated tasks. The design will offer two distinct views—a calendar for visual, long-term planning and a list for scannable, near-term actions. This duality caters to different user preferences for visualizing scheduled events.

**2. Layout & Wireframe**
*   **Description:** A main content area with a view-switcher to toggle between a full-page calendar and a data table.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Post-Vetting Schedule"
      - **Controls Bar:** A flex container at the top right.
        - [COMPONENT: View Switcher] - A `NeumorphicRadioGroup` with two options: "Calendar View" (Icon: `Calendar`) and "List View" (Icon: `List`).
      - **Main Content Area:** (Content swaps based on View Switcher selection)
        - [VIEW: Calendar View] - A full-page calendar displaying scheduled checks.
        - [VIEW: List View] - A `NeumorphicDataTable` listing upcoming checks.
    ```

**3. Component Breakdown & Specification**
*   **Component: `View Switcher`**
    *   **Type:** `NeumorphicRadioGroup`.
    *   **Interaction:** Selecting an option will trigger an animated transition to the corresponding view.
*   **VIEW: `Calendar View`**
    *   **Type:** A large-format calendar component, likely based on `NeumorphicCalendar` but expanded to show a full month with events.
    *   **Content:** Each day cell can contain multiple event entries. Events are color-coded based on the risk level of the supplier being checked.
    *   **Interaction:**
        *   Clicking on a calendar event opens a `Popover`.
        *   The `Popover` contains: Supplier Name, Next Check Date, and a `NeumorphicButton` "Trigger Re-vetting Now".
*   **VIEW: `List View`**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Supplier Name`: Text.
        *   `Current Risk Level`: A colored `Badge`.
        *   `Last Check Date`: Timestamp.
        *   `Next Scheduled Check`: Timestamp.
        *   `Actions`: A `NeumorphicButton` "Trigger Re-vetting Now".
*   **Component: `Trigger Re-vetting Button`**
    *   **Type:** `NeumorphicButton` (subtle variant).
    *   **Interaction:** Clicking it shows a confirmation `Dialog`: "Are you sure you want to trigger an immediate re-vetting for [Supplier Name]? This will reset their schedule." On confirm, it triggers the relevant API call.

**4. User Interaction & Animations**
*   **Flow 1: Switching Views**
    1.  **User Action:** User clicks "List View" when in "Calendar View".
    2.  **Animation:** Using `AnimatePresence`, the Calendar component fades out and shrinks (`exit={{ opacity: 0, scale: 0.98 }}`). Simultaneously, the List View (DataTable) fades in and scales up (`initial={{ opacity: 0, scale: 0.98 }}`). This creates a smooth cross-fade and zoom effect.
*   **Flow 2: Triggering a Manual Re-vet**
    1.  **User Action:** Clicks "Trigger Re-vetting Now".
    2.  **Animation:** The confirmation `Dialog` scales in from the center. Upon successful API call, a `Sonner` toast appears: "Re-vetting for [Supplier Name] has been queued." The corresponding item in the list or calendar view briefly flashes with a green highlight to indicate a successful action.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Calendar View` will likely switch to a more compact "agenda" style list, showing events chronologically rather than in a grid, as a full monthly grid is not usable on small screens.
    *   The `List View` (DataTable) will become horizontally scrollable.

**6. Edge Cases & Empty States**
*   **Empty State:** If no post-vetting checks are scheduled in the system, the page will display an empty state component with a calendar icon, a `H2` title "No Checks Scheduled", and the message "Automated post-vetting checks for active suppliers will appear here once scheduled."
*   **Error State:** If the schedule data cannot be loaded, the main content area will be replaced by an `ErrorState` component with a "Could not load schedule" message and a "Retry" button.

---

## **3. Supplier Intelligence**

---

### **3.1: Supplier Directory**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent or Manager, I need a central, master CRM for all suppliers, active or historical, so that I have a single source of truth and can quickly navigate to a specific supplier's detailed profile."
*   **Design Intent:** To create the definitive repository of supplier knowledge. This page serves as the primary entry point into the "Supplier Intelligence" module. The design must be clean, fast, and easily searchable, acting as a high-performance index that links to deeper, more detailed views.

**2. Layout & Wireframe**
*   **Description:** A familiar full-width layout featuring a powerful data table, consistent with other list-based pages in the application for a predictable user experience.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Supplier Directory"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by supplier name or identifier..."
        - [COMPONENT: NeumorphicSelect] - "Filter by Status" (Active, Suspended, Inactive).
        - [COMPONENT: NeumorphicSelect] - "Filter by Risk Tier" (Low, Medium, High).
        - [COMPONENT: NeumorphicButton (Primary)] - "Add New Supplier" (Icon: `Plus`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Displays all suppliers in the system.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Supplier Directory variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Supplier Name`: Text. This cell is a primary link.
        *   `Status`: A `Badge` with color-coding (Green/Active, Red/Suspended, Grey/Inactive).
        *   `Overall Risk Score`: A colored `Badge` or a `CircularProgressRing` visualizing the score.
        *   `Last Vetting Date`: Timestamp.
        *   `Contact Person`: Text.
        *   `Actions`: A `NeumorphicButton` with an icon.
    *   **Interaction:** Clicking anywhere on the `Supplier Name` cell navigates the user to that supplier's detailed 360° View (`/suppliers/[id]`).
*   **Component: `Add New Supplier Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Clicking this button navigates to a dedicated "Add New Supplier" form page (`/suppliers/add`). This form will be simpler than the "Initiate Vetting" form, focusing only on creating the supplier record itself.
*   **Component: `Action Buttons` (in Actions column)**
    *   **Content:**
        *   `View Profile (Icon: ArrowRight)`: A secondary, explicit way to navigate to the Supplier 360° View.
        *   `More Options (Icon: MoreHorizontal)`: Opens a `ContextMenu` with actions like "Edit Supplier Details" or "Initiate Vetting for this Supplier".

**4. User Interaction & Animations**
*   **Flow 1: Navigating to 360° View**
    1.  **User Action:** User clicks on a supplier's name.
    2.  **Animation:** A standard, fast page transition occurs. To give a sense of drilling down, the row that was clicked could briefly flash or highlight just before the navigation begins.
*   **Flow 2: Adding a New Supplier**
    1.  **User Action:** Clicks the "Add New Supplier" button.
    2.  **Animation:** The application navigates to the `/suppliers/add` page with a standard slide transition.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Controls Bar` will wrap.
    *   The table becomes horizontally scrollable. The `Supplier Name`, `Status`, and `Risk Score` columns remain visible, as they are the most critical pieces of information for a quick overview.

**6. Edge Cases & Empty States**
*   **Empty State (No Suppliers):** If the directory is empty, the page will display an empty state with an illustration (e.g., an empty address book), a `H2` title "No Suppliers Found", and a prominent `NeumorphicButton` to "Add Your First Supplier".
*   **Empty State (No Filter Results):** If filters result in no matches, the table body will show a single row with the message: "No suppliers match your current filters."
*   **Error State:** If the supplier list fails to load, the table is replaced by an `ErrorState` component with a "Could not load supplier directory" message and a "Retry" button.

---

### **3.2: Supplier Risk Dashboard**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Manager or Senior Risk Officer, I need a high-level business intelligence dashboard to understand the overall risk landscape of our supplier base at a glance, so I can identify trends, concentrations of risk, and make strategic decisions."
*   **Design Intent:** To translate raw supplier data into actionable, visual insights. This page is a pure BI tool, composed of interactive charts and KPIs. The design must be clean, with a clear information hierarchy that draws the eye to key metrics. Each chart should be a self-contained, easily understood story.

**2. Layout & Wireframe**
*   **Description:** A responsive grid of `NeumorphicCard` widgets, each containing a data visualization.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Supplier Risk Dashboard"
      - **Responsive Grid (2 columns on desktop, 1 on mobile):**
        - [CHART WIDGET 1: Risk Distribution] - A donut chart.
        - [CHART WIDGET 2: Top 10 Riskiest Suppliers] - A horizontal bar chart.
        - [CHART WIDGET 3: Geographic Risk Concentration] - An interactive map. Spans 2 columns on desktop.
        - [CHART WIDGET 4: Average Risk Score Trend] - A line chart.
    ```

**3. Component Breakdown & Specification**
*   **Component: `Chart Widget` (Base)**
    *   **Type:** `NeumorphicCard (Elevated)` containing an ApexCharts component from `src/components/charts/apex/`.
    *   **Content:**
        *   `Header`: `H3 Title` describing the chart's insight.
        *   `Body`: The chart component itself.
    *   **Interaction:** Hovering over the card could reveal a "More Info" icon that explains the chart's data source and calculation.
*   **Component: `Risk Distribution Chart`**
    *   **Type:** `ProvincialSupplierDonutChart` (a variant of `DonutChart`).
    *   **Content:** Shows the percentage of suppliers in each risk tier (Low, Medium, High). The center of the donut displays the total number of suppliers.
*   **Component: `Top 10 Riskiest Suppliers Chart`**
    *   **Type:** `RiskCategoriesChart` (a variant of `BarChart`).
    *   **Content:** A horizontal bar chart listing the 10 suppliers with the highest risk scores. Each bar is color-coded by the supplier's risk tier.
*   **Component: `Geographic Risk Concentration Map`**
    *   **Type:** `InteractiveMap`.
    *   **Content:** A map of South Africa with data points or a heatmap overlay showing the concentration of high-risk suppliers by province or city.
    *   **Interaction:** Clicking on a pin or region could show a `Popover` with summary stats for that area.
*   **Component: `Average Risk Score Trend Chart`**
    *   **Type:** `TrendAnalysisChart` (a variant of `LineChart`).
    *   **Content:** A line chart plotting the average supplier risk score across the entire database over the last 12 months.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** Each chart widget position is occupied by a `SkeletonLoader` that mimics the shape of the chart (e.g., a circle for the donut chart).
    2.  **Animation:** On data load, the skeleton loaders fade out. The charts animate in sequentially using a staggered effect. Each `ApexCharts` component will use its built-in animations (e.g., bars drawing, donut segments animating in).
*   **Flow 2: Chart Interaction**
    1.  **User Action:** User hovers over a data series (e.g., a bar in the bar chart or a segment in the donut chart).
    2.  **Animation:** The hovered series is highlighted (e.g., brightens or gets a stronger shadow). A neumorphic-styled `ApexCharts` tooltip appears, providing the precise data value.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 1024px):**
    *   The grid collapses to a single column, stacking the chart widgets vertically.
    *   The map widget will fit the full width.
    *   Chart legends and labels will be optimized for smaller screens to prevent clutter. `ApexCharts` provides responsive options for this.

**6. Edge Cases & Empty States**
*   **Empty State:** If there is insufficient data to generate the charts (e.g., fewer than 3 suppliers in the system), the page will display an empty state: an illustration of a blank chart, a `H2` title "More Data Needed", and the message "This dashboard will become active once more supplier data is available."
*   **Error State:** If data for an individual chart fails to load, only that widget will show an `ErrorState` with a "Could not load chart" message and a "Retry" button, allowing the rest of the dashboard to render.

---

### **3.3: Supplier 360° View**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent, when I select a supplier, I need a definitive, dynamic profile page that aggregates every piece of information VettPro has on that entity, so I can conduct a comprehensive review without having to jump between different pages."
*   **Design Intent:** To create the ultimate source of truth for a single supplier. This page is a data-rich dossier. The design must organize a large volume of disparate information (profile details, history, risk events, financials) into a logical, easily digestible format using a tabbed interface. This prevents overwhelming the user while still providing deep-dive capabilities.

**2. Layout & Wireframe**
*   **Description:** A two-part layout: a sticky header card with key summary information that is always visible, and a main content area with tabs for detailed information.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - [COMPONENT: Sticky Summary Header Card] - A `NeumorphicCard` that stays at the top.
      - [COMPONENT: Tabbed Content Area] - The main body of the page.

    - **Sticky Summary Header Card Content:**
      - `H1`: Supplier Name
      - `Status Badge`
      - `Overall Risk Score Gauge` (CircularProgressRing)
      - Key contact details (phone, email).
      - [COMPONENT: NeumorphicButton] - "Initiate New Vetting"

    - **Tabbed Content Area:**
      - [COMPONENT: NeumorphicTabs] - With tabs: 'Vetting History', 'Risk Events', 'Financials'.
      - [VIEW: Vetting History] - Default view. A data table of all vetting cases for this supplier.
      - [VIEW: Risk Events] - A chronological log/feed of every event impacting their risk score.
      - [VIEW: Financials] - A data table of all invoices analyzed.
    ```

**3. Component Breakdown & Specification**
*   **Component: `Sticky Summary Header Card`**
    *   **Type:** `NeumorphicCard (Elevated)`, positioned with `sticky` and a high `z-index`.
    *   **Content:** Aggregates the most critical, at-a-glance information about the supplier.
*   **Component: `NeumorphicTabs`**
    *   **Type:** `NeumorphicTabs` from `src/components/ui/neumorphic/`.
    *   **Interaction:** Provides clean navigation between the different data views. The active tab has an `inset` look, while inactive tabs are `flat`. The transition between tabs is animated.
*   **VIEW: `Vetting History Tab`**
    *   **Content:** A `NeumorphicDataTable` listing all past and present vetting cases (similar to the "Completed Reports" table but filtered for this supplier). Columns: `Case ID`, `Type`, `Status`, `Completion Date`, `Final Risk Score`, and a `View Report` action button.
*   **VIEW: `Risk Events Tab`**
    *   **Content:** A vertical timeline or a simple log feed. Each entry displays:
        *   `Timestamp`.
        *   `Event Description` (e.g., "Adverse media flag raised", "Director change detected").
        *   `Risk Score Impact` (e.g., "+15" in red, "-5" in green).
*   **VIEW: `Financials Tab`**
    *   **Content:** A `NeumorphicDataTable` listing invoices analyzed for this supplier. Columns: `Invoice #`, `Date Received`, `Amount`, `Fraud Probability Score`, and a `View Analysis` action button.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The sticky header and tab container show `SkeletonLoader`s.
    2.  **Animation:** The header card slides down and fades in. The tab content area fades in slightly after.
*   **Flow 2: Switching Tabs**
    1.  **User Action:** User clicks on the "Risk Events" tab.
    2.  **Animation:** A highlight bar slides smoothly under the tab titles from "Vetting History" to "Risk Events". The content of the "Vetting History" tab fades out, and the "Risk Events" content fades in, using `AnimatePresence`.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Sticky Summary Header Card` may reduce in size, with some details potentially hidden behind a "Show More" toggle.
    *   The `NeumorphicTabs` tabs themselves will become horizontally scrollable if they don't fit the screen width, ensuring all tabs are accessible.

**6. Edge Cases & Empty States**
*   **Empty State (Per Tab):** Each tab is responsible for its own empty state. If a supplier has no risk events, the "Risk Events" tab will display a message "No risk events logged for this supplier." The same applies to Vetting History and Financials.
*   **Error State:** If the initial supplier summary data fails to load, the entire page shows an `ErrorState`. If an individual tab's data fails, only that tab's content area will show an `ErrorState` with a "Retry" button, allowing the user to view other tabs.
*   **New Supplier:** A newly created supplier who has not been vetted will have empty states for all three tabs.

---

## **4. Financial Forensics**

---

### **4.1: Invoice Analysis Dashboard**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent, I need a central hub for the 'Invoice DNA' engine that shows me a queue of recently analyzed invoices, so I can quickly identify and triage high-risk documents for further investigation."
*   **Design Intent:** To serve as a high-efficiency triage center for potential invoice fraud. The design must immediately draw the user's attention to the most critical items. The layout will be a clean, scannable queue that uses color and visual indicators to flag high-risk invoices, enabling rapid assessment and drill-down into a detailed comparison view.

**2. Layout & Wireframe**
*   **Description:** A clean, full-width layout focused on a data table that acts as the analysis queue.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Invoice Analysis Dashboard"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by invoice number or supplier..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Upload Invoice for Analysis" (Icon: `UploadCloud`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - The queue of analyzed invoices.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Invoice Analysis variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Row Styling:** Rows with a `Fraud Probability Score` above a certain threshold (e.g., 75) will have a subtle, full-row background highlight color (e.g., light red) to stand out immediately.
    *   **Content & Columns:**
        *   `Invoice #`: Text.
        *   `Supplier Name`: Text.
        *   `Amount`: Currency formatted text.
        *   `Date Analyzed`: Timestamp.
        *   `Fraud Probability Score`: A colored `Badge` component. The color scales from green (low score) to amber (medium) to red (high), and it contains the percentage score.
        *   `Actions`: A `NeumorphicButton` for the primary action.
*   **Component: `Upload Invoice for Analysis Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Navigates the user to the `/financials/analyze` page, whose spec will be created next.
*   **Component: `Action Buttons` (in Actions column)**
    *   **Content:**
        *   `View Analysis (Icon: FileSearch)`: The primary action. Navigates to a detailed view comparing the invoice against the baseline RFP or historical data.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The table shows a skeleton loader.
    2.  **Animation:** On data load, the skeleton fades out, and table rows animate in with a subtle stagger. The colored highlights on high-risk rows will be immediately visible.
*   **Flow 2: Hovering a High-Risk Row**
    1.  **User Action:** User hovers over a red-highlighted row.
    2.  **Animation:** The background highlight intensifies slightly. The `View Analysis` button, which might normally be subtle, becomes more prominent. This provides clear visual feedback on the interactive target.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The table becomes horizontally scrollable. The most critical columns (`Invoice #`, `Supplier Name`, `Fraud Probability Score`, `Actions`) remain visible by default.

**6. Edge Cases & Empty States**
*   **Empty State (No Invoices Analyzed):** If the queue is empty, the page will display an empty state with an illustration (e.g., a document with a magnifying glass), a `H2` title "Invoice Analysis Queue is Empty", and a prominent `NeumorphicButton` to "Upload an Invoice for Analysis".
*   **Error State:** If the invoice queue fails to load, the table is replaced by an `ErrorState` component with a "Could not load invoice data" message and a "Retry" button.

---

### **4.2: Upload Invoice for Analysis**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent, I need a simple tool to manually submit an invoice for analysis, so that I can trigger the Invoice DNA workflow on demand for documents that don't arrive through automated channels."
*   **Design Intent:** To provide a single-purpose, highly intuitive file upload utility. The design must be extremely simple, focusing on the core action of selecting and uploading a file. Clarity, feedback, and error handling are paramount to ensure the user knows their file has been submitted correctly.

**2. Layout & Wireframe**
*   **Description:** A single, centered `NeumorphicCard` containing the upload form.
    ```
    - **Page Layout:** Centered content within the main DashboardLayout.
      - **Page Title:** "Upload Invoice for Analysis"
      - **Main Container (max-width: 600px):**
        - [COMPONENT: NeumorphicCard (Elevated)]
          - [ELEMENT: H2 Title] - "Submit an Invoice"
          - [ELEMENT: P Subtitle] - "Upload a PDF invoice to be analyzed by the Invoice DNA engine."
          - [COMPONENT: File Uploader] - A large drag-and-drop area.
          - [COMPONENT: NeumorphicSelect] - "Link to Supplier (Required)"
          - [COMPONENT: NeumorphicSelect] - "Link to RFP (Optional)"
          - [COMPONENT: NeumorphicButton (Primary, Disabled)] - "Submit for Analysis"
    ```

**3. Component Breakdown & Specification**
*   **Component: `File Uploader`**
    *   **Type:** A custom component. A large, dashed-border area with an `UploadCloud` icon and text "Drag & drop PDF here, or click to select file".
    *   **Interaction:**
        *   `On Drag Over`: The border style changes (e.g., becomes solid) and the background color shifts to indicate a valid drop zone.
        *   `On Drop/Select`: The component's view changes to show the selected file name, file size, and a progress bar or a "Ready to upload" status. A "Remove" button (Icon: `X`) appears.
    *   **Validation:** Client-side validation to accept only PDF files up to a certain size limit (e.g., 10MB).
*   **Component: `NeumorphicSelect` (for Supplier/RFP)**
    *   **Type:** `NeumorphicSelect` component.
    *   **Content:** The select lists will be populated by fetching all available suppliers and RFPs from the API.
*   **Component: `Submit for Analysis Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Disabled until a valid file is selected AND a supplier is linked. Clicking it initiates the file upload to the server and triggers the n8n workflow.

**4. User Interaction & Animations**
*   **Flow 1: File Selection**
    1.  **User Action:** User drops a file onto the dropzone.
    2.  **Animation:** The dropzone's text and icon fade out, replaced by the file information which fades in. If the file is invalid (e.g., a `.jpg`), the dropzone flashes red, and a `Sonner` toast appears with an error: "Invalid file type. Please upload a PDF."
*   **Flow 2: Submission & Upload**
    1.  **User Action:** Clicks "Submit for Analysis".
    2.  **Animation:** The file uploader component transitions into a progress state, showing a `CircularProgressRing` and the percentage uploaded. The "Submit" button becomes disabled and shows a loading spinner.
    3.  **On Success:** A success message is displayed within the component: "Upload complete! Analysis is in progress." A `Sonner` toast confirms: "Invoice submitted. You can track its status on the dashboard." The user is then navigated back to the `/financials/invoice-dashboard`.
    4.  **On Failure:** The progress bar turns red, and an error message appears: "Upload failed. Please try again."

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The centered card layout adapts naturally. The card width will be set to `90vw` to provide padding on the sides. Font sizes are adjusted.

**6. Edge Cases & Empty States**
*   **File Too Large:** If the selected file exceeds the size limit, a validation message appears instantly below the uploader, and the "Submit" button remains disabled.
*   **API Error:** If the form submission fails due to a server error, a `Sonner` toast with a `destructive` style will appear with a generic error message.

---

### **4.3: RFP Management**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Risk Agent or Manager, I need a repository to store and manage the 'baseline' RFP documents that invoices will be compared against, so we have a consistent source of truth for financial analysis."
*   **Design Intent:** To create a simple and effective document management interface for RFPs. The design will focus on providing a clear list of all baseline documents and an easy way to upload new ones. The user experience should be straightforward, abstracting the complexity of the backend AI processing.

**2. Layout & Wireframe**
*   **Description:** A standard data table layout for listing the documents, with a primary action button to open an upload modal.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "RFP Management"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by RFP title or supplier..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Upload New RFP" (Icon: `FilePlus`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Lists all uploaded RFPs.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (RFP variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `RFP Title`: Text.
        *   `Supplier`: Text.
        *   `Date Uploaded`: Timestamp.
        *   `Status`: A `Badge`. "Processing" (with a subtle pulsing animation), "Processed" (green), "Error" (red).
        *   `Actions`: A `NeumorphicButton` for row-level actions.
*   **Component: `Upload New RFP Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Clicking this button opens a `Dialog` modal containing the upload form.
*   **Component: `Upload RFP Dialog`**
    *   **Type:** `Dialog` component.
    *   **Content:**
        *   `H2 Title`: "Upload New RFP"
        *   `File Uploader`: A drag-and-drop zone for the RFP document (PDF).
        *   `NeumorphicInput`: "RFP Title" (for display purposes).
        *   `NeumorphicSelect`: To link the RFP to a `Supplier`.
        *   `NeumorphicButton`: "Upload & Process".
    *   **Interaction:** Submitting this form will close the modal, show a `Sonner` toast "RFP uploaded. Processing has begun.", and optimistically add the new RFP to the top of the data table with a "Processing" status.

**4. User Interaction & Animations**
*   **Flow 1: Opening Upload Modal**
    1.  **User Action:** Clicks "Upload New RFP".
    2.  **Animation:** The `Dialog` modal scales in from the center, with the background dimming to focus the user's attention.
*   **Flow 2: Successful Upload**
    1.  **User Action:** Submits the upload form in the modal.
    2.  **Animation:** The modal scales out and fades away. The new row animates into the top of the data table with a brief background flash.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Dialog` modal will take up more screen real estate.
    *   The `NeumorphicDataTable` becomes horizontally scrollable.

**6. Edge Cases & Empty States**
*   **Empty State:** If no RFPs have been uploaded, the page will display an empty state: an illustration of a document, a `H2` title "No RFPs Found", and a prominent `NeumorphicButton` to "Upload Your First RFP".
*   **Processing Error:** If the backend AI fails to process an RFP, its status in the table changes to "Error". Hovering over the error badge will show a tooltip with a summary of the error.
*   **Error State:** If the RFP list fails to load, the table is replaced by an `ErrorState` component with a "Could not load RFP data" message and a "Retry" button.

---

## **5. Field Operations Command**

---

### **5.1: Operations Map View**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Field Operations Manager, I need a real-time, geographical command center to manage all on-site tasks, so I can see the location of all active verifications, monitor their status, and understand agent assignments at a glance."
*   **Design Intent:** To create a highly visual, map-centric command center. This is designed to be a live dashboard, not a static map. The primary UI will be an interactive map that uses color-coded pins to convey status instantly. The user experience should feel like a logistics or mission control interface, providing immediate spatial awareness.

**2. Layout & Wireframe**
*   **Description:** A full-screen map layout with minimal UI chrome. A floating panel provides summary information and filters. For this page, the standard content padding of the `DashboardLayout` will be removed to allow the map to touch the container edges.
    ```
    - **Page Layout:** Full-screen map component.
      - [COMPONENT: InteractiveMap] - Takes up the entire available space.
      - [COMPONENT: Floating Info Panel] - A semi-transparent `NeumorphicCard` with `glassmorphism` style, positioned at the top-left, overlaying the map.

    - **Floating Info Panel Content:**
      - [ELEMENT: H2 Title] - "Field Operations Command"
      - **KPI Row:** A responsive grid of small KPI displays.
        - KPI 1: "Active Tasks"
        - KPI 2: "Agents Online"
        - KPI 3: "Overdue Tasks" (highlighted in red)
      - [COMPONENT: NeumorphicSelect] - "Filter by Agent"
      - [COMPONENT: NeumorphicSelect] - "Filter by Status" (Assigned, In Progress, Completed, Overdue)
    ```

**3. Component Breakdown & Specification**
*   **Component: `InteractiveMap`**
    *   **Type:** A `react-leaflet` component.
    *   **Content:**
        *   A base map tile layer (e.g., from OpenStreetMap).
        *   Color-coded map pins representing each verification task.
    *   **Pin Styling:** Blue for 'Assigned', Orange for 'In Progress', Green for 'Completed', Red for 'Overdue'. Overdue pins will have a subtle pulsing animation defined in `animations.css`.
*   **Component: `Floating Info Panel`**
    *   **Type:** A `div` styled with `position: absolute`, using `glassmorphism` and `NeumorphicCard` styles for a soft, floating appearance.
    *   **Interaction:** Filters will update the pins shown on the map in real-time.
*   **Component: `Map Pin Popup`**
    *   **Type:** A custom popup styled with the `neumorphic-map-popup` classes from `globals.css`.
    *   **Content:**
        *   Task Title (e.g., "Verify address for ABC Mining").
        *   Assigned Agent.
        *   Status Badge.
        *   Due Date.
        *   `NeumorphicButton` to "View Task Details".
    *   **Interaction:** Clicking "View Task Details" navigates to the detailed view for that task.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** A simple placeholder background with a central loading spinner.
    2.  **Animation:** The map tiles fade in first. Once task data is loaded, the map pins drop onto their locations with a slight bounce animation, applied with a subtle stagger for a dynamic effect. The floating info panel slides in from the left.
*   **Flow 2: Map Interaction**
    1.  **User Action:** User clicks a map pin.
    2.  **Animation:** The map smoothly pans and zooms to center the pin. The popup appears with a quick scale-in animation.
*   **Flow 3: Filtering**
    1.  **User Action:** User changes a filter in the floating panel.
    2.  **Animation:** Pins that do not match the filter fade out to a low opacity (e.g., 0.2). Matching pins remain at full opacity. The transition is animated to avoid a jarring change.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Floating Info Panel` moves to the bottom of the screen for better thumb accessibility. Its content may become horizontally scrollable.
    *   Map popups are optimized for smaller screen sizes.

**6. Edge Cases & Empty States**
*   **Empty State (No Active Tasks):** If there are no active tasks, the map loads, but an overlay message appears: "No Active Field Tasks. New tasks can be created in the Verification Task Queue."
*   **Error State:** If map tiles fail, a basic error is shown. If task data fails, the floating panel displays an `ErrorState` with a "Could not load task data" message and a "Retry" button, leaving the base map visible.

---

### **5.2: Verification Task Queue**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Field Operations Manager, I need an administrative tool to create and assign physical verification jobs, so I can dispatch tasks to agents with clear instructions and due dates."
*   **Design Intent:** To provide a simple, efficient interface for managing the lifecycle of field verification tasks. This page is the non-geographical counterpart to the map view, focusing on the administrative details. The experience is centered around a data table and a creation modal, ensuring a familiar and productive workflow.

**2. Layout & Wireframe**
*   **Description:** A classic data table view with controls for creation and filtering.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Verification Task Queue"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search tasks..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Create New Task" (Icon: `PlusCircle`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Lists all verification tasks.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Task Queue variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Task Title`: Text (e.g., "Verify address for ABC Mining").
        *   `Status`: A colored `Badge`.
        *   `Assigned Agent`: Text (e.g., "Themba Khumalo").
        *   `Due Date`: Timestamp.
        *   `Actions`: Edit and delete buttons.
*   **Component: `Create New Task Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Opens a `Dialog` modal for creating a new task.
*   **Component: `Create Task Dialog`**
    *   **Type:** `Dialog` component.
    *   **Content:**
        *   `H2 Title`: "Create New Verification Task"
        *   `NeumorphicInput`: "Task Title"
        *   `NeumorphicTextarea`: "Instructions for Agent"
        *   `NeumorphicCalendar`: For selecting a "Due Date".
        *   `NeumorphicSelect`: "Assign to Agent" (populated with available agents).
        *   `NeumorphicButton`: "Create Task".
    *   **Interaction:** Submitting the form triggers a `POST /api/field-ops/tasks` call. On success, the modal closes, and the new task is optimistically added to the table.

**4. User Interaction & Animations**
*   **Flow 1: Creating a Task**
    1.  **User Action:** Clicks "Create New Task", fills the form in the modal, and clicks "Create Task".
    2.  **Animation:** The `Dialog` scales in. Upon submission, it scales out. The new row animates into the table from the top with a subtle background highlight that fades out. A `Sonner` toast confirms "Task created and assigned successfully."

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The create/edit `Dialog` will be full-width for better usability on small screens.
    *   The `NeumorphicDataTable` becomes horizontally scrollable.

**6. Edge Cases & Empty States**
*   **Empty State:** If there are no tasks in the queue, the page displays an empty state: an illustration of a checklist, a `H2` title "Task Queue is Empty", and a prominent `NeumorphicButton` to "Create a New Task".
*   **Error State:** If the task list fails to load, the table is replaced by an `ErrorState` component with a "Could not load tasks" message and a "Retry" button.

---

### **5.3: Field Agent Management**

**1. Overview & User Goal**
*   **User Story (from PRD & ux-design-menu.md):** "As a Field Operations Manager, I need a CRM for my field agent workforce, so I can manage their details, see their current workload, and monitor their performance."
*   **Design Intent:** To provide a clear, manageable directory of all field agents. This page functions as a simple human resource tool, focused on operational status and performance metrics. The interface will be clean and data-driven, using a standard table view for easy scanning and comparison.

**2. Layout & Wireframe**
*   **Description:** A standard data table layout.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Field Agent Management"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by agent name..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Add New Agent" (Icon: `UserPlus`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Lists all registered field agents.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Agent Management variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Agent Name`: Text, along with an avatar.
        *   `Status`: A `Badge` with a dot indicator (Green/Online, Grey/Offline).
        *   `Current Tasks`: A number indicating open tasks assigned.
        *   `Avg. Task Completion`: A time value (e.g., "4.5 hours").
        *   `Contact Info`: Email/Phone.
        *   `Actions`: Edit/Deactivate buttons.
*   **Component: `Add New Agent Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Opens a `Dialog` modal for creating a new agent record.
*   **Component: `Add/Edit Agent Dialog`**
    *   **Type:** `Dialog` component.
    *   **Content:** A form with `NeumorphicInput` fields for Name, Email, Phone Number, etc.
    *   **Interaction:** On submission, triggers the API to create or update an agent and refreshes the table.

**4. User Interaction & Animations**
*   **Flow 1: Adding an Agent**
    1.  **User Action:** Clicks "Add New Agent", fills the form, and submits.
    2.  **Animation:** The `Dialog` scales in and out. The new agent row animates into the table. A `Sonner` toast confirms "New agent added successfully."

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The table becomes horizontally scrollable. Agent Name, Status, and Current Tasks will be prioritized to remain visible.

**6. Edge Cases & Empty States**
*   **Empty State:** If there are no registered agents, the page will display an empty state: an illustration of a user profile icon, a `H2` title "No Field Agents Found", and a `NeumorphicButton` to "Add Your First Agent".
*   **Error State:** If the agent list fails to load, the table is replaced by an `ErrorState` component with a "Could not load agent data" message and a "Retry" button.

---

## **6. Administration**

---

### **6.1: User Management**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 6.0 & ux-design-menu.md):** "As a Super Admin, I need a secure and clear interface to manage user accounts, assign roles, and control permissions, so I can ensure the platform's security and operational integrity."
*   **Design Intent:** To provide a straightforward and secure administrative tool for managing the platform's users. The design prioritizes clarity, ease of use, and error prevention. The interface will use a standard data table for familiarity and efficiency, allowing admins to quickly find users and perform administrative actions like inviting, editing roles, or deactivating accounts.

**2. Layout & Wireframe**
*   **Description:** A clean, full-width data table layout, consistent with other administrative pages.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "User Management"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by user name or email..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Invite New User" (Icon: `UserPlus`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Lists all platform users.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (User Management variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Row Styling:** The current admin's own row will be subtly highlighted to prevent accidental self-deactivation. Deactivated users' rows will have a lower opacity.
    *   **Content & Columns:**
        *   `User Name`: Text, accompanied by a user `Avatar`.
        *   `Email`: Text.
        *   `Role`: A colored `Badge` (e.g., Super Admin, Risk Agent, Field Agent).
        *   `Status`: A `Badge` with a dot indicator (Green/Active, Grey/Inactive).
        *   `Last Active`: Timestamp (e.g., "5 hours ago" or a specific date).
        *   `Actions`: A `ContextMenu` trigger button (`MoreHorizontal` icon).
*   **Component: `Invite New User Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Opens a `Dialog` modal for inviting a new user.
*   **Component: `Invite User Dialog`**
    *   **Type:** `Dialog` component.
    *   **Content:**
        *   `H2 Title`: "Invite New User"
        *   `NeumorphicInput`: For the user's email address.
        *   `NeumorphicSelect`: To assign a "Role".
        *   `NeumorphicButton`: "Send Invitation".
    *   **Interaction:** On submit, triggers `POST /api/admin/users/invite`. A `Sonner` toast confirms the invitation has been sent. The dialog closes, and the new user appears in the table with a "Pending" status until they log in for the first time.
*   **Component: `Actions ContextMenu`**
    *   **Type:** `ContextMenu` component.
    *   **Content & Actions:**
        *   `Edit Role`: Opens a small `Popover` with a `NeumorphicSelect` to change the user's role.
        *   `Deactivate User`: Shows a confirmation `Dialog`. Cannot be used on oneself.
        *   `Reactivate User`: (Shown only for inactive users).
        *   `Resend Invitation`: (Shown only for users with "Pending" status).

**4. User Interaction & Animations**
*   **Flow 1: Inviting a User**
    1.  **User Action:** Clicks "Invite New User", fills out the modal, and clicks "Send Invitation".
    2.  **Animation:** The `Dialog` scales in. On submission, it scales out. A `Sonner` toast animates in from the top. The new user row animates into the table with a "Pending" status.
*   **Flow 2: Deactivating a User**
    1.  **User Action:** Clicks the actions menu, selects "Deactivate User", and confirms in the `Dialog`.
    2.  **Animation:** The confirmation `Dialog` scales in. On success, the user's row in the table fades to a lower opacity (`opacity: 0.5`) to visually indicate its inactive status.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The table becomes horizontally scrollable, prioritizing the `User Name`, `Role`, and `Status` columns.
    *   The `Invite User Dialog` becomes full-screen for better usability.

**6. Edge Cases & Empty States**
*   **Empty State:** Unlikely, as there will always be at least one admin user. However, if an error occurs and no users are returned, an `ErrorState` is shown.
*   **Preventing Self-Lockout:** The "Deactivate User" action will be disabled in the `ContextMenu` for the currently logged-in admin's own user row. A tooltip can explain why.
*   **Error State:** If the user list fails to load, the table is replaced by an `ErrorState` component with a "Could not load user data" message and a "Retry" button.

---

### **6.2: System Configuration**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 6.0 & ux-design-menu.md):** "As a Super Admin, I need a centralized place to configure key system-wide settings, such as API keys for integrations, notification triggers, and risk score weighting, so I can fine-tune the platform's behavior without needing to change code."
*   **Design Intent:** To create a secure, easy-to-understand settings page. The design must group related configurations logically using a tabbed interface to prevent overwhelming the user. It must also prevent accidental changes and provide clear feedback on updates.

**2. Layout & Wireframe**
*   **Description:** A tabbed interface to separate different areas of configuration. A master "Save" button applies all changes at once.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "System Configuration"
      - **Main Container:**
        - [COMPONENT: NeumorphicTabs] - With tabs: 'Integrations', 'Post-Vetting Rules', 'Risk Engine Rules', 'Notifications'.
        - [CONTAINER: Tab Content] - Animated container for the current tab's view.
          - [VIEW: Integrations Tab]
          - [VIEW: Post-Vetting Rules Tab]
          - [VIEW: Risk Engine Rules Tab]
          - [VIEW: Notifications Tab]
      - **Action Bar (Sticky at bottom):**
        - [COMPONENT: NeumorphicButton (Primary, Disabled)] - "Save Changes"
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicTabs`**
    *   **Type:** `NeumorphicTabs` component.
    *   **Interaction:** Allows switching between the four configuration views.
*   **VIEW: `Integrations Tab`**
    *   **Content:** A `NeumorphicCard` containing fields for third-party services.
        *   `H3 Title`: "Third-Party API Keys"
        *   `NeumorphicInput` (Password type): For "MIE API Key".
        *   `NeumorphicInput` (Password type): For "n8n Webhook URL".
        *   Next to each input, a `NeumorphicButton` (subtle) "Test Connection".
*   **VIEW: `Post-Vetting Rules Tab`**
    *   **Content:** A `NeumorphicCard` with settings for continuous monitoring.
        *   `H3 Title`: "Continuous Monitoring Rules"
        *   `NeumorphicSelect`: "Default Re-vetting Frequency" (Options: 3 months, 6 months, 12 months).
        *   `NeumorphicCheckbox`: "Automatically schedule re-vetting for all new 'Active' suppliers".
*   **VIEW: `Risk Engine Rules Tab`**
    *   **Content:** A `NeumorphicCard` with sliders for adjusting risk calculations.
        *   `H3 Title`: "Risk Score Weighting"
        *   `NeumorphicSlider`: "Adverse Media Flag Impact" (Value: 1-100).
        *   `NeumorphicSlider`: "Credit Check Score Impact" (Value: 1-100).
        *   `NeumorphicSlider`: "Director Change Alert Impact" (Value: 1-100).
*   **VIEW: `Notifications Tab`**
    *   **Content:** A `NeumorphicCard` with toggles for email alerts.
        *   `H3 Title`: "Email Notification Triggers"
        *   `NeumorphicCheckbox` with label: "Notify on New Case Assignment".
        *   `NeumorphicCheckbox` with label: "Notify on Consent Received".
        *   `NeumorphicCheckbox` with label: "Notify on Final Report Completion".
*   **Component: `Save Changes Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Disabled by default. Becomes enabled as soon as any form value on any tab is changed. Clicking it triggers a single `POST /api/admin/config` call with the entire configuration object.

**4. User Interaction & Animations**
*   **Flow 1: Modifying a Setting**
    1.  **User Action:** User changes a value (e.g., moves a slider).
    2.  **Animation:** The "Save Changes" button, previously disabled, animates to an active state with a `convex` shadow. The specific input field that was changed receives a subtle highlight on its border to indicate it has unsaved changes.
*   **Flow 2: Saving Configuration**
    1.  **User Action:** Clicks the "Save Changes" button.
    2.  **Animation:** The button shows a `CircularProgressRing`. On success, a `Sonner` toast appears: "Configuration saved successfully." The button returns to its disabled state, and all input field highlights are removed.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `NeumorphicTabs` become horizontally scrollable if needed.
    *   Sliders and checkboxes will stack vertically within their respective cards to ensure usability.

**6. Edge Cases & Empty States**
*   **Permissions:** This entire page/route must be protected and only accessible to users with the 'Super Admin' role.
*   **API Key Testing:** Clicking a "Test Connection" button triggers a specific backend test for that API key. A `Sonner` toast will report the result ("Connection successful!" or "Connection failed."). This action does not save the key.
*   **Error State:** If the initial system configuration fails to load, the entire view is replaced by an `ErrorState` component with a "Could not load system configuration" message and a "Retry" button.

---

### **6.3: Platform Health & Monitoring**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 6.0 & ux-design-menu.md):** "As a Super Admin, I need a real-time dashboard that monitors the vital signs of the application and its integrations, so I can proactively identify and diagnose technical issues before they impact users."
*   **Design Intent:** To create a technical "mission control" for the application's infrastructure. The design must present key performance indicators (KPIs) and system statuses in a clear, real-time, and visually intuitive manner. It is a live dashboard meant for proactive monitoring, not deep-dive forensics (which the Audit Log is for).

**2. Layout & Wireframe**
*   **Description:** A responsive grid of `NeumorphicCard` widgets, each monitoring a specific part of the system.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Platform Health & Monitoring"
      - **Responsive Grid (3 columns on desktop, 2 on tablet, 1 on mobile):**
        - [WIDGET 1: Core Services Status]
        - [WIDGET 2: Third-Party Integrations Status]
        - [WIDGET 3: Workflow Engine Health]
        - [WIDGET 4: API Response Time (p95)] - A line chart, spans 2 columns on desktop.
        - [WIDGET 5: API Error Rate (5xx)] - A line chart.
        - [WIDGET 6: Database Connections] - A KPI card.
        - [WIDGET 7: Job Queue Depth] - A KPI card.
    ```

**3. Component Breakdown & Specification**
*   **Component: `Status List Widget`**
    *   **Type:** `NeumorphicCard (Elevated)`.
    *   **Use For:** 'Core Services', 'Third-Party Integrations', 'Workflow Engine Health'.
    *   **Content:** A list of services. Each list item contains:
        *   The service name (e.g., "Database", "MIE API", "n8n Workflows").
        *   A status `Badge` with a dot indicator (Green for 'Operational', Red for 'Outage', Amber for 'Degraded').
        *   A small text label showing response time (e.g., "35ms").
*   **Component: `Chart Widget`**
    *   **Type:** `NeumorphicCard` containing an `ApexCharts` line chart component.
    *   **Use For:** 'API Response Time', 'API Error Rate'.
    *   **Content:** A real-time line chart displaying the metric over the last hour.
*   **Component: `KPI Widget`**
    *   **Type:** `NeumorphicCard` with an inset style.
    *   **Use For:** 'Database Connections', 'Job Queue Depth'.
    *   **Content:** A large, prominent number and a descriptive label.
*   **Real-time Data:** The data for all widgets should be fetched from a dedicated health-check API endpoint (`/api/admin/health`) every 30-60 seconds.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The grid is populated with `SkeletonLoader` components mimicking the shape of each widget.
    2.  **Animation:** On data fetch, the skeletons fade out. Widgets animate in with a subtle stagger. The `ApexCharts` will use their built-in entrance animations.
*   **Flow 2: Status Change**
    1.  **Event:** A background data refresh indicates a service has changed status (e.g., from 'Operational' to 'Degraded').
    2.  **Animation:** The status dot for that service will flash its new color (e.g., pulse amber) for a few seconds to draw the admin's attention to the change. Numerical changes in KPI widgets will trigger a quick "count up/down" animation.

**5. Responsive Design Behavior**
*   **Tablet (max-width: 1024px):** The grid collapses to 2 columns. The `API Response Time` chart will now span both columns, taking a full row.
*   **Mobile (max-width: 768px):** The grid collapses to a single vertical column. `ApexCharts` will optimize their labels and legends for the smaller screen size.

**6. Edge Cases & Empty States**
*   **Permissions:** This page is strictly accessible only to users with the 'Super Admin' role.
*   **Error State (Full):** If the primary `/api/admin/health` endpoint fails, the entire page is replaced by an `ErrorState` component with a "Could not load platform health data" message and a "Retry" button.
*   **Error State (Partial):** If data for only a specific service is unavailable, that single item in a `Status List Widget` will show a grey "Unknown" status, allowing the rest of the dashboard to remain functional.

---

### **6.4: Audit Logs**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 6.0 & ux-design-menu.md):** "As a Super Admin, I need an immutable, searchable log of all significant actions taken within the platform, so I can monitor for suspicious activity, troubleshoot issues, and meet compliance requirements."
*   **Design Intent:** To create a forensic-level, highly detailed log viewer. The design must emphasize clarity, searchability, and trustworthiness. The data table is the core of this page, and it must be dense with information but still easy to parse, with powerful filtering capabilities to navigate large datasets.

**2. Layout & Wireframe**
*   **Description:** A standard data table view, optimized for searching and filtering dense information.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Audit Logs"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by user, action, or target ID..."
        - [COMPONENT: NeumorphicButton] - "Filter by Date Range" (opens a calendar popover).
        - [COMPONENT: NeumorphicSelect] - "Filter by Action Type" (e.g., Login, Case Created, User Modified).
        - [COMPONENT: NeumorphicButton (Subtle)] - "Export Log" (Icon: `Download`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Lists all audit log entries.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Audit Log variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Timestamp`: Precise date and time to the second.
        *   `User`: The user (Name and Email) who performed the action.
        *   `Action`: A short, machine-readable action name (e.g., `USER_LOGIN_SUCCESS`, `CASE_CREATED`, `CONFIG_UPDATED`).
        *   `Target`: The ID of the entity that was affected (e.g., Case ID, User ID).
        *   `Details`: An icon button (`FileJson`) that opens a modal to view the full JSON payload of the event.
*   **Component: `Filter Controls`**
    *   **Interaction:** All filter controls work together to send a filtered query to the backend, enabling efficient server-side filtering of potentially millions of log entries.
*   **Component: `Export Log Button`**
    *   **Interaction:** Triggers an API call to export the currently filtered view of the log as a CSV file for external analysis or compliance records. A `Sonner` toast will notify the user when the download is ready.
*   **Component: `Payload Viewer Modal`**
    *   **Type:** `Dialog` component.
    *   **Content:** A `H2` Title with the log's timestamp and a read-only, syntax-highlighted code block displaying the full JSON payload of the log entry.

**4. User Interaction & Animations**
*   **Flow 1: Viewing Details**
    1.  **User Action:** User clicks the "Details" icon (`FileJson`) on a log entry.
    2.  **Animation:** A `Dialog` modal appears, scaling in from the center. The formatted JSON payload fades in within the modal.
*   **Flow 2: Exporting**
    1.  **User Action:** Clicks "Export Log".
    2.  **Animation:** The button shows a `CircularProgressRing`. A `Sonner` toast appears: "Generating your log export. This may take a few moments..."

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The `Controls Bar` will wrap into two or more lines.
    *   The `NeumorphicDataTable` becomes horizontally scrollable. The `Timestamp`, `User`, and `Action` columns will be prioritized to remain visible.

**6. Edge Cases & Empty States**
*   **Empty State:** If filters result in no matching log entries, the table will display a message: "No logs match your current criteria."
*   **Permissions:** This page is strictly for 'Super Admin' role. Any other user attempting to access this route should be redirected to the dashboard.
*   **Error State:** If the audit log API fails to respond, the table is replaced with a standard `ErrorState` component with a "Could not load audit logs" message and a "Retry" button.

---

### **6.5: Data Management**

**1. Overview & User Goal**
*   **User Story (from PRD Epic 6.0 & ux-design-menu.md):** "As a Super Admin, I need a safe and controlled interface for performing bulk data operations, such as exporting backups or importing historical data, so I can manage the platform's data lifecycle."
*   **Design Intent:** This page is for powerful, potentially destructive actions. The design must prioritize safety, clarity, and explicit confirmation. Each action is presented as a self-contained operation with clear warnings and multiple confirmation steps to prevent accidental use.

**2. Layout & Wireframe**
*   **Description:** A simple, clear grid of action cards. This is not a frequently used page, so the UI is designed to be deliberate and unambiguous.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Data Management"
      - **Responsive Grid (2 columns on desktop, 1 on mobile):**
        - [COMPONENT: Action Card] - "Export Full System Backup"
        - [COMPONENT: Action Card] - "Import Historical Data"
        - [COMPONENT: Action Card] - "Anonymize Old Records"
    ```

**3. Component Breakdown & Specification**
*   **Component: `Action Card` (Base)**
    *   **Type:** A `NeumorphicCard (Elevated)`.
    *   **Content:**
        *   `H3 Title`: The name of the action (e.g., "Export Full System Backup").
        *   `P Description`: A clear, concise explanation of what the action does and any potential risks or performance impacts.
        *   `NeumorphicButton`: To initiate the action.
*   **Component: `Export Backup Card`**
    *   **Button Text:** "Generate Backup"
    *   **Interaction:** Clicking the button opens a confirmation `Dialog`. The dialog text reads: "Are you sure you want to generate a full system backup? This is a resource-intensive operation and may take some time." Upon confirmation, a `Sonner` toast appears: "Backup generation started. You will be notified via email when it's ready for download."
*   **Component: `Import Data Card`**
    *   **Button Text:** "Start Import Wizard"
    *   **Interaction:** Clicking this button navigates to a dedicated, future multi-step wizard page (`/admin/data-management/import`). This wizard will handle file upload, data mapping, validation, and final import. (The spec for the wizard itself is out of scope for this page).
*   **Component: `Anonymize Records Card`**
    *   **Button Text:** "Begin Anonymization"
    *   **Interaction:** Clicking the button opens a `Dialog` with a high-visibility warning.
        *   **Dialog Content:**
            *   `H2 Title`: "WARNING: Irreversible Action"
            *   `P Text`: "This action will permanently anonymize all case and user data older than 2 years that is not associated with an active supplier. This cannot be undone."
            *   `NeumorphicInput`: "To confirm, please type 'ANONYMIZE' below."
            *   `NeumorphicButton (Destructive, Disabled)`: "Confirm Anonymization"
        *   **Interaction Logic:** The "Confirm Anonymization" button only becomes enabled when the user correctly types "ANONYMIZE" (case-sensitive) into the input field.

**4. User Interaction & Animations**
*   **Flow 1: Standard Action Confirmation**
    1.  **User Action:** Clicks "Generate Backup".
    2.  **Animation:** The confirmation `Dialog` scales in from the center. On confirm, it scales out, and the `Sonner` toast animates in from the top of the screen.
*   **Flow 2: High-Stakes Confirmation**
    1.  **User Action:** Clicks "Begin Anonymization".
    2.  **Animation:** The warning `Dialog` scales in. When the user types the confirmation word, the disabled button animates to an active state (full opacity, stronger shadow).

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):**
    *   The grid of action cards collapses to a single vertical column.
    *   `Dialog` modals will take up more screen width for better readability.

**6. Edge Cases & Empty States**
*   **Permissions:** This entire page is strictly accessible only to users with the 'Super Admin' role.
*   **Process in Progress:** If a long-running task like a backup is already in progress, the corresponding `Action Card`'s button will be replaced by a non-interactive status indicator. For example: "Backup in progress... (Started at 10:45 AM)".
*   **Error State:** If an action fails to initiate due to an API error, a `destructive` style `Sonner` toast will appear with a clear error message.


## **7. Project-Based Vetting Campaigns**

This section details the design and user experience for the "Vetting Projects" feature set. This module allows Risk Agents to move beyond single-case management and execute proactive, strategic, batch-vetting campaigns.

---

### **7.1: Vetting Projects List Page**

**1. Overview & User Goal**
*   **PRD Reference:** Epic 4.9: Project-Based Vetting Campaigns
*   **User Story:** "As a Risk Agent, I need a central page to view all past and present vetting projects, so I can track their overall status and access the detailed dashboard for any specific campaign."
*   **Design Intent:** To provide a clean, high-level overview of all batch-vetting initiatives. This page serves as the main entry point to the Projects module. The design prioritizes at-a-glance status checks and easy navigation. It should feel like a project management portfolio dashboard.

**2. Layout & Wireframe**
*   **Description:** A standard full-width layout featuring a data table of all projects, with a primary call-to-action to create a new one.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - **Page Title:** "Vetting Projects"
      - **Controls Bar:** A flex container above the table.
        - [COMPONENT: NeumorphicInput with Search Icon] - "Search by project name..."
        - [COMPONENT: NeumorphicButton (Primary)] - "Create New Project" (Icon: `FolderPlus`).
      - **Main Content:**
        - [COMPONENT: NeumorphicDataTable] - Displays all created projects.
    ```

**3. Component Breakdown & Specification**
*   **Component: `NeumorphicDataTable` (Projects List variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content & Columns:**
        *   `Project Name`: Text. This cell is the primary link to the project's dashboard.
        *   `Status`: A `Badge` with color-coding (Blue/In Progress, Green/Completed, Grey/Archived).
        *   `Progress`: A thin, linear `ProgressBar` component visualizing the completion percentage.
        *   `Cases`: Text displaying the count of associated cases (e.g., "50 cases").
        *   `Created By`: Text (Agent's name).
        *   `Date Created`: Timestamp.
        *   `Actions`: A `ContextMenu` trigger button (`MoreHorizontal` icon).
    *   **Interaction:** Clicking on the `Project Name` navigates the user to `/vetting/projects/[projectId]`.
*   **Component: `Create New Project Button`**
    *   **Type:** `NeumorphicButton`.
    *   **Interaction:** Clicking this button opens the full-screen `Project Creation Wizard` modal.
*   **Component: `Actions ContextMenu`**
    *   **Content & Actions:**
        *   `View Dashboard`: Navigates to the project dashboard.
        *   `Archive Project`: For completed projects, removes them from the default view.
        *   `Delete Project`: (Destructive action) Shows a high-stakes confirmation `Dialog`.

**4. User Interaction & Animations**
*   **Flow 1: Page Load**
    1.  **Initial State:** The table displays a skeleton screen with shimmering rows.
    2.  **Animation:** On data load, the skeleton fades out, and the project rows animate in with a subtle stagger, similar to other table views in the app.
*   **Flow 2: Creating a Project**
    1.  **User Action:** Clicks "Create New Project".
    2.  **Animation:** The `Project Creation Wizard` modal appears with a smooth, scaling animation (`initial={{ opacity: 0, scale: 0.95 }}`).

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 768px):** The `NeumorphicDataTable` becomes horizontally scrollable, prioritizing the `Project Name`, `Status`, and `Progress` columns.

**6. Edge Cases & Empty States**
*   **Empty State:** If no projects have been created, the page displays an empty state component with an illustration (e.g., a folder icon), a `H2` title "No Vetting Projects Found", and a prominent `NeumorphicButton` to "Create Your First Project".
*   **Error State:** If the project list fails to load, the table is replaced by an `ErrorState` component with a "Could not load projects" message and a "Retry" button.

---

### **7.2: Project Creation Wizard**

**1. Overview & User Goal**
*   **PRD Reference:** Feature 4.9.1
*   **User Story:** "As a Risk Agent, I want to use a guided wizard to create a new 'Vetting Project', define its scope, build a specific supplier cohort using advanced filters, and select the checks to be performed."
*   **Design Intent:** To simplify a complex, multi-faceted task into a series of clear, manageable steps. The wizard design prevents cognitive overload by focusing the user on one decision at a time. The experience should feel powerful yet controlled, giving the user confidence in the batch process they are about to launch.

**2. Layout & Wireframe**
*   **Description:** A full-screen `Dialog` modal that contains the wizard content. A `Stepper` component is always visible at the top to show progress.
    ```
    - **Modal Layout:** Full-screen Dialog (90vw width, 90vh height).
      - [COMPONENT: Stepper Component] - "Step 1: Define -> Step 2: Select Suppliers -> Step 3: Select Checks -> Step 4: Review".
      - [CONTAINER: Animated Step Content] - Managed by Framer Motion's AnimatePresence.
        - **[VIEW 1: Define Project]**
          - `H2`: "Project Details"
          - `NeumorphicInput`: "Project Name"
          - `NeumorphicTextarea`: "Project Description"
        - **[VIEW 2: Select Suppliers]**
          - **Layout:** Two-panel view.
            - **Left Panel (Filters):** A stack of `NeumorphicSelect`, `NeumorphicInput` for filtering.
            - **Right Panel (Results):** A `NeumorphicDataTable` of suppliers with checkboxes.
            - **Footer:** "X suppliers selected", "Select All Filtered" button.
        - **[VIEW 3: Select Checks]**
          - `H2`: "Select Vetting Checks"
          - A checklist of all available vetting checks using `NeumorphicCheckbox`.
        - **[VIEW 4: Review & Execute]**
          - A read-only summary of all previous steps.
      - **Footer Bar:**
        - `NeumorphicButton (Secondary)`: "Back"
        - `NeumorphicButton (Primary)`: "Next" or "Execute Project"
    ```

**3. Component Breakdown & Specification**
*   **Component: `Stepper Component`**
    *   **Type:** Custom component. The current step is highlighted with the brand's accent color and an `inset` shadow. Completed steps show a checkmark.
*   **Component: `Supplier Cohort Builder` (Step 2)**
    *   **Type:** A complex, composite component.
    *   **Interaction:** The filters on the left panel are bound to the data table on the right. Changing a filter instantly (with debounce) re-queries the API and updates the table. Checking a box adds a supplier to the project's state. The "Selected Suppliers" count updates in real-time.
*   **Component: `Review Summary` (Step 4)**
    *   **Type:** A series of read-only text blocks and lists.
    *   **Interaction:** Each section (e.g., "Selected Suppliers") has an "Edit" link that takes the user back to the corresponding step in the wizard.

**4. User Interaction & Animations**
*   **Flow 1: Navigating between steps**
    *   **Animation:** When the user clicks "Next," the current view slides out to the left while fading out. The next view slides in from the right while fading in. The reverse happens for "Back." This horizontal motion reinforces the sense of forward/backward progress. This is managed by `AnimatePresence`.
*   **Flow 2: Executing the Project**
    *   **User Action:** Clicks "Execute Project" on the final step.
    *   **Animation:** The button shows a `CircularProgressRing`. The entire modal then fades out, and a `Sonner` toast appears on the main page: "Project '[Project Name]' has been created and is now executing." The user is then redirected to the newly created Project Dashboard page.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 1024px):**
    *   The `Supplier Cohort Builder`'s two-panel layout collapses. The filters will appear in a collapsible `Accordion` component above the results table.

**6. Edge Cases & Empty States**
*   **Validation:** The "Next" button is disabled until the required fields in the current step are completed (e.g., Project Name in Step 1, at least one supplier selected in Step 2).
*   **Losing State:** The wizard's state should be preserved in a state management store. If the user accidentally closes the modal, a confirmation prompt should appear: "Are you sure you want to discard this project draft?"

---

### **7.3: Project Dashboard**

**1. Overview & User Goal**
*   **PRD Reference:** Feature 4.9.3
*   **User Story:** "As a Risk Agent, after launching a project, I need a dedicated dashboard to monitor the overall progress of the entire campaign in real-time, so I can track its completion and identify any systemic bottlenecks."
*   **Design Intent:** To provide a "campaign command center" view. This page shifts focus from individual cases to the health of the batch initiative. The design will use prominent data visualizations for the aggregate view and a detailed data table for drilling down into the individual components of the project.

**2. Layout & Wireframe**
*   **Description:** A dashboard layout with high-level aggregate KPIs at the top, followed by the detailed list of cases within the project.
    ```
    - **Page Layout:** Full-width content area within the main DashboardLayout.
      - [COMPONENT: Page Header]
        - `H1`: Project Name (e.g., "Plumbers in Rustenburg > R100k")
        - `P`: Project Description
      - **Responsive Grid (3 columns on desktop, 1 on mobile):**
        - [WIDGET 1: Overall Progress] - A large `CircularProgressRing` widget.
        - [WIDGET 2: Case Status Breakdown] - A set of KPI cards.
        - [WIDGET 3: Top Blockers] - A list of common bottlenecks.
      - **Main Content:**
        - `H2`: "Project Cases"
        - [COMPONENT: NeumorphicDataTable] - Lists all vetting cases linked to this project.
    ```

**3. Component Breakdown & Specification**
*   **Component: `Overall Progress Widget`**
    *   **Type:** A large `NeumorphicCard` containing the `CircularProgressRing` component.
    *   **Content:** The ring visually represents the percentage of completed cases. The center of the ring displays the percentage as text (e.g., "70% Complete").
*   **Component: `Case Status Breakdown Widget`**
    *   **Type:** `NeumorphicCard`.
    *   **Content:** A series of small KPI displays (e.g., "35 In Progress", "10 Pending Consent", "5 Completed").
*   **Component: `Top Blockers Widget`**
    *   **Type:** `NeumorphicCard`.
    *   **Content:** An ordered list of the most common reasons cases are stalled. E.g., "1. Awaiting Consent (10 cases)", "2. Awaiting MIE Results (8 cases)". Each item is a link that filters the main data table below.
*   **Component: `NeumorphicDataTable` (Project Cases variant)**
    *   **Type:** `NeumorphicDataTable`.
    *   **Content:** This table is identical in structure to the main "Active Cases Mission Board" table, but its data source is pre-filtered by the `project_id`.

**4. User Interaction & Animations**
*   **Flow 1: Live Progress Updates**
    *   **Event:** A background process (e.g., SSE or polling) pushes a new update (e.g., a case moves to 'Completed').
    *   **Animation:**
        *   The `CircularProgressRing` animates smoothly to its new value.
        *   The numbers in the KPI cards "count up" or "count down" to their new values.
        *   The status badge for the updated case in the data table flashes briefly with its new color.
*   **Flow 2: Filtering via Widget**
    *   **User Action:** Clicks on "Awaiting Consent (10 cases)" in the Top Blockers widget.
    *   **Animation:** The main data table below filters to show only those 10 cases, using the same fade/reload animation as other tables.

**5. Responsive Design Behavior**
*   **Tablet & Mobile (max-width: 1024px):** The top-level widget grid collapses to a single vertical column, followed by the main data table which becomes horizontally scrollable.

**6. Edge Cases & Empty States**
*   **New Project:** When a project has just been executed, all cases will likely be in the "Initiated" or "Pending Consent" state. The dashboard will accurately reflect this, with the progress ring at or near 0%.
*   **Error State:** If the project dashboard data fails to load, a full-page `ErrorState` is shown with a "Could not load project data" message and a "Retry" button.

---
