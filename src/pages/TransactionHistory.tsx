import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Filter, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../components/Card';
import { Transaction } from '../lib/supabase';

interface TransactionHistoryProps {
  onNavigate: (page: string, data?: any) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType]);

  const loadAllTransactions = async () => {
    setIsLoading(true);

    // 模拟更多交易数据
    const allTransactions: Transaction[] = [
      // 收入记录
      {
        id: '1',
        user_id: 'demo-user',
        merchant_id: null,
        amount: 100.00,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'John Doe',
        description: 'Transfer from friend',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'income'
      },
      {
        id: '2',
        user_id: 'demo-user',
        merchant_id: null,
        amount: 50.00,
        currency: 'USDT',
        status: 'completed',
        merchant_name: 'Jane Smith',
        description: 'Birthday gift',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'income'
      },
      // 支出记录
      {
        id: '3',
        user_id: 'demo-user',
        merchant_id: 'm1',
        amount: 5.80,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'Starbucks Coffee',
        description: 'Coffee purchase',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '4',
        user_id: 'demo-user',
        merchant_id: 'm2',
        amount: 12.50,
        currency: 'USDC',
        status: 'completed',
        merchant_name: '7-Eleven',
        description: 'Convenience store',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '5',
        user_id: 'demo-user',
        merchant_id: 'm3',
        amount: 28.99,
        currency: 'USDT',
        status: 'completed',
        merchant_name: 'Whole Foods Market',
        description: 'Grocery shopping',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '6',
        user_id: 'demo-user',
        merchant_id: 'm4',
        amount: 45.00,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'Amazon',
        description: 'Online shopping',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '7',
        user_id: 'demo-user',
        merchant_id: 'm5',
        amount: 15.75,
        currency: 'USDT',
        status: 'completed',
        merchant_name: 'Subway',
        description: 'Lunch',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '8',
        user_id: 'demo-user',
        merchant_id: null,
        amount: 200.00,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'Mike Johnson',
        description: 'Freelance payment',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'income'
      },
      {
        id: '9',
        user_id: 'demo-user',
        merchant_id: 'm6',
        amount: 89.99,
        currency: 'USDT',
        status: 'completed',
        merchant_name: 'Netflix',
        description: 'Monthly subscription',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'expense'
      },
      {
        id: '10',
        user_id: 'demo-user',
        merchant_id: null,
        amount: 75.00,
        currency: 'USDC',
        status: 'completed',
        merchant_name: 'Sarah Wilson',
        description: 'Dinner split',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'income'
      }
    ];

    setTransactions(allTransactions);
    setIsLoading(false);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // 按类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.currency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 24 * 7) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const calculateStats = () => {
    const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    return { income, expense, net: income - expense };
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Merchant', 'Description', 'Amount', 'Currency', 'Status'],
      ...filteredTransactions.map(tx => [
        new Date(tx.created_at).toLocaleDateString(),
        tx.type || 'expense',
        tx.merchant_name,
        tx.description,
        tx.amount.toString(),
        tx.currency,
        tx.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 pt-12 pb-6 px-6">
          <button
            onClick={() => onNavigate('user-wallet')}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Wallet</span>
          </button>
          <h1 className="text-white text-2xl font-bold mb-2">Transaction History</h1>
          <p className="text-white/80 text-sm">
            {filteredTransactions.length} transactions found
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="px-6 -mt-3 mb-6">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-emerald-600 mb-1">Income</div>
                <div className="text-lg font-bold text-emerald-700">
                  +${stats.income.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-red-600 mb-1">Expense</div>
                <div className="text-lg font-bold text-red-700">
                  -${stats.expense.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-600 mb-1">Net</div>
                <div className={`text-lg font-bold ${stats.net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {stats.net >= 0 ? '+' : ''}${stats.net.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <div className="px-6 mb-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  filterType === 'income'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  filterType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Expense
              </button>
            </div>

            <button
              onClick={exportTransactions}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* 交易列表 */}
        <div className="px-6">
          {filteredTransactions.length === 0 ? (
            <Card className="text-center py-8">
              <div className="text-gray-500">No transactions found</div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-gradient-to-br from-emerald-100 to-teal-200'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        {tx.type === 'income' ? (
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{tx.merchant_name}</div>
                        <div className="text-xs text-gray-500">{tx.description}</div>
                        <div className="text-xs text-gray-400">{formatTime(tx.created_at)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-800'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{tx.currency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};