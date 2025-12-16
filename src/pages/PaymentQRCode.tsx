import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, ArrowLeft, RefreshCw, TrendingDown, Clock } from 'lucide-react';
import { Card } from '../components/Card';

interface PaymentQRCodeProps {
  onNavigate: (page: string, data?: any) => void;
  paymentData: {
    merchantName: string;
    amount: number;
    currency: string;
    requestId: string;
  };
}

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ onNavigate, paymentData }) => {
  const [status, setStatus] = useState<'waiting' | 'paid'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const { merchantName, amount, currency, requestId } = paymentData;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestPayment = () => {
    onNavigate('payment-confirm', paymentData);
  };

  const simulatePayment = () => {
    setStatus('paid');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 pt-12 pb-8 px-6">
          <button
            onClick={() => onNavigate('merchant-pos')}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to POS</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">Payment QR Code</h1>
            <div className="text-white text-lg font-mono">{formatTime(timeRemaining)}</div>
          </div>
        </div>

        <div className="px-6 py-8">
          {status === 'waiting' ? (
            <>
              <Card className="mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Amount to Receive</div>
                  <div className="text-5xl font-bold text-gray-800 mb-2">
                    ${amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">{currency}</div>
                </div>
              </Card>

              <Card className="mb-6">
                <div className="flex items-center justify-center p-8">
                  <div className="w-64 h-64 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-48 h-48 text-gray-800 mx-auto mb-2" />
                      <div className="text-xs text-gray-500 font-mono">
                        {requestId}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">Waiting for payment...</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Customer can scan this QR code to pay
                  </p>
                </div>
              </Card>

              <div className="space-y-3">
                <button
                  onClick={handleTestPayment}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Test Payment (Simulate User Scan)
                </button>

                <button
                  onClick={simulatePayment}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Quick Test: Mark as Paid
                </button>

                <button
                  onClick={() => onNavigate('merchant-pos')}
                  className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </>
          ) : (
            <>
              <Card className="text-center py-12 mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 mx-auto animate-bounce">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Received!</h2>
                <div className="text-5xl font-bold text-emerald-600 my-6">
                  ${amount.toFixed(2)}
                </div>
                <p className="text-gray-600">
                  Transaction completed successfully
                </p>
              </Card>

              <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Fee Comparison
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-800">This Transaction</div>
                      <div className="text-xs text-gray-500">Stablecoin Payment</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600 font-bold">${(amount * 0.01).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">1.0% fee</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg opacity-75">
                    <div>
                      <div className="font-semibold text-gray-700">If using Visa/Mastercard</div>
                      <div className="text-xs text-gray-500">Traditional card payment</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-bold line-through">${(amount * 0.03).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">3.0% fee</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-700 font-semibold">You Saved:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ${(amount * 0.02).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900">Instant Settlement</h3>
                </div>
                <div className="text-sm text-blue-700 mb-2">
                  Funds arrived in: <span className="font-bold">~3 seconds</span>
                </div>
                <div className="text-xs text-blue-600">
                  Traditional systems: 2-7 business days
                </div>
              </Card>

              <button
                onClick={() => onNavigate('merchant-pos')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mb-6"
              >
                Back to POS
              </button>
            </>
          )}

          <Card className="mt-6 bg-gray-50">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant</span>
                <span className="font-semibold text-gray-800">{merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID</span>
                <span className="font-mono text-gray-800">{requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-800">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
