// Executive Dashboard Components
export { default as RiskConcentrationMap } from './RiskConcentrationMap';
export { default as RiskPostureGauges } from './RiskPostureGauges';
export { default as ContextualDetailPanel } from './ContextualDetailPanel';
export { default as SupplierNetworkGraph } from './SupplierNetworkGraph';
export { default as StrategicEventFeed } from './StrategicEventFeed';

// Re-export types from sample data for convenience
export type {
  MineSite,
  ExecutiveSupplierInfo,
  Director,
  StrategicEvent,
  RiskPosture,
  RiskCategory,
  EventSeverity
} from '@/lib/sample-data/executive-dashboard-data';