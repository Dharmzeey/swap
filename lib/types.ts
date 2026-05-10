export interface IphoneSeries {
  id: number;
  name: string;
  order: number;
}

export interface IphoneModel {
  id: number;
  name: string;
  slug: string;
  variant_type: string;
  order: number;
}

export interface StorageVariant {
  id: number;
  capacity: string;
  base_value_ngn: number;
}

export interface DefectType {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: "damage" | "functional" | "replaced_part";
  default_deduction_pct: number;
  applies_to_view: "front" | "back" | "both";
  order: number;
}

export interface RepairBreakdownItem {
  defect: string;
  deduction_pct: number;
  repair_cost_ngn: number;
}

export interface EstimateResponse {
  from_device: string;
  from_base_value_ngn: number;
  from_value_ngn: number;
  to_device: string;
  to_value_ngn: number;
  repair_breakdown: RepairBreakdownItem[];
  total_repair_cost_ngn: number;
  service_fee_ngn: number;
  net_ngn: number;
  direction: "upgrade" | "downgrade" | "even";
  defects_applied: string[];
}

// UI state
export interface ConfigState {
  seriesId: number | null;
  modelId: number | null;
  storageId: number | null;
  defectIds: number[];
  defectsCommitted: boolean;
}

export interface HistoryEntry {
  fromText: string;
  toText: string;
  amountText: string;
  fromConfig: ConfigState;
  toConfig: ConfigState;
  ts: number;
}
