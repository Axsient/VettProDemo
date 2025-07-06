# VETTPRO Dashboard - Data Architecture Analysis

## Executive Summary

This comprehensive analysis documents the complete data architecture of the VETTPRO Dashboard application, a sophisticated South African vetting and supplier verification system. The application demonstrates a well-structured, API-ready data architecture with extensive sample data covering all aspects of the South African business verification landscape.

---

## 1. Data Architecture Overview

### 1.1 Architecture Pattern
- **Pattern**: Mock data with production-ready structure
- **Approach**: TypeScript-first with comprehensive interfaces
- **Migration Strategy**: Replace sample data imports with API calls
- **Geographic Focus**: South African business compliance and verification

### 1.2 Technology Stack
- **TypeScript 5**: Full type safety across data models
- **Next.js 15 App Router**: Modern React architecture
- **Sample Data Strategy**: Realistic data for immediate development
- **Validation Layer**: South African-specific business rule validation

---

## 2. Core Data Models & TypeScript Interfaces

### 2.1 Primary Entity Types (`src/types/vetting.ts`)

#### Vetting Entity Classifications
```typescript
export enum VettingEntityType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
  STAFF_MEDICAL = 'Staff Medical',
}
```

#### Check Categories
```typescript
export enum CheckCategory {
  IDENTITY = 'Identity',
  FINANCIAL = 'Financial', 
  CRIMINAL = 'Criminal',
  COMPLIANCE = 'Compliance',
  OPERATIONAL = 'Operational',
  REPUTATIONAL = 'Reputational',
  MEDICAL = 'Medical',
  BUSINESS_SPECIFIC = 'Business Specific',
}
```

#### Status Management
```typescript
export enum VettingStatus {
  INITIATED = 'Initiated',
  CONSENT_PENDING = 'Consent Pending',
  IN_PROGRESS = 'In Progress',
  PARTIALLY_COMPLETE = 'Partially Complete',
  COMPLETE = 'Complete',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

export enum ConsentStatus {
  PENDING = 'Pending',
  GRANTED = 'Granted', 
  DENIED = 'Denied',
  EXPIRED = 'Expired',
}
```

### 2.2 Core Business Entities

#### Individual Details
```typescript
export interface IndividualDetails {
  firstName: string;
  lastName: string;
  idNumber?: string; // SA ID number with Luhn validation
  passportNumber?: string; // For non-SA nationals
  nationality: string;
  mobileNumber: string; // SA phone format validation
  emailAddress?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
}
```

#### Company Details
```typescript
export interface CompanyDetails {
  companyName: string;
  registrationNumber: string; // CIPC registration number
  vatNumber?: string; // SARS VAT number
  primaryContactName?: string;
  primaryContactMobile?: string;
  primaryContactEmail?: string;
  businessType?: string;
  industry?: string;
  yearEstablished?: number;
  physicalAddress?: string;
}
```

#### Staff Medical Details
```typescript
export interface StaffMedicalDetails extends IndividualDetails {
  projectId: string; // Reference to MiningProject
  staffEmployeeId?: string;
  jobRole: string;
  department?: string;
  supervisorName?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}
```

### 2.3 Vetting Process Models

#### Vetting Check Definition
```typescript
export interface VettingCheckDefinition {
  id: string;
  name: string;
  description: string;
  category: CheckCategory;
  applicableTo: VettingEntityType[];
  estimatedCostZAR?: number;
  estimatedTurnaroundDays?: number;
  consentRequired: boolean;
  provider?: string;
  isActive: boolean;
  requiresDocuments?: string[];
  riskLevel?: 'Low' | 'Medium' | 'High';
}
```

#### Active Vetting Case
```typescript
export interface ActiveVettingCase extends VettingCase {
  overallProgress: number; // 0-100 percentage
  completedChecks: number;
  totalChecks: number;
  lastStatusUpdate: string;
  estimatedCompletionDate?: string;
  isOverdue: boolean;
  daysSinceInitiated: number;
  individualChecks: ActiveVettingCheck[];
  assignedVettingOfficer?: string;
  flaggedForReview?: boolean;
  hasBlockers?: boolean;
  auditTrail?: VettingAuditEntry[];
}
```

