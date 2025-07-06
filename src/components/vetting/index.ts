/**
 * Vetting Components Export Index
 * 
 * Central export point for all vetting-related components including
 * the new Provider Intelligence system components.
 */

// Core vetting components
export { InitiateVettingForm } from './InitiateVettingForm';
export { default as ActiveVettingCasesDemo } from './ActiveVettingCasesDemo';
export { default as ActiveCasesTable } from './ActiveCasesTable';
export { default as CheckProgressIndicator } from './CheckProgressIndicator';
export { default as IndividualChecksList } from './IndividualChecksList';
export { default as ScheduledChecksClient } from './ScheduledChecksClient';
export { default as ConsentFootprint } from './ConsentFootprint';
export { default as SummaryPanel } from './SummaryPanel';

// Provider Intelligence System (Phase 1)
export { default as ProviderIntelligenceCard } from './ProviderIntelligenceCard';
export { default as AISmartSuggestion } from './AISmartSuggestion';
export { default as ProviderIntelligenceDemo } from './ProviderIntelligenceDemo';

// Smart Canvas components
export * from './smart-canvas';

// Types and interfaces
export type { ProviderMetrics, ProviderIntelligenceCardProps } from './ProviderIntelligenceCard';
export type { SmartSuggestion, AISmartSuggestionProps } from './AISmartSuggestion';