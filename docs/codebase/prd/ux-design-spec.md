## **VettPro Design & UX Specification Template**

### **[Page/View Name] - e.g., `4.2.2: Vetting Case Detail View`**

**1. Overview & User Goal**
*   **User Story (from PRD):** "As Sarah the Risk Agent, I need a comprehensive, single-page view for each vetting case where I can track its real-time status, review all submitted information, and see the results of every individual check as they become available."
*   **Design Intent:** To present a dense amount of information in a clean, scannable, and prioritized manner. The page should feel like a command center for the case, giving Sarah immediate access to the most critical data while allowing her to drill down into details without leaving the page. The Neumorphic design will be used to create a clear visual hierarchy between static information and interactive elements.

**2. Layout & Wireframe**
*   **Description:** A text-based, high-fidelity wireframe describing the structure and placement of all UI elements on the page.
*   **Example:**
    ```
    - **Page Layout:** Two-column responsive grid.
      - **Left Column (Main Content - 70% width):**
        - [COMPONENT: Case Summary Header] - Sticky at the top.
        - [COMPONENT: Status Stepper]
        - [COMPONENT: Tab Group] - 'Checks', 'Documents', 'Risk Analysis', 'Notes'.
          - [VIEW: 'Checks' Tab Content] - Default active view.
      - **Right Column (Contextual Panel - 30% width):**
        - [COMPONENT: Key Actions Panel]
        - [COMPONENT: Overall Risk Score Gauge]
        - [COMPONENT: Activity Feed]
    ```

**3. Component Breakdown & Specification**
*   **Description:** A detailed list of every component on the page. For each component, we specify its type (from our design system), its content, and its interactive behavior.
*   **Example:**
    *   **Component: `Case Summary Header`**
        *   **Type:** `NeumorphicCard (Elevated)`
        *   **Content:**
            *   `H1 Title`: Displays `vetting_case.entity_name`.
            *   `Status Badge`: Displays `vetting_case.status` with appropriate color-coding (Green for 'Completed', Blue for 'In Progress', etc.).
        *   **Interaction:** Non-interactive.
    *   **Component: `Key Actions Panel`**
        *   **Type:** `NeumorphicCard (Inset)`
        *   **Content:** A vertical stack of buttons.
            *   `[BUTTON: Primary]` - "Request Consent"
            *   `[BUTTON: Secondary]` - "Upload Manual Consent"
            *   `[BUTTON: Destructive]` - "Cancel Case"
        *   **Interaction:**
            *   **"Request Consent" Button:**
                *   **State:** Disabled if `case.status` is not `INITIATED`.
                *   **Action:** On click, triggers the `POST /api/vetting/cases/{caseId}/consent-request` API call.
                *   **Animation:** On click, button exhibits the standard "press-down" animation (scale 0.98). While the API call is pending, a `LoadingSpinner` component replaces the button text.

**4. User Interaction & Animations**
*   **Description:** A step-by-step description of how the user interacts with the page and the precise animations that occur. This is where we define the Framer Motion specifications.
*   **Example:**
    *   **Flow 1: Page Load**
        1.  **Initial State:** The page displays `SkeletonLoader` components for the header, tabs, and side panel.
        2.  **Animation:** Once data is fetched, the skeleton loaders fade out (opacity 0 over 200ms), and the main content panels fade in and slide up by 5px (using Framer Motion's `initial={{ opacity: 0, y: 5 }}` and `animate={{ opacity: 1, y: 0 }}`).
    *   **Flow 2: Switching Tabs**
        1.  **User Action:** User clicks on the "Documents" tab.
        2.  **Animation:**
            *   The active tab indicator slides smoothly from "Checks" to "Documents" over 250ms with an `ease-out` curve.
            *   The content of the "Checks" tab fades out (opacity 0 over 150ms).
            *   Simultaneously, the content of the "Documents" tab fades in (opacity 1 over 150ms, with a 50ms delay). This will be managed by Framer Motion's `<AnimatePresence>`.

**5. Responsive Design Behavior**
*   **Description:** Defines exactly how the layout adapts to different screen sizes.
*   **Example:**
    *   **Tablet (max-width: 1024px):** The two-column layout is maintained. The font size for `H1 Title` is reduced from 2.25rem to 2rem.
    *   **Mobile (max-width: 768px):**
        *   The layout collapses to a single column.
        *   The `Right Column (Contextual Panel)` is moved below the `Left Column (Main Content)`.
        *   The `Key Actions Panel` buttons transform into a floating action button (FAB) at the bottom-right of the screen for easy thumb access.

**6. Edge Cases & Empty States**
*   **Description:** Defines what the UI should look like when there is no data or an error occurs. This prevents a broken or confusing experience.
*   **Example:**
    *   **Empty State:** If the "Documents" tab is selected but no documents have been uploaded, the view must not be blank. It must display:
        *   An illustration/icon representing "no documents."
        *   A text block: "No Documents Uploaded. Use the 'Upload Manual Consent' action or complete the digital consent flow to add documents here."
    *   **Error State:** If the API call to fetch case details fails, the entire page must be replaced with an `ErrorState` component, displaying a user-friendly message ("Could not load case details.") and a "Retry" button.

---
