import React, { useState } from 'react';
import { ArrowLeft, Store, Info, Shield, Zap, Link as LinkIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface PaymentConfirmProps {
  onNavigate: (page: string, data?: any) => void;
  paymentData: {
    merchantName: string;
    amount: number;
    currency: string;
    requestId: string;
  };
}

export const PaymentConfirm: React.FC<PaymentConfirmProps> = ({ onNavigate, paymentData }) => {
  const [processing, setProcessing] = useState(false);
  const { merchantName, amount, currency } = paymentData;

  const handleConfirmPayment = async () => {
    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    onNavigate('payment-success', { ...paymentData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 pt-12 pb-8 px-6">
          <button
            onClick={() => onNavigate('wallet')}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-white text-2xl font-bold">Confirm Payment</h1>
        </div>

        <div className="px-6 pt-8 pb-20">
          <Card className="mb-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Pay to</div>
                <div className="text-xl font-bold text-gray-800">{merchantName}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-gray-800">${amount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Currency</span>
                <span className="font-semibold text-gray-800">{currency}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-semibold text-gray-800">1 USD = 1 {currency}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Network Gas Fee</span>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-right">
                  <span className="text-gray-400 line-through text-sm mr-2">$0.05</span>
                  <span className="text-emerald-600 font-bold">$0.00</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Gas Free Payment</span>
              </div>
              <p className="text-sm text-emerald-700">
                Platform covers all blockchain fees via Meta-transaction
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <LinkIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  On-chain Settlement
                </div>
                <p className="text-xs text-blue-700">
                  This transaction will be recorded on blockchain with full transparency and immutability
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="text-sm font-medium text-gray-600 mb-3">Payment Method</div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">Stablecoin Balance</div>
                <div className="text-sm text-gray-600 mt-1">{currency} Wallet</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">${amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleConfirmPayment}
            disabled={processing}
            size="lg"
            className="w-full"
          >
            {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </Button>

          <button
            onClick={() => onNavigate('wallet')}
            className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
