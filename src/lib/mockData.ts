export type OpportunityCategory = 'land' | 'farm' | 'land_banking';

export interface BaseOpportunity {
  id: string;
  category: OpportunityCategory;
  title: string;
  slug: string;
  location: string;
  state: string;
  status: 'available' | 'sold_out' | 'coming_soon';
  cover_image: string;
}

export interface LandOpportunity extends BaseOpportunity {
  category: 'land';
  land_size: string;
  price: number;
  documentation_status: string;
}

export interface FarmOpportunity extends BaseOpportunity {
  category: 'farm';
  crop: string;
  cycle_months: number;
  slot_price: number;
  target_return_percentage: number;
}

export interface LandBankingOpportunity extends BaseOpportunity {
  category: 'land_banking';
  acquisition_price: number;
  holding_period_months: number;
  stated_exit_value: number;
  land_size: string;
}

export type Opportunity = LandOpportunity | FarmOpportunity | LandBankingOpportunity;

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    category: 'land',
    title: '60 × 120 Plot',
    slug: 'abeokuta-60x120',
    location: 'Abeokuta',
    state: 'Ogun',
    status: 'available',
    cover_image: 'https://miro.medium.com/1%2AUdsTTEukqmn2iYn9w6PoYA.jpeg',
    land_size: '60 × 120 FT',
    price: 500000,
    documentation_status: 'Verified'
  },
  {
    id: '2',
    category: 'farm',
    title: 'Pepper Cycle',
    slug: 'pepper-cycle-ogun',
    location: 'Ogun State',
    state: 'Ogun',
    status: 'available',
    cover_image: 'https://images.unsplash.com/photo-1608737637507-9aaeb9f4bf30?auto=format&fit=crop&fm=jpg&q=85&w=1200',
    crop: 'PEPPER',
    cycle_months: 4,
    slot_price: 100000,
    target_return_percentage: 25
  },
  {
    id: '3',
    category: 'farm',
    title: 'Tomato Farm',
    slug: 'tomato-cycle-kaduna',
    location: 'Kaduna State',
    state: 'Kaduna',
    status: 'available',
    cover_image: 'https://images.unsplash.com/photo-1723234870945-c4c4a9e2c683?auto=format&fit=crop&fm=jpg&q=90&w=1400',
    crop: 'TOMATO',
    cycle_months: 5,
    slot_price: 100000,
    target_return_percentage: 30
  },
  {
    id: '4',
    category: 'land_banking',
    title: 'Abeokuta Land Banking',
    slug: 'abeokuta-land-banking',
    location: 'Abeokuta',
    state: 'Ogun',
    status: 'available',
    cover_image: 'https://www.climatechangeauthority.gov.au/sites/default/files/istock-1329114139.jpg',
    acquisition_price: 1000000,
    holding_period_months: 12,
    stated_exit_value: 1400000,
    land_size: '60 × 120 FT'
  },
  {
    id: '5',
    category: 'land',
    title: '1 Acre Farmland',
    slug: '1-acre-ogun',
    location: 'Ogun State',
    state: 'Ogun',
    status: 'available',
    cover_image: 'https://miro.medium.com/1%2AUdsTTEukqmn2iYn9w6PoYA.jpeg',
    land_size: '1 ACRE',
    price: 5000000,
    documentation_status: 'Verified'
  },
  {
    id: '6',
    category: 'farm',
    title: 'Cassava Farm',
    slug: 'cassava-cycle-ogun',
    location: 'Ogun State',
    state: 'Ogun',
    status: 'available',
    cover_image: 'https://images.unsplash.com/photo-1757283961570-682154747d9c?auto=format&fit=crop&fm=jpg&q=90&w=1400',
    crop: 'CASSAVA',
    cycle_months: 6,
    slot_price: 100000,
    target_return_percentage: 35
  }
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

