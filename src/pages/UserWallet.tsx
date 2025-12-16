import React, { useEffect, useState } from 'react';
import { Scan, Wallet, Send, Download, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { supabase, Transaction } from '../lib/supabase';

interface UserWalletProps {
  onNavigate: (page: string, data?: any) => void;
}

export const UserWallet: React.FC<UserWalletProps> = ({ onNavigate }) => {
  const [usdtBalance, setUsdtBalance] = useState(500.00);
  const [usdcBalance, setUsdcBalance] = useState(1250.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [displayBalance, setDisplayBalance] = useState(1750.00);

  useEffect(() => {
    loadRecentTransactions();

    const initialBalance = 1750.00;
    const dailyRate = 0.048 / 365;
    const incrementPerSecond = (initialBalance * dailyRate) / 86400;

    const balanceTimer = setInterval(() => {
      setDisplayBalance(prev => prev + incrementPerSecond);
    }, 1000);

    return () => clearInterval(balanceTimer);
  }, []);

  const loadRecentTransactions = async () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'demo-user',
        merchant_id: 'm1',
        amount: 5.80,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'Starbucks Coffee',
        description: 'Coffee purchase',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        user_id: 'demo-user',
        merchant_id: 'm2',
        amount: 12.50,
        currency: 'USDC',
        status: 'completed',
        merchant_name: '7-Eleven',
        description: 'Convenience store',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        user_id: 'demo-user',
        merchant_id: 'm3',
        amount: 28.99,
        currency: 'USDT',
        status: 'completed',
        merchant_name: 'Whole Foods Market',
        description: 'Grocery shopping',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setTransactions(mockTransactions);
  };

  const totalUSD = usdtBalance + usdcBalance;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 pt-12 pb-32 px-6 rounded-b-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white text-2xl font-bold">Wallet</h1>
            <Wallet className="text-white w-8 h-8" />
          </div>

          <Card gradient className="backdrop-blur-sm bg-white/10 border border-white/20">
            <div className="text-white/80 text-sm mb-2">Total Balance</div>
            <div className="text-white text-5xl font-bold mb-3">
              ${displayBalance.toFixed(6)}
            </div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-semibold">
                Current APY: 4.8%
              </span>
              <Zap className="w-4 h-4 text-yellow-300 ml-auto animate-pulse" />
            </div>
            <div className="flex gap-4 text-white/90 text-sm mb-3">
              <div>
                <span className="text-white/70">USDT: </span>
                <span className="font-semibold">${usdtBalance.toFixed(2)}</span>
              </div>
              <div className="text-white/40">|</div>
              <div>
                <span className="text-white/70">USDC: </span>
                <span className="font-semibold">${usdcBalance.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-xs text-emerald-200 flex items-center gap-1">
              <span>Daily Interest: +${((totalUSD * 0.048) / 365).toFixed(4)}</span>
            </div>
          </Card>
        </div>

        <div className="px-6 -mt-20 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('payment-confirm', {
                merchantName: 'Demo Store',
                amount: 25.00,
                currency: 'USDC',
                requestId: `REQ${Date.now()}`,
              })}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Scan & Pay</span>
            </button>

            <button className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Pay</span>
            </button>

            <button className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Send</span>
            </button>

            <button className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Receive</span>
            </button>
          </div>
        </div>

        <div className="px-6 mb-6">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-emerald-700 font-medium mb-1">
                  Your assets are earning interest
                </div>
                <div className="text-xs text-emerald-600">
                  Backed by RWA US Treasury yields
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                4.8%
              </div>
            </div>
          </Card>
        </div>

        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-xl">{tx.merchant_name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{tx.merchant_name}</div>
                    <div className="text-xs text-gray-500">{formatTime(tx.created_at)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">-${tx.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{tx.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-md mx-auto flex justify-around">
            <button className="flex flex-col items-center gap-1">
              <Wallet className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Wallet</span>
            </button>
            <button
              onClick={() => onNavigate('merchant-pos')}
              className="flex flex-col items-center gap-1"
            >
              <Scan className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Merchant</span>
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="flex flex-col items-center gap-1"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
