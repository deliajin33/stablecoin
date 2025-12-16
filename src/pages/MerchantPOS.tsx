import React, { useState } from 'react';
import { Store, Delete, Home, Shield, RefreshCw } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface MerchantPOSProps {
  onNavigate: (page: string, data?: any) => void;
}

export const MerchantPOS: React.FC<MerchantPOSProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [autoConvert, setAutoConvert] = useState(true);
  const merchantName = 'Demo Store';

  const handleNumberClick = (num: string) => {
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else if (num === '.' && amount.includes('.')) {
      return;
    } else if (amount.split('.')[1]?.length >= 2) {
      return;
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    setAmount(amount.slice(0, -1) || '0');
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleGenerateQR = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    onNavigate('payment-qr', {
      merchantName,
      amount: parseFloat(amount),
      currency: 'USDC',
      requestId: `REQ${Date.now()}`,
    });
  };

  const displayAmount = amount || '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 pt-12 pb-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/80 text-sm">Merchant Portal</div>
                <div className="text-white text-lg font-bold">{merchantName}</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('wallet')}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          <Card className="mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Enter Amount</div>
              <div className="text-5xl font-bold text-gray-800 mb-2 min-h-[60px] flex items-center justify-center">
                ${displayAmount}
              </div>
              <div className="text-sm text-gray-500">USD</div>
            </div>
          </Card>

          <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-900 text-sm">Volatility Protection</div>
                  <div className="text-xs text-emerald-600">Auto-convert to USD</div>
                </div>
              </div>
              <button
                onClick={() => setAutoConvert(!autoConvert)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  autoConvert ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    autoConvert ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {autoConvert && (
              <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-700">
                <RefreshCw className="w-3 h-3" />
                <span>Stablecoins will be instantly converted to USD at market rate</span>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '00'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all font-semibold text-xl text-gray-800"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleDelete}
              className="h-14 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all font-semibold text-gray-800 flex items-center justify-center gap-2"
            >
              <Delete className="w-5 h-5" />
              Delete
            </button>
            <button
              onClick={handleClear}
              className="h-14 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all font-semibold text-gray-800"
            >
              Clear
            </button>
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={!amount || parseFloat(amount) <= 0}
            size="lg"
            className="w-full"
          >
            Generate QR Code
          </Button>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[10, 20, 50].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold transition-colors"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
