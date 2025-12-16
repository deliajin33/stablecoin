import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Wallet, RefreshCw, Shield, QrCode, RotateCcw } from 'lucide-react';
import { Card } from '../components/Card';

interface PaymentCodeProps {
  onNavigate: (page: string, data?: any) => void;
}

export const PaymentCode: React.FC<PaymentCodeProps> = ({ onNavigate }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeKey, setQrCodeKey] = useState(0);
  const [currentRequestId, setCurrentRequestId] = useState(`REQ${Date.now()}`);

  const generateQRCode = () => {
    setIsGenerating(true);

    // 生成新的请求ID
    const newRequestId = `REQ${Date.now()}`;
    setCurrentRequestId(newRequestId);
    setQrCodeKey(prev => prev + 1);

    const paymentData = {
      wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b2dF9b',
      currency: selectedCurrency,
      amount: amount || null,
      timestamp: Date.now(),
      requestId: newRequestId,
      type: 'payment'
    };

    const qrString = JSON.stringify(paymentData);
    setQrCodeData(btoa(qrString));

    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    generateQRCode();
  }, [amount, selectedCurrency]);

  const handleCopy = async () => {
    const walletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b2dF9b';
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRefresh = () => {
    generateQRCode();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 pt-12 pb-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('wallet')}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Payment Code</h1>
            <div className="w-10" />
          </div>

          <div className="text-center text-white/90">
            <p className="text-sm mb-2">Share your payment QR code</p>
            <p className="text-xs text-white/70">
              Wallet: {formatAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b2dF9b')}
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          <Card className="mb-6 p-6 bg-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Payment QR Code</h3>
              <button
                onClick={generateQRCode}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
            <div className="flex items-center justify-center p-8">
              <div
                key={qrCodeKey}
                className="w-64 h-64 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center transition-all duration-300"
              >
                <div className="text-center">
                  <QrCode className="w-48 h-48 text-gray-800 mx-auto mb-2" />
                  <div className="text-xs text-gray-500 font-mono">
                    {currentRequestId}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {qrCodeKey > 0 ? 'Refreshed' : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <RefreshCw className="w-5 h-5" />
                <span className="font-semibold">Payment code ready</span>
              </div>
              <p className="text-sm text-emerald-600 mt-2">
                Scan this code to make payment
              </p>
            </div>
          </Card>

          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Secure Payment</p>
                <p className="text-xs text-blue-600">Encrypted and protected</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Amount (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Amounts
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['10', '25', '50', '100'].map((value) => (
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

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('wallet')}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Back to Wallet
            </button>
            <button
              onClick={handleCopy}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};