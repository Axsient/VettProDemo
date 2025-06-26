Excellent. This is the perfect next step. By providing explicit instructions based on your existing component library and project structure, we can ensure a fast, consistent, and high-quality build.

You have all the core visual elements. Now, we'll compose them into functional pages.

Here is your detailed, decisive guide to building the entire "Field Operations" section.

---

### **Preparation: Data and Types Structure** ✅ COMPLETED

To ensure your frontend is easily connected to a real API later, we will centralize all sample data.

**1. Create Type Definitions:** ✅ COMPLETED
In your `src/types/` directory, create a new file named `field-operations.ts`. Add the following interfaces. This enforces data consistency from the start.

```typescript
// src/types/field-operations.ts

export interface FieldAgent {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'Online' | 'Offline' | 'On-Task';
  activeTasks: number;
  completionRate: number; // as a percentage
}

export interface CommunityMember {
  id: string;
  name: string;
  idNumber: string; // SA ID Number
  address: string;
  skills: string[];
  vettingStatus: 'Pending' | 'Verified' | 'Flagged' | 'Not Started';
  dateAdded: string;
  avatarUrl: string;
}

export interface LocationVerificationTask {
  id: string;
  supplierName: string;
  address: string;
  status: 'Pending Assignment' | 'In Progress' | 'Submitted' | 'Overdue' | 'Completed';
  agent?: FieldAgent;
  dueDate: string;
  geofenceZone: 'Sibanye-Westonaria' | 'Sibanye-Libanon';
  // For the review dialog
  capturedGps?: { lat: number; lng: number };
  submittedPhotos?: string[];
  agentNotes?: string;
}

export interface CanvassingDrive {
  id: string;
  name: string;
  targetArea: string;
  status: 'Active' | 'Planned' | 'Completed';
  signupGoal: number;
  currentSignups: number;
}
```

**2. Create the Sample Data File:** ✅ COMPLETED
In your `src/lib/sample-data/` directory, create a new file named `fieldOperationsSample.ts`. This file will contain all the mock data for this section.

