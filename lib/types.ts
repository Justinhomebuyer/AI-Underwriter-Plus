export type PropertyDossier = {
  subjectId: string;
  owner: string;
  mailingAddress: string;
  assessor: {
    gla: number;
    lot: number;
    built: number;
    landUse: string;
  };
  liens: Array<{ type: string; amount: number; priority: number }>;
  mortgages: Array<{ lender: string; balance: number; rate: number }>;
  taxes: { annual: number; delinquent: boolean };
  openPermits: Array<{ id: string; summary: string; status: string }>;
};

export type CompAdjustment = {
  category: 'GLA' | 'Lot' | 'Exterior' | 'Location' | 'Condition' | 'Time' | 'Rehab Delta';
  value: number;
  reason: string;
};

export type CompRecord = {
  id: string;
  address: string;
  price: number;
  distanceMiles: number;
  dom: number;
  saleDate: string;
  gla: number;
  lot: number;
  exterior: 'Brick' | 'Siding' | 'Stucco';
  schoolDistrict: string;
  rehabLevel: 'Lite' | 'Mid' | 'Full';
  mode: 'strict' | 'smart';
  inclusionReasons: string[];
  exclusionReasons: string[];
  adjustments: CompAdjustment[];
};

export type CompsResponse = {
  subjectId: string;
  strict: CompRecord[];
  smartFallback: CompRecord[];
};

export type RehabLineItem = {
  item: string;
  scope: 'Lite' | 'Mid' | 'Full';
  low: number;
  likely: number;
  high: number;
};

export type RehabResponse = {
  subjectId: string;
  scope: 'Lite' | 'Mid' | 'Full';
  low: number;
  likely: number;
  high: number;
  contingencyPct: number;
  lineItems: RehabLineItem[];
};
