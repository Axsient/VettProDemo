**Product Requirements Document: VETTPRO - Frontend Shell (v2.0 - AI Taskmaster Edition)**

**1. Introduction & Core Vision**

*   **Project:** VETTPRO - Secure Supplier Vetting Platform (Frontend Shell).
*   **Purpose of this PRD:** To provide a complete, unambiguous, and self-contained set of requirements for building the initial frontend shell of the VETTPRO application. This document is the single source of truth for all visual, functional, and technical specifications for Phase 1. It is specifically designed to be parsed by Taskmaster AI to generate a precise and accurate task plan.
*   **Core Vision:** The frontend MUST embody the aesthetic of "Secure Intelligence, Sleekly Presented." This translates to a user interface that is:
    *   **Luminous & Dynamic:** Key data and interactive elements are highlighted with glows, suggesting live intelligence.
    *   **Tactile & Layered:** Glassmorphism effects create a sense of depth and modern interface layering.
    *   **Bold & Confident:** A dark, rich color palette is contrasted with vibrant accents.
    *   **Data-Centric & Clear:** The primary goal is the intuitive presentation of complex data.

**2. Visual References (The "Look and Feel")**

This section defines the target aesthetic by deconstructing the two provided reference images. The AI MUST adhere to these visual principles.

*   **Reference A: `Consilio-style_dashboard.png`**
    *   **Primary Contribution:** Defines the core layout, sidebar shape, and information density.
    *   **Key Elements to Replicate:**
        1.  **Uniquely Shaped Sidebar:** The most critical feature. The sidebar is NOT a standard rectangle. It has a smooth, continuous, curved right edge. This unique shape is non-negotiable.
        2.  **Layout:** A fixed left sidebar with a main content area. The sidebar contains the logo, a search bar, navigation links with icons, and a user profile section at the bottom.
        3.  **Active Navigation Link Style:** The active link is highlighted with a solid, vibrant-colored, pill-shaped background that contrasts with the icon and text.
        4.  **Information Density:** The design is clean but capable of holding dense information (e.g., cards with multiple data points, tags, and ratings).

*   **Reference B: `Recehtok-style_dashboard.png`**
    *   **Primary Contribution:** Defines the color theme, ambiance, and special effects (glows and glassmorphism).
    *   **Key Elements to Replicate:**
        1.  **Dark Theme Ambiance:** The default theme MUST use a deep, rich, near-black or dark indigo/purple background (e.g., `#1A1D2B` or `#111827`). This creates a dark, high-contrast environment.
        2.  **Luminous Glow Effect:** This is a critical aesthetic feature. Line charts have glowing lines and area fills. Key interactive elements (like the highlighted data point on the chart) have a subtle "bloom" or glow effect. This effect MUST be applied to charts and the focus/hover states of important interactive elements.
        3.  **Glassmorphism:** The notification panel demonstrates a "frosted glass" effect. This MUST be replicated for modals, popovers, and notification panels. The effect is achieved through a combination of a semi-transparent background, a backdrop blur, and a subtle border.

**3. Goals of this Phase**

*   To create a functional Next.js application shell with the specified technology stack.
*   To implement the primary navigation structure via a responsive, uniquely shaped sidebar.
*   To establish the core dark (default) and light themes, including all specified visual effects (glow, glassmorphism).
*   To create placeholder pages for each main navigation item to demonstrate routing.

**4. Scope**

*   **In Scope for Phase 1:**
    *   Full project setup with the specified tech stack.
    *   Implementation of the main application layout (sidebar + main content area).
    *   Full implementation of the sidebar navigation structure and styling.
    *   Implementation of dark (default) and light themes with a functional theme switcher.
    *   Creation of empty placeholder pages for all main navigation links.
    *   Responsive behavior of the sidebar.
    *   Application of glassmorphism and glow effects to representative static elements to establish the visual capability.
*   **Out of Scope for Phase 1:**
    *   Actual functionality within placeholder pages (no data fetching, no form submissions).
    *   Detailed implementation of charts with real data.
    *   User authentication and backend API integration.
    *   Database interactions, PDF generation, LLM integration.

**5. Detailed Functional & UI/UX Requirements**

**REQ-1: Main Layout & Theming**
*   **1.1:** The application WILL use a main layout consisting of a fixed left sidebar and a main content area.
*   **1.2:** A dark theme and a light theme MUST be implemented using the `next-themes` library.
*   **1.3:** The **dark theme is the default**. The dark theme background color MUST be a deep, rich color like `#1A1D2B`.
*   **1.4:** A theme switcher (e.g., a simple button) MUST be present and functional. The chosen theme MUST persist across sessions.

**REQ-2: The "Consilio" Sidebar (Visual & Structural)**
*   **2.1: Shape:** The sidebar's right edge MUST have a distinct, smooth curve, precisely replicating the shape in `Visual Reference A`. This MUST be achieved using an SVG `path` as a background image or a CSS mask. A standard rectangular sidebar is not acceptable.
*   **2.2: Background:**
    *   In Dark Mode, the sidebar background WILL be a slightly lighter shade of the main background (e.g., `bg-slate-800/80` or similar) and MAY incorporate a subtle glassmorphism effect (`backdrop-blur`).
    *   In Light Mode, the sidebar background WILL be `bg-white` or a very light gray.