```typescript
// src/lib/sample-data/fieldOperationsSample.ts
import { FieldAgent, CommunityMember, LocationVerificationTask, CanvassingDrive } from '@/types/field-operations';

// --- Field Agents ---
export const getFieldAgents = (): FieldAgent[] => [
  { id: 'agent-1', name: 'Bongani Dlamini', avatarUrl: '/avatars/agent1.png', status: 'Online', activeTasks: 2, completionRate: 98 },
  { id: 'agent-2', name: 'Sarah van Wyk', avatarUrl: '/avatars/agent2.png', status: 'On-Task', activeTasks: 1, completionRate: 95 },
  { id: 'agent-3', name: 'Thabo Mokoena', avatarUrl: '/avatars/agent3.png', status: 'Offline', activeTasks: 0, completionRate: 99 },
];

// --- Community Members ---
export const getCommunityMembers = (): CommunityMember[] => [
  { id: 'cm-1', name: 'Nomvula Khumalo', idNumber: '8501100123089', address: '123 Impala St, Westonaria', skills: ['Welding', 'Pipe Fitting'], vettingStatus: 'Verified', dateAdded: '2024-05-10', avatarUrl: '/avatars/cm1.png' },
  { id: 'cm-2', name: 'Pieter Botha', idNumber: '9203155123087', address: '45 Springbok Rd, Carletonville', skills: ['Heavy Duty Driving (Code 14)', 'First Aid'], vettingStatus: 'Pending', dateAdded: '2024-05-12', avatarUrl: '/avatars/cm2.png' },
  { id: 'cm-3', name: 'Lerato Molefe', idNumber: '9907220456081', address: '78 Eland St, Westonaria', skills: ['Administration', 'Data Entry'], vettingStatus: 'Not Started', dateAdded: '2024-05-14', avatarUrl: '/avatars/cm3.png' },
  { id: 'cm-4', name: 'David Chen', idNumber: '7911055879088', address: '210 Main Reef Rd, Randfontein', skills: ['Electrical Engineering'], vettingStatus: 'Flagged', dateAdded: '2024-05-09', avatarUrl: '/avatars/cm4.png' },
];

// --- Location Verification Tasks ---
export const getLocationVerificationTasks = (): LocationVerificationTask[] => [
  { id: 'loc-1', supplierName: 'Westonaria Mining Supplies', address: '1 Industrial Rd, Westonaria', status: 'Submitted', agent: getFieldAgents()[0], dueDate: '2024-05-20', geofenceZone: 'Sibanye-Westonaria', capturedGps: { lat: -26.3195, lng: 27.6499 }, submittedPhotos: ['/locations/loc1_photo1.jpg'], agentNotes: 'Confirmed operational storefront at location.' },
  { id: 'loc-2', supplierName: 'Carletonville Tools', address: '55 Gold St, Carletonville', status: 'In Progress', agent: getFieldAgents()[1], dueDate: '2024-05-25', geofenceZone: 'Sibanye-Westonaria' },
  { id: 'loc-3', supplierName: 'Randfontein Logistics', address: '14 Warehouse Ln, Randfontein', status: 'Overdue', agent: getFieldAgents()[0], dueDate: '2024-05-15', geofenceZone: 'Sibanye-Westonaria', capturedGps: { lat: -26.1842, lng: 27.7011 }, submittedPhotos: ['/locations/loc3_photo1.jpg'], agentNotes: 'GPS coordinates are 5km outside the required geofence. Address appears to be a residential home.'},
  { id: 'loc-4', supplierName: 'Libanon Catering Co.', address: '9 Cookhouse Rd, Libanon', status: 'Pending Assignment', dueDate: '2024-06-01', geofenceZone: 'Sibanye-Libanon' },
];

// --- Canvassing Drives ---
export const getCanvassingDrives = (): CanvassingDrive[] => [
    { id: 'drive-1', name: 'Westonaria Community Drive Q2/24', targetArea: 'Westonaria', status: 'Active', signupGoal: 100, currentSignups: 47 },
    { id: 'drive-2', name: 'Carletonville Outreach Q3/24', targetArea: 'Carletonville', status: 'Planned', signupGoal: 150, currentSignups: 0 },
    { id: 'drive-3', name: 'Bekkersdal Skills Fair Q1/24', targetArea: 'Bekkersdal', status: 'Completed', signupGoal: 50, currentSignups: 62 },
];
```

---

### **Page Build Instructions**

Now, let's build each page within the `src/app/field-operations/` directory.

#### **1. Field Operations Dashboard** ✅ COMPLETED

*   **File Path:** `src/app/field-operations/dashboard/page.tsx` ✅ COMPLETED
*   **Purpose:** Provide a high-level, real-time command center for the entire field operations team.
*   **Page Layout & UI Components:**
    1.  Wrap the entire page in `<NeumorphicBackground>`.
    2.  Use a responsive grid (`grid grid-cols-1 lg:grid-cols-3 gap-2`).
    3.  **Left Side (2 columns wide):**
        *   A large `<NeumorphicCard>` containing the `<InteractiveMap>` component. This map should be loaded with `<LazyLoad>`.
    4.  **Right Side (1 column wide):**
        *   A section of `<NeumorphicStatsCard>` components.
        *   A `<NeumorphicCard>` containing a chart for "Task Status Breakdown." Use the `<PieDonutChartsDemo>` as a template.
        *   A `<NeumorphicCard>` with a simple `NeumorphicTable` showing "Recent Submissions."
