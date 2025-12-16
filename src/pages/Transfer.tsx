import React, { useState } from 'react';
import { ArrowLeft, Search, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';

interface TransferProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Contact {
  id: string;
  name: string;
  address: string;
  avatar: string;
  lastTransaction?: string;
}

export const Transfer: React.FC<TransferProps> = ({ onNavigate }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<'search' | 'confirm'>('search');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Alice Chen',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b2dF9b',
      avatar: 'AC',
      lastTransaction: '2 days ago'
    },
    {
      id: '2',
      name: 'Bob Wilson',
      address: '0x8ba1f109551bD432803012645Hac136c22C57B',
      avatar: 'BW',
      lastTransaction: '1 week ago'
    },
    {
      id: '3',
      name: 'Charlie Davis',
      address: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678',
      avatar: 'CD',
      lastTransaction: '2 weeks ago'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact: Contact) => {
    setRecipient(contact.address);
    setStep('confirm');
  };

  const handleTransfer = async () => {
    if (!recipient || !amount) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setTransferSuccess(true);
    }, 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleNewTransfer = () => {
    setRecipient('');
    setAmount('');
    setNote('');
    setStep('search');
    setTransferSuccess(false);
  };

  if (transferSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <Card className="text-center p-8 bg-white shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Successful!</h2>
            <p className="text-gray-600 mb-6">
              {amount} {selectedCurrency} sent successfully
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Recipient:</span>
                <span className="text-sm font-medium">{formatAddress(recipient)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="text-sm font-medium">{amount} {selectedCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Transaction ID:</span>
                <span className="text-sm font-medium">0x1234...5678</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNewTransfer}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                New Transfer
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Back to Wallet
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 pt-12 pb-8 px-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('search')}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-white text-xl font-bold">Confirm Transfer</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="px-6 py-6">
            <Card className="mb-6 p-6 bg-white shadow-xl">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {amount} {selectedCurrency}
                </div>
                <p className="text-gray-600">Amount to send</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-mono text-sm">{formatAddress(recipient)}</p>
                  </div>
                </div>

                {note && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 mb-1">Note</p>
                    <p className="text-sm text-gray-700">{note}</p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Please double-check</p>
                    <p className="text-xs text-amber-700">
                      Cryptocurrency transactions cannot be reversed. Make sure the recipient address is correct.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTransfer}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Confirm Transfer'
                )}
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 pt-12 pb-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('wallet')}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Transfer</h1>
            <div className="w-10" />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Your Balance</p>
                <p className="text-lg font-bold">1,750.00 USDC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <Card className="mb-6 p-4 bg-white shadow-lg">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{contact.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{formatAddress(contact.address)}</p>
                  </div>
                  {contact.lastTransaction && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{contact.lastTransaction}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter wallet address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setStep('confirm')}
            disabled={!recipient || !amount}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};