*   **2.3: Elements:** The sidebar MUST contain placeholder elements for: Logo (top), Search Bar (shadcn/ui `Input`), Navigation Links (middle), and User Profile (bottom).
*   **2.4: Responsiveness:** On desktop views (`>1024px`), the sidebar MUST be fixed and always visible. On mobile views (`<768px`), the sidebar MUST be hidden and toggleable via a hamburger menu icon.

**REQ-3: Sidebar Navigation (Functional)**
*   **3.1:** The sidebar navigation links MUST be implemented exactly as specified below, including all main items, sub-menus, and visual separators.
*   **3.2:** Each link MUST use a `lucide-react` icon paired with the text label.
*   **3.3:** The currently active navigation link MUST be styled with a vibrant accent color background (e.g., electric blue or purple) in a pill shape, with contrasting text color, as seen in `Visual Reference A`.
*   **3.4: Navigation Structure:**
    *   **Dashboard**
    *   **Vetting Center**
        *   New Vetting Request
        *   Active Requests
        *   Completed Vettings
    *   **Suppliers**
        *   Supplier List
        *   Add New Supplier
    *   **Individuals**
        *   Individual List
        *   Add New Individual
    *   **Reporting & Insights**
        *   Standard Reports
        *   Generate Custom Report
        *   Risk Analytics Dashboard
    *   **Field Operations**
        *   Verification Dashboard
        *   Assign New Verification Task
    *   --- *(Visual Separator)* ---
    *   **Administration**
        *   User & Access Management
        *   Vetting Configuration
        *   System & Company Configuration
        *   Billing & Subscription
    *   **My Account**
        *   Profile Settings
        *   Security
        *   Notification Preferences
    *   **Help Center**
        *   Knowledge Base & FAQs
        *   Contact Support

**REQ-4: The "Recehtok" Aesthetic (Glow & Glassmorphism)**
*   **4.1: Glassmorphism:** This effect, as seen in the notification panel of `Visual Reference B`, MUST be applied to all modals (`Dialog`), popovers, and notification panels.
    *   **Implementation:** It WILL be created using Tailwind CSS utility classes: `bg-opacity-*` (e.g., `bg-slate-700/70`), `backdrop-blur-*`, and a subtle 1px border with `border-opacity-*`.
*   **4.2: Glow Effect:** This effect, inspired by the charts in `Visual Reference B`, is critical.
    *   **Implementation:**
        *   For charts (using Recharts), line and area elements WILL have a subtle, vibrant glow in their respective colors. This WILL be achieved via SVG filters (`<feGaussianBlur>`).
        *   Primary buttons and focused form inputs MUST have a subtle glow effect on their border/shadow to indicate an active or focused state.

**REQ-5: Core Component Styling (shadcn/ui)**
*   **5.1:** All base components (Button, Card, Input, etc.) WILL be from the `shadcn/ui` library.
*   **5.2:** Buttons: Primary buttons WILL use a bold accent color. Hover/focus states MUST trigger a subtle glow effect.
*   **5.3:** Inputs: All `Input` components WILL have clean styling. The focus state MUST be visually clear, using a glowing border in the primary accent color.
*   **5.4:** Cards: Cards WILL have rounded corners and solid dark (or light) backgrounds.

**REQ-6: Typography & Iconography**
*   **6.1:** The global font MUST be a clean, modern sans-serif font (e.g., **Inter** or **Manrope**).
*   **6.2:** All icons throughout the application MUST be from the `lucide-react` library, styled with Tailwind CSS.

**REQ-7: Placeholder Pages**
*   **7.1:** Every main navigation link listed in `REQ-3.4` MUST route to a unique placeholder page.
*   **7.2:** Each placeholder page MUST display a large title indicating its name (e.g., "<h1>Dashboard</h1>"). No other content is required.

**6. Technical Stack & Implementation Requirements**

*   **TR-1: Framework:** Next.js (latest stable, App Router) with TypeScript.
*   **TR-2: Styling:** Tailwind CSS. The `tailwind.config.js` file MUST be configured with the specified color palette (Dark: `#1A1D2B`, Accents: vibrant blue/purple, etc.).
*   **TR-3: UI Primitives:** **shadcn/ui**. This is the designated component library. No other component libraries (like Preline, Flowbite, etc.) are to be used.
*   **TR-4: Charting:** **Recharts**. This library MUST be installed and used for all charting to allow for SVG filter styling (glow effects).
*   **TR-5: Theme Management:** `next-themes`.
*   **TR-6: Iconography:** `lucide-react`.
*   **TR-7: Code Structure:** A logical folder structure MUST be used (e.g., `/components/layout`, `/components/ui`, `/app/dashboard`).
*   **TR-8: Linting/Formatting:** ESLint and Prettier MUST be set up for code quality and consistency.

**7. Acceptance Criteria**

*   The Next.js application builds successfully without errors.
*   The sidebar is implemented with the exact curved shape from `Visual Reference A`.
*   All navigation links from `REQ-3.4` are present, functional, and route to the correct placeholder page.
*   The active navigation link is highlighted correctly.
*   Dark/Light themes are functional, with the dark theme being the default and visually matching the ambiance of `Visual Reference B`.
*   At least one static element (e.g., a card on a placeholder page) demonstrates the glassmorphism effect.
*   At least one interactive element (e.g., a button) demonstrates the glow effect on hover/focus.
*   The project uses the exact technology stack specified in `TR-1` through `TR-8`.
*   The codebase is clean, formatted, and free of linting errors.