*   **Component Functionality:**
    *   **`<NeumorphicStatsCard>`:** Display KPIs: "Active Agents" (count from `getFieldAgents`), "Pending Verifications" (count from `getLocationVerificationTasks`), "Overdue Tasks", and "New Community Members" (hardcode a value like "4" for the demo).
    *   **`<InteractiveMap>`:**
        *   Display markers for each `LocationVerificationTask` with a `Pending Assignment` or `In Progress` status. Use real coordinates around Westonaria, ZA.
        *   Clicking a marker should open a popup showing the Supplier Name and a `<NeumorphicButton>` to "View Task".
    *   **Task Status Chart:** The donut chart should visualize the different statuses from `getLocationVerificationTasks`.
    *   **Recent Submissions Table:** Use the simple `<NeumorphicTable>` from your `ui-elements` page. Display the 3 most recent tasks with a "Submitted" or "Completed" status.
*   **Required Sample Data:**
    *   `getFieldAgents()`
    *   `getLocationVerificationTasks()`

#### **2. Community Canvassing** ✅ COMPLETED

*   **File Path:** `src/app/field-operations/community-canvassing/page.tsx` ✅ COMPLETED
*   **Purpose:** To manage the entire lifecycle of the community skills database program.
*   **Page Layout & UI Components:**
    1.  Wrap the page in `<NeumorphicBackground>` and a main `<NeumorphicCard>`.
    2.  Inside the card, implement the **`<NeumorphicTabs>`** component. This is the primary navigation.
*   **Tab 1: Community Members Database**
    *   **UI Components:** Use your advanced `<DataTableDemo>` component as the template. Include a search `<Input>` at the top.
    *   **Functionality:**
        *   The table should display all data from `getCommunityMembers()`.
        *   Columns: Avatar/Name, ID Number, Address, Skills (using `<NeumorphicBadge>` for each skill), Vetting Status (`<NeumorphicBadge>` with appropriate success/warning/danger colors).
        *   The search input should filter the table in real-time.
        *   Each row should have an action menu to "View Profile" or "Initiate Vetting."
*   **Tab 2: Onboard New Community Member**
    *   **UI Components:** A form within a `<NeumorphicCard>`.
        *   Use `<NeumorphicHeading>` for the title "Onboard New Community Member".
        *   `<SAIdInput showDetails={true}>` for the ID number.
        *   `<Input>` for Full Name.
        *   `<PhoneInput showType={true}>` for contact number.
        *   `<AddressInput>` for the physical address.
        *   A multi-select component (from your `SelectionComponentsDemo`) for "Skills".
        *   `<NeumorphicFileUpload>` to upload "ID Document Copy" and "Qualification Certificates".
        *   A `<NeumorphicButton>` at the bottom labeled "Submit for Review".
    *   **Functionality:** Clicking "Submit" should trigger a `toast` notification saying "Record submitted for admin approval."
*   **Tab 3: Manage Canvassing Drives**
    *   **UI Components:** A `<NeumorphicCard>` with a `<NeumorphicButton>` for "Create New Drive" and a `<NeumorphicTable>` below it.
    *   **Functionality:**
        *   The table displays data from `getCanvassingDrives()`.
        *   Columns: Drive Name, Target Area, Status (`<NeumorphicBadge>`), and a progress bar (use `<NeumorphicProgress>` from `Active Vetting Cases` in `menu.md`) showing goal vs. current signups.
*   **Required Sample Data:**
    *   `getCommunityMembers()`
    *   `getCanvassingDrives()`

#### **3. Business Location Verification** ✅ COMPLETED

*   **File Path:** `src/app/field-operations/business-location-verification/page.tsx` ✅ COMPLETED
*   **Purpose:** The central hub for managing and tracking the physical verification of supplier premises.
*   **Page Layout & UI Components:**
    1.  Again, use `<NeumorphicBackground>`, a parent `<NeumorphicCard>`, and `<NeumorphicTabs>`.