---

## 3. Sample Data Architecture

### 3.1 Sample Data Organization (`src/lib/sample-data/`)

#### Core Sample Data Files
- **`vettingChecksSample.ts`**: 30+ comprehensive vetting checks
- **`activeVettingCasesSample.ts`**: Realistic active vetting scenarios
- **`supplierSample.ts`**: South African supplier data
- **`projectsSample.ts`**: Mining projects across all 9 provinces
- **`fieldOperationsSample.ts`**: Geographic verification data
- **`completedReportsSample.ts`**: Historical reporting data
- **`consentRequestsSample.ts`**: Consent management workflows
- **`scheduledChecksSample.ts`**: Recurring verification schedules
- **`adminTasksSample.ts`**: Administrative workflow data
- **`rfpSample.ts`**: RFP and procurement data

### 3.2 Vetting Checks Catalog

#### Identity Verification
- SA ID Verification (R50, 1 day)
- Passport Verification (R120, 2 days)
- Education Qualification Verification (R200, 3 days)
- Employment History Verification (R300, 5 days)

#### Criminal Background
- Criminal Record Check (AFIS) (R150, 2 days)
- Enhanced Criminal Record Check (R300, 5 days)
- Watchlist & Sanctions Screening (R100, 1 day)

#### Financial Verification
- Individual Credit Report (R120, 1 day)
- Business Credit Report (R300, 1 day)
- Bank Account Verification (R80-90, 1 day)

#### Compliance Checks
- PEP & Sanctions Screening (R80-150, 1 day)
- VAT Registration Verification (R70, 1 day)
- Tax Compliance Status Check (R100, 2 days)

#### Business-Specific
- CIPC Company Registration Check (R100, 1 day)
- BEE Certificate Verification (R150, 2 days)
- Professional Licenses Verification (R250, 3 days)

#### Medical Checks (Mining Industry)
- Certificate of Fitness (R600, 2 days)
- Drug & Alcohol Screening (R350, 1 day)
- Psychological Fitness Assessment (R1200, 5 days)
- Infectious Disease Screening (R400, 2 days)

### 3.3 Pre-configured Packages

#### Basic Supplier Onboarding (R520, 2 days)
- CIPC Company Check
- VAT Registration Verification
- Business Bank Account Verification
- Business Credit Report

#### Comprehensive Supplier Due Diligence (R1350, 5 days)
- All basic checks plus:
- Physical Location Verification
- BEE Certificate Verification
- Media & Internet Search
- PEP & Sanctions Screening

#### Mining Staff Medical Packages (R1080-2730, 3-7 days)
- Standard: Basic medical fitness
- Comprehensive: Full medical and psychological assessment

---

## 4. South African Business Context Data

### 4.1 Geographic Distribution

#### Provincial Coverage (from `projectsSample.ts`)
- **Gauteng**: Johannesburg, Carletonville, Westonaria, Soweto
- **Limpopo**: Mokopane, Steelpoort, Lephalale, Phalaborwa, Musina
- **North West**: Marikana, Rustenburg, Brits
- **Northern Cape**: Sishen, Postmasburg, Hotazel, Kuruman, Aggeneys
- **Mpumalanga**: Hendrina, Kromdraai
- **KwaZulu-Natal**: Kliprivier
- **Free State**: Kroonstad

#### Major Mining Operations
- **Platinum**: Sibanye Stillwater, Anglo American Platinum, Impala
- **Gold**: AngloGold Ashanti, Harmony Gold Mining
- **Iron Ore**: Kumba Iron Ore
- **Coal**: Exxaro Resources, Sasol Mining, Glencore, Thungela
- **Diamonds**: De Beers Consolidated Mines
- **Manganese**: South32, African Rainbow Minerals

### 4.2 South African Validation Systems

#### SA ID Number Validation (`src/lib/utils/validation.ts`)
```typescript
export function validateSAIdNumber(idNumber: string): {
  isValid: boolean;
  details?: {
    dateOfBirth: Date;
    gender: 'Male' | 'Female';
    citizenship: 'SA Citizen' | 'Permanent Resident';
    age: number;
  };
  error?: string;
}
```
- **Algorithm**: Luhn algorithm implementation
- **Format**: YYMMDD + sequence + citizenship + race + checksum
- **Validation**: Date validation, century calculation, checksum verification

