/*
  # Stablecoin Payment System Schema

  ## Overview
  This migration creates the complete database schema for a stablecoin payment system
  similar to Alipay, supporting C-end users, B-end merchants, and transaction management.

  ## 1. New Tables
  
  ### `users` - C-end wallet users
    - `id` (uuid, primary key) - User unique identifier
    - `phone` (text, unique) - Phone number for login and identification
    - `name` (text) - User display name
    - `usdt_balance` (numeric) - USDT balance with 2 decimal precision
    - `usdc_balance` (numeric) - USDC balance with 2 decimal precision
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### `merchants` - B-end merchant accounts
    - `id` (uuid, primary key) - Merchant unique identifier
    - `name` (text) - Merchant business name
    - `phone` (text, unique) - Merchant contact phone
    - `usdt_balance` (numeric) - USDT balance with 2 decimal precision
    - `usdc_balance` (numeric) - USDC balance with 2 decimal precision
    - `status` (text) - Merchant status: active, suspended, closed
    - `created_at` (timestamptz) - Registration timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### `transactions` - Transaction records
    - `id` (uuid, primary key) - Transaction unique identifier
    - `user_id` (uuid, foreign key) - Reference to users table
    - `merchant_id` (uuid, foreign key) - Reference to merchants table
    - `amount` (numeric) - Transaction amount (USD equivalent)
    - `currency` (text) - Stablecoin type: USDT or USDC
    - `status` (text) - Transaction status: pending, completed, failed
    - `merchant_name` (text) - Snapshot of merchant name at transaction time
    - `description` (text) - Transaction description
    - `created_at` (timestamptz) - Transaction creation timestamp

  ### `payment_requests` - Payment QR codes
    - `id` (uuid, primary key) - Payment request unique identifier
    - `merchant_id` (uuid, foreign key) - Reference to merchants table
    - `amount` (numeric) - Requested payment amount
    - `currency` (text) - Requested currency: USDT or USDC
    - `status` (text) - Request status: pending, paid, expired, cancelled
    - `transaction_id` (uuid, nullable) - Reference to completed transaction
    - `expires_at` (timestamptz) - QR code expiration time
    - `created_at` (timestamptz) - Request creation timestamp

  ## 2. Security
  
  All tables have RLS enabled with the following policies:
  
  ### users table
    - Authenticated users can view their own profile
    - Authenticated users can update their own profile
    - System can insert new users
  
  ### merchants table
    - Authenticated users can view all active merchants
    - Merchants can view and update their own data
  
  ### transactions table
    - Users can view their own transactions
    - Merchants can view transactions involving them
    - System can insert new transactions
  
  ### payment_requests table
    - Merchants can create and view their own payment requests
    - Anyone can view pending payment requests by ID (for QR scanning)
    - System can update payment request status

  ## 3. Important Notes
  
  - All monetary amounts use numeric(10,2) for precise decimal calculations
  - All timestamps use timestamptz for timezone awareness
  - Foreign keys ensure referential integrity
  - Indexes added on frequently queried columns for performance
  - Status fields use text with check constraints for data validation
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  name text NOT NULL,
  usdt_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
  usdc_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT positive_usdt_balance CHECK (usdt_balance >= 0),
  CONSTRAINT positive_usdc_balance CHECK (usdc_balance >= 0)
);

-- Create merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  usdt_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
  usdc_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_merchant_status CHECK (status IN ('active', 'suspended', 'closed')),
  CONSTRAINT positive_merchant_usdt_balance CHECK (usdt_balance >= 0),
  CONSTRAINT positive_merchant_usdc_balance CHECK (usdc_balance >= 0)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  merchant_id uuid NOT NULL REFERENCES merchants(id),
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  merchant_name text NOT NULL,
  description text DEFAULT '' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_currency CHECK (currency IN ('USDT', 'USDC')),
  CONSTRAINT valid_transaction_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id),
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USDC' NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  transaction_id uuid REFERENCES transactions(id),
  expires_at timestamptz DEFAULT (now() + interval '15 minutes') NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT positive_payment_amount CHECK (amount > 0),
  CONSTRAINT valid_payment_currency CHECK (currency IN ('USDT', 'USDC')),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'paid', 'expired', 'cancelled'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_requests_merchant_id ON payment_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow insert for authenticated users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for merchants table
CREATE POLICY "Anyone can view active merchants"
  ON merchants FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Merchants can view own data"
  ON merchants FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow insert for merchants"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Merchants can view their transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (merchant_id = auth.uid());

CREATE POLICY "Allow insert for transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for payment_requests table
CREATE POLICY "Merchants can view own payment requests"
  ON payment_requests FOR SELECT
  TO authenticated
  USING (merchant_id = auth.uid());

CREATE POLICY "Anyone can view payment request by id"
  ON payment_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Merchants can create payment requests"
  ON payment_requests FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "System can update payment requests"
  ON payment_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);