*   **Tab 1: Verification Queue** ✅ COMPLETED
    *   **UI Components:** The `<NeumorphicDataTable>`.
    *   **Functionality:**
        *   Display data from `getLocationVerificationTasks()`.
        *   Columns: Supplier Name, Address, Assigned Agent (show agent's name and avatar), Status (`<NeumorphicBadge>`), Due Date.
        *   Row action to "View/Review Submission".
*   **Tab 2: Review Submission (The Key Demo)** ✅ COMPLETED
    *   **This tab is for demonstration; in reality, this is the modal/dialog opened from the queue.**
    *   **UI Components:** Open a full-screen `<Dialog variant="neumorphic">`.
    *   **Dialog Layout:** Use a two-column responsive grid (`grid grid-cols-1 md:grid-cols-2 gap-4`).
        *   **Left Column:**
            *   `<NeumorphicHeading>`: Supplier Name.
            *   `<NeumorphicText>`: Registered Address.
            *   `<NeumorphicCard>` for "Agent Submission": Contains the agent's submitted photo(s) and their notes (`<NeumorphicText variant="secondary">`).
        *   **Right Column:**
            *   A `<NeumorphicCard>` containing the `<InteractiveMap>` loaded with `<LazyLoad>`.
    *   **Map Functionality:**
        *   It must display the client's geofence polygon (e.g., "Sibanye-Westonaria Zone").
        *   It must display a marker for the agent's captured GPS coordinates.
        *   A clear visual text indicator above the map: "STATUS: WITHIN GEOFENCE" (green) or "STATUS: OUTSIDE GEOFENCE - FLAGGED" (red). Use the `loc-3` data for the flagged example.
    *   **Dialog Footer:** Use `<DialogFooter>` with three `<NeumorphicButton>`s: "Approve Verification," "Flag for Investigation," and "Reject."
*   **Required Sample Data:**
    *   `getLocationVerificationTasks()` (especially the ones with complete submission data).
    *   `getLocationVerificationTasks()` (especially the ones with complete submission data for the review dialog).
    *   `getFieldAgents()` (to populate the "Assigned Agent" column).

### **4. Field Agent Management** ✅ COMPLETED

*   **File Path:** `src/app/field-operations/agent-management/page.tsx` ✅ COMPLETED
*   **Purpose:** To manage the human workforce conducting field operations, view their performance, and manage their status.
*   **Page Layout & UI Components:** ✅ COMPLETED
    1.  Wrap the page in `<NeumorphicBackground>`.
    2.  Use a single, full-width `<NeumorphicCard>` as the main content container.
    3.  Inside the card, add a header section using a `flex` layout with `justify-between` and `items-center`.
        *   On the left, a `<NeumorphicHeading>`: "Field Agent Management".
        *   On the right, a `<NeumorphicButton variant="neumorphic-outline">` labeled "Onboard New Agent".
    4.  Below the header, implement your advanced **`<NeumorphicDataTable>`**.
*   **Component Functionality:** ✅ COMPLETED
    *   **Data Table:**
        *   It will be populated with data from `getFieldAgents()`.
        *   **Columns:** ✅ COMPLETED
            *   **Agent:** Display the agent's avatar (`<img className="w-8 h-8 rounded-full">`) and their name (`NeumorphicText`).
            *   **Status:** Use `<NeumorphicBadge>` to display the status.
                *   `Online` -> `variant="success"`
                *   `Offline` -> `variant="secondary"`
                *   `On-Task` -> `variant="info"` (You can add an 'info' variant to your badge component if needed, likely a blue color).
            *   **Active Tasks:** A simple `NeumorphicText` displaying the number.
            *   **Completion Rate:** Display the percentage. You can enhance this with a small progress bar component.
            *   **Actions:** A row action menu with options to "Edit Profile" and "Deactivate".
    *   **"Onboard New Agent" Button:** ✅ COMPLETED
        *   This button will trigger a `<Dialog variant="neumorphic">`.
        *   The dialog will contain a simple form with `<Input>` fields for "Full Name," "Contact Number," and an "Agent ID."
        *   A `<DialogFooter>` will have a "Save Agent" button. For the demo, this will just close the dialog and show a `toast` notification.
*   **Required Sample Data:** ✅ COMPLETED
    *   `getFieldAgents()`

### **5. Geofence Management** ✅ COMPLETED

*   **File Path:** `src/app/field-operations/geofence-management/page.tsx` ✅ COMPLETED
*   **Purpose:** To allow administrators to visually create, view, and manage the geographic boundaries ("local zones") that are critical for verifying supplier locations.
*   **Page Layout & UI Components:** ✅ COMPLETED
    1.  Wrap the page in `<NeumorphicBackground>`.
    2.  Use a two-column responsive grid (`grid grid-cols-1 lg:grid-cols-3 gap-2`).
    3.  **Left Column (1 column wide):**
        *   A `<NeumorphicCard>` with a `<NeumorphicHeading>`: "Managed Geofences".
        *   Use a simple `<NeumorphicTable>` to list existing zones.
    4.  **Right Column (2 columns wide):**
        *   A `<NeumorphicCard>` containing the **`<GeofenceEditor>`** component (your interactive map with drawing tools), loaded with `<LazyLoad>`.
        *   Below the map, inside the same card, have a small form section with an `<Input>` for "Zone Name" and a `<NeumorphicButton>` for "Save New Geofence".
*   **Component Functionality:** ✅ COMPLETED
    *   **Geofence Table (Left):** ✅ COMPLETED
        *   Display a hardcoded list of geofences for the demo (e.g., "Sibanye-Westonaria Zone," "Sibanye-Libanon Zone").
        *   Columns: Zone Name, Client (e.g., "Sibanye Stillwater"), Actions ("Edit", "Delete").
    *   **`<GeofenceEditor>` Map (Right):** ✅ COMPLETED
        *   The map should initialize centered over the relevant area in South Africa.
        *   The drawing controls (from `leaflet-draw`) should be visible.
        *   When a user finishes drawing a polygon, the `onCreated` event should fire. For the demo, you can `console.log` the GeoJSON data to show it's being captured.
    *   **Save Form:** ✅ COMPLETED
        *   When the "Save New Geofence" button is clicked, it should trigger a `toast` notification confirming "Geofence 'Zone Name' has been saved."
*   **Required Sample Data:** ✅ COMPLETED
    *   This page is more about interaction, but you can create a small function in `fieldOperationsSample.ts` to populate the list on the left.
        ```typescript
        // Add to src/lib/sample-data/fieldOperationsSample.ts
        export const getGeofences = () => [
          { id: 'geo-1', name: 'Sibanye-Westonaria Zone', client: 'Sibanye Stillwater' },
          { id: 'geo-2', name: 'Sibanye-Libanon Zone', client: 'Sibanye Stillwater' },
        ];
        ```

---

### **Conclusion and Final Guidance** ✅ ALL COMPLETED

You now have a complete, actionable blueprint for the entire "Field Operations" section.

**✅ COMPLETED BUILD ORDER:**

1.  **Data Setup:** ✅ COMPLETED - Created `field-operations.ts` (types) and `fieldOperationsSample.ts` (data).
2.  **Build New Components:** ✅ COMPLETED - Built the reusable `NeumorphicTabs`, `NeumorphicFileUpload`, and the `InteractiveMap`/`GeofenceEditor` components.
3.  **Compose Pages:** ✅ COMPLETED - Assembled each page (`dashboard`, `community-canvassing`, `business-location-verification`, `agent-management`, `geofence-management`) using the existing component library and new components.

**✅ ALL PAGES IMPLEMENTED:**
- **Field Operations Dashboard** ✅ COMPLETED
- **Community Canvassing** ✅ COMPLETED  
- **Business Location Verification** ✅ COMPLETED
- **Field Agent Management** ✅ COMPLETED
- **Geofence Management** ✅ COMPLETED

By following this structure, you have created a frontend that is not only visually impressive and highly functional for a demo but is also architecturally sound. When the time comes, swapping out `getCommunityMembers()` with an API call like `fetch('/api/community-members')` will be a straightforward task because the data shapes and component props are already aligned. You've successfully separated the data layer from the presentation layer.