#### Phone Number Validation
```typescript
export function validateSAPhoneNumber(phone: string): {
  isValid: boolean;
  formatted?: string;
  type?: 'Mobile' | 'Landline';
  error?: string;
}
```
- **Formats**: +27, 27, 0 prefixes
- **Mobile Codes**: 60-89 area codes
- **Output**: International format (+27 XX XXX XXXX)

#### Company Registration Validation
```typescript
export function validateSACompanyNumber(regNumber: string): {
  isValid: boolean;
  type?: 'Close Corporation' | 'Private Company' | 'Public Company';
  error?: string;
}
```
- **Close Corporation**: CK[YYYY]/[6-digit]
- **Private Company**: [YYYY]/[6-digit]/07
- **Public Company**: [YYYY]/[6-digit]/06

#### VAT Number Validation
- **Format**: 10-digit number starting with 4
- **Integration**: SARS API compatibility planned

### 4.3 Compliance Framework

#### Regulatory Bodies
- **CIPC**: Companies and Intellectual Property Commission
- **SARS**: South African Revenue Service
- **MIE**: Managed Integrity Evaluation
- **SAPS AFIS**: Fingerprint identification system

#### BEE (Broad-Based Black Economic Empowerment)
- Level 1-8 classification system
- Certificate verification workflow
- Compliance status tracking

---

## 5. Currency & Formatting Standards

### 5.1 Currency Formatting (`src/components/charts/apex/utils/data-formatters.ts`)

```typescript
export const formatNumber = (
  value: number,
  options: {
    currency?: boolean;
    // ... other options
  } = {}
): string => {
  // ...
  if (currency) {
    formatted = `R${formatted}`;
  }
  // ...
};
```

#### ZAR (South African Rand) Standards
- **Symbol**: R (before amount)
- **Format**: R1,234.56
- **Thousands Separator**: Comma (,)
- **Decimal Separator**: Period (.)

### 5.2 Date Formatting
```typescript
export const formatDate = (
  date: string | number | Date,
  format: 'short' | 'medium' | 'long' | 'time' | 'datetime' = 'medium'
): string => {
  // Uses 'en-ZA' locale for South African formatting
}
```

---

## 6. Data Migration Strategy

### 6.1 API-Ready Structure

#### Current Sample Data Pattern
```typescript
// Sample data with simulated API delay
export async function getVettingSetupData() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    checks: allVettingChecks,
    packages: vettingPackages,
    categories: Object.values(CheckCategory),
    entityTypes: Object.values(VettingEntityType)
  };
}
```

#### Migration Path
1. **Replace Function Calls**: Change from sample data imports to API calls
2. **Maintain Interface Contracts**: All TypeScript interfaces remain unchanged
3. **Add Error Handling**: Implement proper error boundaries
4. **Authentication**: Add JWT/API key authentication
5. **Caching**: Implement React Query or SWR for data fetching

### 6.2 Recommended API Endpoints

#### Core Vetting APIs
```
GET  /api/vetting/checks              # All available checks
GET  /api/vetting/packages            # Pre-configured packages
POST /api/vetting/cases               # Create new vetting case
GET  /api/vetting/cases               # List active cases
GET  /api/vetting/cases/{id}          # Get case details
PUT  /api/vetting/cases/{id}          # Update case
POST /api/vetting/cases/{id}/consent  # Manage consent
```

#### Supplier Management APIs
```
GET  /api/suppliers                   # List suppliers
POST /api/suppliers                   # Create supplier
GET  /api/suppliers/{id}              # Get supplier details
PUT  /api/suppliers/{id}              # Update supplier
GET  /api/suppliers/{id}/history      # Vetting history
```

#### Administrative APIs
```
GET  /api/projects                    # Mining projects
GET  /api/providers                   # Verification providers
GET  /api/reports                     # Completed reports
GET  /api/fieldops                    # Field operations data
```

---

## 7. Advanced Features & Intelligence

### 7.1 Smart Vetting Intelligence (`src/lib/vetting-intelligence.ts`)

