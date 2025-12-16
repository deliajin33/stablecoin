import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  phone: string;
  name: string;
  usdt_balance: number;
  usdc_balance: number;
  created_at: string;
  updated_at: string;
};

export type Merchant = {
  id: string;
  name: string;
  phone: string;
  usdt_balance: number;
  usdc_balance: number;
  status: 'active' | 'suspended' | 'closed';
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  merchant_id: string;
  amount: number;
  currency: 'USDT' | 'USDC';
  status: 'pending' | 'completed' | 'failed';
  merchant_name: string;
  description: string;
  created_at: string;
};

export type PaymentRequest = {
  id: string;
  merchant_id: string;
  amount: number;
  currency: 'USDT' | 'USDC';
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  transaction_id: string | null;
  expires_at: string;
  created_at: string;
};
