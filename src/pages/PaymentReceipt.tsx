import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Copy, CheckCircle, Calendar, Clock, Store, Receipt, Shield, ExternalLink, FileText } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface PaymentReceiptProps {
  onNavigate: (page: string, data?: any) => void;
  paymentData: {
    merchantName: string;
    amount: number;
    currency: string;
  };
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ onNavigate, paymentData }) => {
  const { merchantName, amount, currency } = paymentData;
  const [copied, setCopied] = useState(false);

  // Generate receipt details
  const receiptNumber = `RCP${Date.now().toString(36).toUpperCase()}`;
  const transactionId = `TX${Date.now().toString(36).toUpperCase()}`;
  const blockNumber = Math.floor(18239241 + Math.random() * 1000);
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const handleCopyReceipt = async () => {
    const receiptData = {
      receiptNumber,
      merchantName,
      amount: `${amount.toFixed(2)} ${currency}`,
      date: currentDate,
      time: currentTime,
      transactionId,
      status: 'Completed',
      txHash
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(receiptData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy receipt:', err);
    }
  };

  const handleShareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Receipt',
          text: `Payment of ${amount.toFixed(2)} ${currency} to ${merchantName}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      receiptNumber,
      merchantName,
      amount: `${amount.toFixed(2)} ${currency}`,
      date: currentDate,
      time: currentTime,
      transactionId,
      status: 'Completed',
      txHash,
      blockNumber
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `receipt_${receiptNumber}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleViewOnExplorer = () => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 pt-12 pb-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('payment-success', { paymentData })}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Payment Receipt</h1>
            <div className="w-10" />
          </div>

          <div className="text-center text-white/90">
            <FileText className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">Official payment receipt</p>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Receipt Header Card */}
          <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-3">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Payment Completed</h2>
              <p className="text-sm text-gray-600">Thank you for your payment!</p>
            </div>

            <div className="text-center p-4 bg-white rounded-xl mb-4">
              <div className="text-sm text-gray-500 mb-2">Amount Paid</div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                ${amount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">{currency}</div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Transaction Confirmed</span>
            </div>
          </Card>

          {/* Transaction Details */}
          <Card className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              Transaction Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Receipt Number</div>
                    <div className="font-semibold text-gray-800">{receiptNumber}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(receiptNumber)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Merchant</span>
                <span className="font-semibold text-gray-800">{merchantName}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm text-gray-800">{transactionId}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Date</span>
                </div>
                <span className="font-semibold text-gray-800">{currentDate}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Time</span>
                </div>
                <span className="font-semibold text-gray-800">{currentTime}</span>
              </div>
            </div>
          </Card>

          {/* Blockchain Information */}
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Blockchain Verification
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-blue-600 mb-2">Transaction Hash</div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                  <code className="text-xs font-mono text-gray-700 flex-1 overflow-hidden overflow-ellipsis">
                    {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                  </code>
                  <button
                    onClick={handleViewOnExplorer}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 mb-1">Block Number</div>
                  <div className="font-mono text-sm text-gray-800">#{blockNumber}</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Confirmed</span>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  This transaction is permanently recorded on the blockchain and can be independently verified.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShareReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            <button
              onClick={handleDownloadReceipt}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>

          {/* Back to Success Page */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('payment-success', { paymentData })}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to Payment Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};