export interface Holding {
  id: string;
  opportunity_id: string;
  type: OpportunityCategory;
  title: string;
  location: string;
  status: 'active' | 'completed' | 'pending';
  total_amount: number;
  acquisition_date: string;
  maturity_date?: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export const mockHoldings: Holding[] = [
  {
    id: 'h1',
    opportunity_id: '1',
    type: 'land',
    title: '60 × 120 Plot',
    location: 'Abeokuta, Ogun',
    status: 'active',
    total_amount: 500000,
    acquisition_date: '2025-02-15',
    metrics: [
      { label: 'Size', value: '60 × 120 FT' },
      { label: 'Documentation', value: 'Verified' }
    ]
  },
  {
    id: 'h2',
    opportunity_id: '2',
    type: 'farm',
    title: 'Pepper Cycle',
    location: 'Ogun State',
    status: 'active',
    total_amount: 100000,
    acquisition_date: '2025-08-01',
    maturity_date: '2025-12-01',
    metrics: [
      { label: 'Cycle', value: '4 Months' },
      { label: 'Target Return', value: '25%' }
    ]
  },
  {
    id: 'h3',
    opportunity_id: '4',
    type: 'land_banking',
    title: 'Abeokuta Land Banking',
    location: 'Ogun State',
    status: 'pending',
    total_amount: 1000000,
    acquisition_date: '2025-09-10',
    maturity_date: '2026-09-10',
    metrics: [
      { label: 'Term', value: '12 Months' },
      { label: 'Exit Value', value: '₦1,400,000' }
    ]
  }
];

export interface Notification {
  id: string;
  type: 'payment' | 'farm_update' | 'document';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'farm_update',
    title: 'Farm Update: Pepper Cycle',
    message: 'Week 4 planting phase has been completed successfully.',
    date: '2 hrs ago',
    read: false
  },
  {
    id: 'n2',
    type: 'payment',
    title: 'Installment Due',
    message: 'Your next installment of ₦100,000 is due on Sept 28.',
    date: '1 day ago',
    read: false
  }
];

export interface Transaction {
  id: string;
  opportunity_id: string;
  opportunity_title: string;
  type: 'purchase' | 'installment' | 'payout';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  reference: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    opportunity_id: '1',
    opportunity_title: '60 × 120 Plot, Abeokuta',
    type: 'purchase',
    amount: 500000,
    status: 'success',
    date: '2025-02-15',
    reference: 'REF-GT-001'
  },
  {
    id: 't2',
    opportunity_id: '2',
    opportunity_title: 'Pepper Cycle',
    type: 'purchase',
    amount: 100000,
    status: 'success',
    date: '2025-08-01',
    reference: 'REF-GT-002'
  },
  {
    id: 't3',
    opportunity_id: '4',
    opportunity_title: 'Abeokuta Land Banking',
    type: 'installment',
    amount: 250000,
    status: 'pending',
    date: '2025-09-10',
    reference: 'REF-GT-003'
  }
];

// --- Phase 9 Additions ---

export const mockWallet = {
  balance: 450000,
  history: [
    { id: '1', date: '2025-10-20T10:00:00Z', type: 'deposit', amount: 500000, status: 'success', ref: 'DEP-99X2' },
    { id: '2', date: '2025-10-25T14:30:00Z', type: 'withdrawal', amount: 50000, status: 'success', ref: 'WTH-44M1' }
  ]
};

export const mockAnnouncements = [
  { 
    id: '1', 
    title: 'New Pepper Farm Cycle Opening Soon!', 
    message: 'We are launching a new 6-month pepper farming cycle next week with a projected 25% ROI. Fund your wallet now to secure your spot.', 
    isActive: true, 
    type: 'promo' // promo, alert, info
  }
];

export const mockAdminNotifications = [
  { id: '1', title: 'New Wallet Deposit', message: 'Emeka Abraham deposited ₦500,000.', time: '10m ago', unread: true },
  { id: '2', title: 'Pending KYC', message: 'David Smith submitted KYC documents for review.', time: '1h ago', unread: true }
];
