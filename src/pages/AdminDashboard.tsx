import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, Users, Store, DollarSign, Activity, Home, Shield, Fuel, ExternalLink, RefreshCw, AlertTriangle, CheckCircle, Eye, Download, Play, Pause, Settings } from 'lucide-react';
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

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
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
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [selectedPool, setSelectedPool] = useState<'usdt' | 'usdc' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gasPrice, setGasPrice] = useState(15);
  const [poolHealth, setPoolHealth] = useState(85);

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

  const generateInitialTransactions = (): Transaction[] => [
    { id: '1', merchant: 'Starbucks Coffee', amount: 25.50, time: '2 mins ago', status: 'completed', hash: '0x7f9a...2b3c' },
    { id: '2', merchant: 'Whole Foods Market', amount: 87.20, time: '5 mins ago', status: 'completed', hash: '0x2e1d...8f5a' },
    { id: '3', merchant: 'Apple Store', amount: 1299.00, time: '8 mins ago', status: 'completed', hash: '0x9c4b...1d7e' },
    { id: '4', merchant: 'Amazon', amount: 45.99, time: '12 mins ago', status: 'pending', hash: '0x5a8e...3f2c' },
    { id: '5', merchant: 'Target', amount: 156.75, time: '15 mins ago', status: 'completed', hash: '0x1f6d...9b4e' },
  ];

  const generateInitialAlerts = (): SystemAlert[] => [
    {
      id: '1',
      type: 'warning',
      title: 'High Transaction Volume',
      message: 'Transaction volume 45% above daily average',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Gas Price Update',
      message: 'Gas prices decreased by 20%',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: '3',
      type: 'error',
      title: 'Merchant API Alert',
      message: 'Starbucks API latency detected',
      timestamp: '2 hours ago',
      read: true
    }
  ];

  const poolPercentage = (stats.usdtPool / (stats.usdtPool + stats.usdcPool)) * 100;

  // Initialize data
  useEffect(() => {
    setTransactions(generateInitialTransactions());
    setAlerts(generateInitialAlerts());
  }, []);

  // Live data simulation
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Update stats with random variations
      setStats(prev => ({
        ...prev,
        todayVolume: prev.todayVolume + (Math.random() * 100 - 30),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 3),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
        activeMerchants: Math.max(200, Math.min(300, prev.activeMerchants + Math.floor(Math.random() * 5 - 2)))
      }));

      // Update gas price
      setGasPrice(prev => Math.max(10, Math.min(50, prev + Math.floor(Math.random() * 7 - 3))));

      // Update pool health
      setPoolHealth(prev => Math.max(60, Math.min(95, prev + Math.floor(Math.random() * 10 - 5))));

      // Occasionally add new transaction
      if (Math.random() > 0.7) {
        const merchants = ['Walmart', 'Best Buy', 'Nike Store', 'McDonald\'s', 'Home Depot', 'Costco', 'Sephora', 'Uber', 'Netflix'];
        const newTx: Transaction = {
          id: Date.now().toString(),
          merchant: merchants[Math.floor(Math.random() * merchants.length)],
          amount: Math.random() * 500 + 10,
          time: 'Just now',
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          hash: `0x${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`
        };

        setTransactions(prev => [newTx, ...prev.slice(0, 4)]);

        // Update transaction times
        setTransactions(prev => prev.map((tx, index) => ({
          ...tx,
          time: index === 0 ? 'Just now' : `${index * 2 + 2} mins ago`
        })));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setStats({
      todayVolume: 127548.32 + Math.random() * 50000,
      activeMerchants: 248 + Math.floor(Math.random() * 50),
      activeUsers: 3892 + Math.floor(Math.random() * 500),
      totalTransactions: 1547 + Math.floor(Math.random() * 200),
      usdtPool: 2500000 + Math.random() * 500000,
      usdcPool: 3750000 + Math.random() * 500000,
    });

    setIsRefreshing(false);
  }, []);

  const handleToggleLiveUpdate = () => {
    setIsLiveUpdating(prev => !prev);
  };

  const handleMarkAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handlePoolClick = (pool: 'usdt' | 'usdc') => {
    setSelectedPool(selectedPool === pool ? null : pool);
  };

  const handleViewTransaction = (hash: string) => {
    // Simulate opening transaction in block explorer
    console.log('Viewing transaction:', hash);
  };

  const unreadAlerts = alerts.filter(alert => !alert.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Mobile-friendly header */}
        <div className="mb-8 sm:mb-12">
          {/* Title section */}
          <div className="text-center sm:text-left mb-6 sm:mb-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-blue-300">Real-time payment system overview</p>
          </div>

          {/* Control buttons - responsive layout */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Back to Home - moved to left */}
            <button
              onClick={() => onNavigate('wallet')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm w-full sm:w-auto justify-center order-3 sm:order-1"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm sm:text-base">Home</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
              {/* Live Update Toggle */}
              <button
                onClick={handleToggleLiveUpdate}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all backdrop-blur-sm w-full sm:w-auto justify-center ${
                  isLiveUpdating
                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                }`}
              >
                {isLiveUpdating ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="text-xs sm:text-sm font-medium">{isLiveUpdating ? 'Live' : 'Paused'}</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Section - Mobile optimized */}
        {unreadAlerts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 overflow-x-auto pb-2">
              {unreadAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleMarkAlertRead(alert.id)}
                  className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl cursor-pointer transition-all flex-shrink-0 min-w-0 ${
                    alert.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20'
                      : alert.type === 'warning'
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                      : 'bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                  }`}
                >
                  {alert.type === 'error' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                  {alert.type === 'info' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold truncate">{alert.title}</div>
                    <div className="text-xs opacity-80 hidden sm:block">{alert.message}</div>
                    <div className="text-xs opacity-80 sm:hidden truncate">{alert.message}</div>
                  </div>
                  <span className="text-xs opacity-60 whitespace-nowrap flex-shrink-0 hidden sm:block">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <Card gradient className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white/80 text-xs sm:text-sm">Today's Transaction Volume</div>
                  <div className="text-white text-2xl sm:text-5xl font-bold truncate">
                    ${animatedVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{stats.totalTransactions} transactions today</span>
                </div>
                <div className="text-emerald-300 font-semibold whitespace-nowrap">↑ 23.5%</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-emerald-300 animate-pulse' : 'bg-gray-400'}`}></div>
                <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                  {isLiveUpdating ? 'Live' : 'Paused'}
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-blue-100 text-xs sm:text-sm">
              Active Users
              {isLiveUpdating && <span className="text-xs text-blue-200 block sm:inline"> +{Math.floor(Math.random() * 20)}/min</span>}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-emerald-300 animate-pulse' : 'bg-gray-400'}`}></div>
                <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                  {isLiveUpdating ? 'Live' : 'Paused'}
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{stats.activeMerchants}</div>
            <div className="text-emerald-100 text-xs sm:text-sm">
              Active Merchants
              {isLiveUpdating && <span className="text-xs text-emerald-200 block sm:inline"> 98% online</span>}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">24h</div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{stats.totalTransactions.toLocaleString()}</div>
            <div className="text-amber-100 text-xs sm:text-sm">
              Total Transactions
              <span className="text-xs bg-amber-400/30 px-2 py-1 rounded-full ml-0 sm:ml-2 block sm:inline mt-1 sm:mt-0">+23.5%</span>
            </div>
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
                  <button
                    onClick={() => handlePoolClick('usdt')}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      selectedPool === 'usdt' ? 'bg-emerald-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-600">USDT: ${(stats.usdtPool / 1000000).toFixed(2)}M</span>
                  </button>
                  <button
                    onClick={() => handlePoolClick('usdc')}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      selectedPool === 'usdc' ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">USDC: ${(stats.usdcPool / 1000000).toFixed(2)}M</span>
                  </button>
                </div>

                {selectedPool && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedPool.toUpperCase()} Pool Details
                      </span>
                      <span className="text-xs text-gray-500">Click to view more</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Current Balance: ${(selectedPool === 'usdt' ? stats.usdtPool : stats.usdcPool).toLocaleString()}</div>
                      <div>Pool Share: {selectedPool === 'usdt' ? poolPercentage.toFixed(1) : (100 - poolPercentage).toFixed(1)}%</div>
                      <div className="text-emerald-600">Available for withdrawals</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${(stats.usdtPool / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600 mt-1">USDT Pool</div>
                  <div className="text-xs text-emerald-500 mt-2">Click to manage</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="text-2xl font-bold text-blue-600">
                    ${(stats.usdcPool / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600 mt-1">USDC Pool</div>
                  <div className="text-xs text-blue-500 mt-2">Click to manage</div>
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
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group"
                  onClick={() => tx.hash && handleViewTransaction(tx.hash)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.status === 'completed'
                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                        : tx.status === 'pending'
                        ? 'bg-gradient-to-br from-amber-100 to-amber-200'
                        : 'bg-gradient-to-br from-red-100 to-red-200'
                    }`}>
                      {tx.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {tx.status === 'pending' && <Activity className="w-5 h-5 text-amber-600" />}
                      {tx.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {tx.merchant}
                        <Eye className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        {tx.time}
                        {tx.hash && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{tx.hash}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">${tx.amount.toFixed(2)}</div>
                    <div className={`text-xs font-semibold ${
                      tx.status === 'completed'
                        ? 'text-emerald-600'
                        : tx.status === 'pending'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}

              {/* Refresh transactions button */}
              <button
                onClick={handleRefreshData}
                className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Transactions</span>
              </button>
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
                    <span className={`font-semibold ${
                      poolHealth > 80
                        ? 'text-emerald-600'
                        : poolHealth > 60
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {poolHealth > 80 ? 'Excellent' : poolHealth > 60 ? 'Good' : 'Warning'}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        poolHealth > 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : poolHealth > 60
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${poolHealth}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{poolHealth}%</div>
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
                    <span className="font-mono text-sm text-gray-800">{gasPrice} Gwei</span>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      gasPrice < 20
                        ? 'bg-emerald-100 text-emerald-700'
                        : gasPrice < 40
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {gasPrice < 20 ? 'Low' : gasPrice < 40 ? 'Medium' : 'High'}
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
              <p className="text-gray-600">
                {isLiveUpdating ? 'Real-time monitoring active' : 'Monitoring paused'}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
              isLiveUpdating
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-400 text-white'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
              {isLiveUpdating ? 'Healthy' : 'Paused'}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white rounded-xl">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">99.9%</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-xl">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">120ms</div>
              <div className="text-xs text-gray-600">Avg Response</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-xl">
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">2.4K</div>
              <div className="text-xs text-gray-600">Requests/min</div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-white/50 rounded-xl gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleLiveUpdate}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 sm:flex-none ${
                  isLiveUpdating
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {isLiveUpdating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="text-sm">{isLiveUpdating ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 disabled:opacity-50 transition-colors flex-1 sm:flex-none"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center sm:text-right">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