#### Provider Performance Metrics
```typescript
export interface ProviderPerformanceMetrics {
  providerId: string;
  providerName: string;
  averageTurnaroundDays: number;
  successRate: number; // 0-100
  costEfficiency: number; // 0-100
  reliability: number; // 0-100
  overallScore: number; // 0-100
  totalCasesProcessed: number;
  recentPerformanceTrend: 'improving' | 'stable' | 'declining';
}
```

#### Intelligence Recommendations
```typescript
export interface IntelligenceRecommendation {
  id: string;
  type: 'package' | 'check' | 'optimization';
  title: string;
  description: string;
  confidence: number; // 0-100
  potentialSavings?: number;
  riskReduction?: number;
  reasonCode: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
```

### 7.2 Risk Assessment Engine

#### Risk Scoring
- **Individual Risk**: Credit, criminal, employment history
- **Company Risk**: Financial stability, compliance, operational
- **Medical Risk**: Health, substance, psychological fitness
- **Composite Scoring**: Weighted algorithm across categories

#### Cost Optimization
- **Package Discounts**: 5-20% savings on bundled checks
- **Provider Selection**: Performance-based recommendations
- **Timing Optimization**: Parallel processing suggestions

---

## 8. Field Operations & Geographic Data

### 8.1 Location-Based Services (`src/lib/sample-data/fieldOperationsSample.ts`)

#### Field Agent Management
```typescript
export interface FieldAgent {
  id: string;
  name: string;
  status: 'Online' | 'On-Task' | 'Offline';
  activeTasks: number;
  completionRate: number;
}
```

#### Location Verification
```typescript
export interface LocationVerificationTask {
  id: string;
  supplierName: string;
  address: string;
  status: 'Submitted' | 'In Progress' | 'Overdue' | 'Pending Assignment';
  geofenceZone: string;
  capturedGps?: { lat: number; lng: number };
  submittedPhotos?: string[];
  agentNotes?: string;
}
```

#### Community Outreach
```typescript
export interface CommunityMember {
  id: string;
  name: string;
  idNumber: string;
  address: string;
  skills: string[];
  vettingStatus: 'Verified' | 'Pending' | 'Not Started' | 'Flagged';
  dateAdded: string;
}
```

### 8.2 Geofencing & GPS Integration

#### Mining Area Geofences
- **Sibanye-Westonaria Zone**: Carletonville, Westonaria
- **Sibanye-Libanon Zone**: Libanon area operations
- **GPS Validation**: Coordinate verification for physical locations
- **Photo Evidence**: Geotagged verification photos

---

## 9. Data Quality & Validation

### 9.1 Validation Layer (`src/lib/utils/validation.ts`)

#### South African Specific Validations
- **SA ID Numbers**: Luhn algorithm, date validation, demographic extraction
- **Phone Numbers**: SA format (+27), mobile/landline detection
- **Postal Codes**: 4-digit validation (1000-9999)
- **Company Registration**: CIPC format validation
- **VAT Numbers**: 10-digit SARS format
- **Bank Accounts**: Format validation (8-11 digits)

#### Data Integrity Features
- **Real-time Validation**: Client-side immediate feedback
- **Server-side Verification**: API integration for authoritative sources
- **Error Messaging**: User-friendly South African context

### 9.2 Sample Data Realism

#### Individual Data
- **Names**: Authentic South African names (Thabo, Nomvula, Pieter)
- **ID Numbers**: Valid format with correct checksums
- **Addresses**: Real South African locations
- **Phone Numbers**: Proper SA mobile/landline formats

#### Company Data
- **Registration Numbers**: Valid CIPC format
- **VAT Numbers**: Proper SARS format
- **Industries**: Mining, logistics, catering, engineering
- **BEE Status**: Level 1-4, Non-Compliant, Pending

#### Geographic Accuracy
- **All 9 Provinces**: Representative data distribution
- **Mining Towns**: Westonaria, Carletonville, Rustenburg, etc.
- **GPS Coordinates**: Accurate latitude/longitude data
- **Regional Context**: Mining belt focus areas

---

## 10. Performance & Scalability Considerations

### 10.1 Data Loading Strategies

