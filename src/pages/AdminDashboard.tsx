import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Store, DollarSign, Activity, Home, Shield, Fuel, ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';

interface AdminDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface DashboardStats {
  todayVolume: number;
  activeMerchants: number;
  activeUsers: number;
  totalTransactions: number;
  usdtPool: number;
  usdcPool: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    todayVolume: 0,
    activeMerchants: 0,
    activeUsers: 0,
    totalTransactions: 0,
    usdtPool: 0,
    usdcPool: 0,
  });

  const [animatedVolume, setAnimatedVolume] = useState(0);

  useEffect(() => {
    const mockStats: DashboardStats = {
      todayVolume: 127548.32,
      activeMerchants: 248,
      activeUsers: 3892,
      totalTransactions: 1547,
      usdtPool: 2500000,
      usdcPool: 3750000,
    };

    setStats(mockStats);

    let current = 0;
    const target = mockStats.todayVolume;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedVolume(current);
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const recentTransactions = [
    { id: '1', merchant: 'Starbucks Coffee', amount: 25.50, time: '2 mins ago', status: 'completed' },
    { id: '2', merchant: 'Whole Foods Market', amount: 87.20, time: '5 mins ago', status: 'completed' },
    { id: '3', merchant: 'Apple Store', amount: 1299.00, time: '8 mins ago', status: 'completed' },
    { id: '4', merchant: 'Amazon', amount: 45.99, time: '12 mins ago', status: 'completed' },
    { id: '5', merchant: 'Target', amount: 156.75, time: '15 mins ago', status: 'completed' },
  ];

  const poolPercentage = (stats.usdtPool / (stats.usdtPool + stats.usdcPool)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-blue-300">Real-time payment system overview</p>
          </div>
          <button
            onClick={() => onNavigate('wallet')}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="mb-8">
          <Card gradient className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-sm">Today's Transaction Volume</div>
                  <div className="text-white text-5xl font-bold">
                    ${animatedVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>{stats.totalTransactions} transactions today</span>
                </div>
                <div className="text-emerald-300 font-semibold">↑ 23.5%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Live</div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">Active Users</div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Live</div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.activeMerchants}</div>
            <div className="text-emerald-100 text-sm">Active Merchants</div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">24h</div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.totalTransactions}</div>
            <div className="text-amber-100 text-sm">Total Transactions</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Liquidity Pool Status
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 font-medium">Total Value Locked (TVL)</span>
                  <span className="text-2xl font-bold text-gray-800">
                    ${((stats.usdtPool + stats.usdcPool) / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000"
                    style={{ width: `${poolPercentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-600">USDT: ${(stats.usdtPool / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">USDC: ${(stats.usdcPool / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${(stats.usdtPool / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600 mt-1">USDT Pool</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    ${(stats.usdcPool / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600 mt-1">USDC Pool</div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Transactions
            </h3>

            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{tx.merchant}</div>
                      <div className="text-xs text-gray-500">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900">Proof of Reserves</h3>
                <p className="text-sm text-emerald-600">Real-time solvency verification</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total User Deposits</span>
                  <span className="text-2xl font-bold text-gray-800">$6.25M</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">On-chain Reserves</span>
                  <span className="text-2xl font-bold text-emerald-600">$6.25M</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-2 bg-emerald-100 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">100% Backed</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-emerald-800 mb-2">Reserve Wallet Addresses:</div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <code className="text-xs font-mono text-gray-700">0x742d...8f2a</code>
                  <button className="text-emerald-600 hover:text-emerald-700">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <code className="text-xs font-mono text-gray-700">0x9a3c...d4e1</code>
                  <button className="text-emerald-600 hover:text-emerald-700">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-emerald-700 italic">
                All reserves are publicly verifiable on-chain
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">Gas Station Monitor</h3>
                <p className="text-sm text-blue-600">Gasless payment subsidy pool</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Gas Subsidy Pool</span>
                  <span className="text-2xl font-bold text-blue-600">$48.5K</span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Pool Health</span>
                    <span className="text-emerald-600 font-semibold">Excellent</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[85%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600">Today's Usage</div>
                    <div className="text-lg font-bold text-blue-600">$127</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600">Avg per TX</div>
                    <div className="text-lg font-bold text-blue-600">$0.08</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl">
                <div className="text-sm font-semibold text-gray-700 mb-3">Network Status</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Gas Price</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-800">15 Gwei</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
                      Low
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-blue-700 italic">
                Automatically replenished when balance drops below $10K
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">System Performance</h3>
              <p className="text-gray-600">All systems operational</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Healthy
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
