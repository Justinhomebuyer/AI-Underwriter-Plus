import { CompsResponse, PropertyDossier, RehabResponse } from '@/lib/types';

export const dossier: PropertyDossier = {
  subjectId: 'JUSTIN-123',
  owner: 'Justin Homebuyer',
  mailingAddress: '218 Market St, Philadelphia, PA',
  assessor: {
    gla: 1820,
    lot: 4356,
    built: 1954,
    landUse: 'Single Family'
  },
  liens: [
    { type: 'Municipal Lien', amount: 8200, priority: 1 },
    { type: 'Water/Sewer', amount: 1200, priority: 2 }
  ],
  mortgages: [{ lender: 'Liberty Bank', balance: 196000, rate: 4.75 }],
  taxes: { annual: 4600, delinquent: false },
  openPermits: [
    { id: 'PRM-3191', summary: 'Roof repair', status: 'Closed' },
    { id: 'PRM-4480', summary: 'Porch replacement', status: 'Open' }
  ]
};

export const comps: CompsResponse = {
  subjectId: dossier.subjectId,
  strict: [
    {
      id: 'COMP-101',
      address: '701 Pine St',
      price: 412000,
      distanceMiles: 0.42,
      dom: 5,
      saleDate: '2024-10-12',
      gla: 1780,
      lot: 4100,
      exterior: 'Brick',
      schoolDistrict: 'Philly East',
      rehabLevel: 'Lite',
      mode: 'strict',
      inclusionReasons: ['Same school district', 'Distance < 0.5 mi', 'GLA delta 2%'],
      exclusionReasons: [],
      adjustments: [
        { category: 'GLA', value: 3500, reason: 'Subject is 40 sqft larger' },
        { category: 'Lot', value: -1200, reason: 'Smaller lot' },
        { category: 'Exterior', value: 0, reason: 'Brick parity met' },
        { category: 'Location', value: 0, reason: 'Same block grid' },
        { category: 'Condition', value: -6000, reason: 'Comp superior interior' },
        { category: 'Time', value: 1500, reason: 'Closed 4 months ago' },
        { category: 'Rehab Delta', value: 7500, reason: 'Lite vs Subject Mid scope' }
      ]
    },
    {
      id: 'COMP-102',
      address: '917 Federal St',
      price: 398500,
      distanceMiles: 1.3,
      dom: 8,
      saleDate: '2024-08-03',
      gla: 1900,
      lot: 4400,
      exterior: 'Brick',
      schoolDistrict: 'Philly East',
      rehabLevel: 'Mid',
      mode: 'strict',
      inclusionReasons: ['GLA within 4%', 'Closed < 6 months'],
      exclusionReasons: ['On arterial road', 'Across Washington Ave boundary'],
      adjustments: [
        { category: 'GLA', value: -2000, reason: 'Comp larger by 80 sqft' },
        { category: 'Lot', value: 500, reason: 'Lot parity nearly even' },
        { category: 'Exterior', value: 0, reason: 'Brick parity met' },
        { category: 'Location', value: -4500, reason: 'Faces Washington Ave arterial' },
        { category: 'Condition', value: 2500, reason: 'Similar finish' },
        { category: 'Time', value: 2300, reason: 'Closed 6 months ago (penalized)' },
        { category: 'Rehab Delta', value: 2500, reason: 'Normalize to Mid finish' }
      ]
    }
  ],
  smartFallback: [
    {
      id: 'COMP-201',
      address: '1409 Kater St',
      price: 360000,
      distanceMiles: 1.7,
      dom: 14,
      saleDate: '2024-05-21',
      gla: 2005,
      lot: 3900,
      exterior: 'Siding',
      schoolDistrict: 'Philly South',
      rehabLevel: 'Full',
      mode: 'smart',
      inclusionReasons: ['Expanded time horizon 12 months'],
      exclusionReasons: ['Different school district (penalty)', 'Non-brick exterior'],
      adjustments: [
        { category: 'GLA', value: -5500, reason: 'Comp 180 sqft larger' },
        { category: 'Lot', value: 2200, reason: 'Subject larger lot' },
        { category: 'Exterior', value: 12000, reason: 'Upgrade siding to brick feel' },
        { category: 'Location', value: -6500, reason: 'South district penalty' },
        { category: 'Condition', value: -8500, reason: 'Full gut vs Mid finish' },
        { category: 'Time', value: 4200, reason: 'Closed 11 months ago' },
        { category: 'Rehab Delta', value: 15000, reason: 'Normalize to target finish' }
      ]
    }
  ]
};

export const rehab: RehabResponse = {
  subjectId: dossier.subjectId,
  scope: 'Mid',
  low: 48000,
  likely: 58500,
  high: 71200,
  contingencyPct: 0.1,
  lineItems: [
    { item: 'Roof tear-off', scope: 'Full', low: 9000, likely: 10500, high: 12500 },
    { item: 'HVAC replacement', scope: 'Mid', low: 6500, likely: 7200, high: 8900 },
    { item: 'Electrical upgrade', scope: 'Mid', low: 4800, likely: 5200, high: 6100 },
    { item: 'Windows', scope: 'Lite', low: 3600, likely: 4200, high: 5000 },
    { item: 'Kitchen + baths', scope: 'Mid', low: 15000, likely: 18000, high: 21500 }
  ]
};