#### Sample Data Performance
- **Lazy Loading**: Chart data loaded on demand
- **Data Sampling**: Large datasets use sampling functions
- **Memoization**: Expensive calculations cached
- **Chunked Loading**: Large datasets split into manageable chunks

#### Migration Performance Planning
- **Pagination**: Built-in support for large datasets
- **Filtering**: Advanced filtering reduces data transfer
- **Caching Strategy**: Client-side caching for reference data
- **Real-time Updates**: WebSocket support for status changes

### 10.2 Data Structure Optimization

#### TypeScript Performance
- **Interface Inheritance**: Efficient type reuse
- **Union Types**: Flexible entity type handling
- **Generic Functions**: Reusable data manipulation
- **Tree Shaking**: Only required sample data loaded

#### Memory Management
- **Data Cleanup**: Automatic cleanup of large datasets
- **Selective Loading**: Load only required fields
- **Compression**: Large text fields compressed
- **Batch Processing**: Bulk operations optimized

---

## 11. Security & Compliance

### 11.1 Data Privacy

#### POPIA Compliance (South Africa)
- **Consent Management**: Explicit consent tracking
- **Data Minimization**: Only required data collected
- **Retention Policies**: Configurable data retention
- **Access Control**: Role-based data access

#### Sensitive Data Handling
- **PII Protection**: Personal information security
- **Medical Data**: Enhanced security for medical records
- **Financial Data**: Encrypted financial information
- **Criminal Records**: Restricted access controls

### 11.2 Audit Trail

#### Complete Tracking
```typescript
export interface VettingAuditEntry {
  id: string;
  caseId: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  checkId?: string;
  notes?: string;
  ipAddress?: string;
}
```

---

## 12. Integration Points

### 12.1 Third-Party Systems

#### Verification Providers
- **MIE (Managed Integrity Evaluation)**: Primary verification provider
- **XDS (Experian)**: Credit bureau integration
- **SARS**: Tax compliance verification
- **CIPC**: Company registration verification
- **SAPS AFIS**: Criminal record checks

#### Enterprise Systems
- **Coupa**: Supplier management integration
- **SAP**: ERP system connectivity
- **Internal Systems**: Custom verification workflows

### 12.2 API Integration Architecture

#### Authentication
- **JWT Tokens**: Secure API authentication
- **API Keys**: Provider-specific authentication
- **OAuth 2.0**: Third-party system integration
- **Role-based Access**: Granular permission control

#### Data Synchronization
- **Real-time Updates**: WebSocket connections
- **Batch Processing**: Scheduled data synchronization
- **Conflict Resolution**: Data consistency management
- **Fallback Strategies**: Offline capability planning

---

## 13. Conclusion

The VETTPRO Dashboard demonstrates a sophisticated, production-ready data architecture specifically designed for the South African vetting and verification market. Key strengths include:

### 13.1 Architecture Excellence
- **Type-Safe Design**: Comprehensive TypeScript interfaces
- **Scalable Structure**: Easy migration from sample to production data
- **South African Focus**: Deep understanding of local compliance requirements
- **Realistic Sample Data**: Over 20 sample data files with authentic scenarios

### 13.2 Business Value
- **Complete Coverage**: All aspects of SA business verification
- **Cost Optimization**: Package discounts and intelligent recommendations
- **Compliance Ready**: CIPC, SARS, BEE, and POPIA alignment
- **Mining Industry Focus**: Specialized medical and operational checks

### 13.3 Technical Readiness
- **API Migration Path**: Clear strategy for production deployment
- **Performance Optimized**: Efficient data loading and processing
- **Validation Layer**: Robust SA-specific business rule validation
- **Security Conscious**: Privacy and audit trail considerations

### 13.4 Migration Recommendations
1. **Phase 1**: Implement core vetting APIs with existing interfaces
2. **Phase 2**: Add real-time provider integrations (SARS, CIPC, MIE)
3. **Phase 3**: Enhanced intelligence and optimization features
4. **Phase 4**: Advanced analytics and AI-driven insights

The data architecture provides an excellent foundation for a production vetting system, with comprehensive coverage of South African business verification requirements and a clear path to full API integration.