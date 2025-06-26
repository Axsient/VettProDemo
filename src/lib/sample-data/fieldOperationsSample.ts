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

// --- Geofences ---
export const getGeofences = () => [
  { id: 'geo-1', name: 'Sibanye-Westonaria Zone', client: 'Sibanye Stillwater' },
  { id: 'geo-2', name: 'Sibanye-Libanon Zone', client: 'Sibanye Stillwater' },
]; 