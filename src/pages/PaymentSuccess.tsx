import React from 'react';
import { CheckCircle2, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface PaymentSuccessProps {
  onNavigate: (page: string, data?: any) => void;
  paymentData: {
    merchantName: string;
    amount: number;
    currency: string;
  };
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onNavigate, paymentData }) => {
  const { merchantName, amount, currency } = paymentData;
  const transactionId = `TX${Date.now().toString(36).toUpperCase()}`;
  const blockNumber = Math.floor(18239241 + Math.random() * 1000);
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 animate-bounce">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your transaction has been completed</p>
        </div>

        <Card className="mb-6">
          <div className="text-center mb-6 pb-6 border-b border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Amount Paid</div>
            <div className="text-4xl font-bold text-gray-800 mb-1">
              ${amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">{currency}</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Merchant</span>
              <span className="font-semibold text-gray-800">{merchantName}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm text-gray-800">{transactionId}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold text-gray-800">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            </div>
          </div>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900">Blockchain Transaction Proof</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-blue-600 mb-1">Transaction Hash</div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <code className="text-xs font-mono text-gray-700 flex-1 overflow-hidden overflow-ellipsis">
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                </code>
                <button className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-600 mb-1">Block Number</div>
                <div className="font-mono text-sm text-gray-800">#{blockNumber}</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">Confirmed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                This transaction is permanently recorded on the blockchain. Public, transparent, and immutable.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('wallet')}
            variant="success"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            Done
            <ArrowRight className="w-5 h-5" />
          </Button>

          <button
            onClick={() => onNavigate('payment-receipt', { paymentData })}
            className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            View Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
