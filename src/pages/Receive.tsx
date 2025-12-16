import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Share2, QrCode, Wallet, TrendingUp } from 'lucide-react';
import { Card } from '../components/Card';

interface ReceiveProps {
  onNavigate: (page: string, data?: any) => void;
}

export const Receive: React.FC<ReceiveProps> = ({ onNavigate }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b8D4C9db96C4b2dF9b');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Receive Stablecoins',
          text: `Send ${selectedCurrency} to: ${walletAddress}`,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const generatePaymentData = () => {
    const data = {
      address: walletAddress,
      currency: selectedCurrency,
      amount: amount || undefined,
      network: 'Polygon',
      timestamp: Date.now()
    };
    return btoa(JSON.stringify(data));
  };

  const qrData = generatePaymentData();

  const quickAmounts = ['10', '25', '50', '100', '250', '500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 pt-12 pb-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('wallet')}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Receive</h1>
            <div className="w-10" />
          </div>

          <div className="text-center text-white/90">
            <p className="text-sm mb-2">Receive {selectedCurrency} instantly</p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Ready to receive</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <Card className="mb-6 p-6 bg-white shadow-xl">
            <div className="flex items-center justify-center p-8">
              <div className="w-64 h-64 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-48 h-48 text-gray-800 mx-auto mb-2" />
                  <div className="text-xs text-gray-500 font-mono">
                    REC{Date.now()}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-teal-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-teal-700">
                <QrCode className="w-5 h-5" />
                <span className="font-semibold">QR code ready</span>
              </div>
              <p className="text-sm text-teal-600 mt-2">
                Share this code to receive {selectedCurrency}
              </p>
            </div>
          </Card>

          <Card className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-teal-800">Multi-currency Support</p>
                <p className="text-xs text-teal-600">Receive USDT, USDC, and other stablecoins</p>
              </div>
            </div>
          </Card>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Request Specific Amount</h3>
              <button
                onClick={() => setShowAmountInput(!showAmountInput)}
                className={`text-sm font-medium transition-colors ${
                  showAmountInput ? 'text-teal-600' : 'text-gray-500'
                }`}
              >
                {showAmountInput ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAmountInput && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCurrency('USDC')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCurrency === 'USDC'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      USDC
                    </button>
                    <button
                      onClick={() => setSelectedCurrency('USDT')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCurrency === 'USDT'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      USDT
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({selectedCurrency})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Earn Interest on Received Funds</p>
                <p className="text-xs text-blue-600">All received stablecoins automatically earn 4.8% APY</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('wallet')}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Back to Wallet
            </button>
            <button
              onClick={handleCopy}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Copy Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};