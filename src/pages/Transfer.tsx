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
    },
    {
      id: '4',
      name: 'Emma Thompson',
      address: '0x1234567890AbcdeF1234567890AbcdeF12345678',
      avatar: 'ET',
      lastTransaction: '3 hours ago'
    },
    {
      id: '5',
      name: 'David Martinez',
      address: '0xAbc123def456ghi789jkl012mno345pqr678stu',
      avatar: 'DM',
      lastTransaction: '5 days ago'
    },
    {
      id: '6',
      name: 'Sophie Johnson',
      address: '0x9876543210ZyXwVu9876543210ZyXwVu98765432',
      avatar: 'SJ',
      lastTransaction: '1 month ago'
    },
    {
      id: '7',
      name: 'Michael Brown',
      address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      avatar: 'MB',
      lastTransaction: '2 months ago'
    },
    {
      id: '8',
      name: 'Lisa Anderson',
      address: '0x9f8e7d6c5b4a3210fedcba9876543210fedcba98',
      avatar: 'LA',
      lastTransaction: '6 hours ago'
    },
    {
      id: '9',
      name: 'James Taylor',
      address: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
      avatar: 'JT',
      lastTransaction: '3 days ago'
    },
    {
      id: '10',
      name: 'Maria Garcia',
      address: '0x6f5e4d3c2b1a0987654321fedcba9876543210fe',
      avatar: 'MG',
      lastTransaction: '4 days ago'
    },
    {
      id: '11',
      name: 'Robert Miller',
      address: '0x3344556677889900aabbccddeeffgghhiijjkkll',
      avatar: 'RM',
      lastTransaction: '1 week ago'
    },
    {
      id: '12',
      name: 'Jennifer White',
      address: '0x11223344556677889900aabbccddeeffgghhiijj',
      avatar: 'JW',
      lastTransaction: '2 weeks ago'
    },
    {
      id: '13',
      name: 'William Harris',
      address: '0x99887766554433221100ffeeddccbbaa99887766',
      avatar: 'WH',
      lastTransaction: '5 days ago'
    },
    {
      id: '14',
      name: 'Sarah Clark',
      address: '0xaabbccddeeff0011223344556677889900aabbcc',
      avatar: 'SC',
      lastTransaction: '1 day ago'
    },
    {
      id: '15',
      name: 'Daniel Lewis',
      address: '0x889900aabbccddeeff0011223344556677889900',
      avatar: 'DL',
      lastTransaction: '3 weeks ago'
    },
    {
      id: '16',
      name: 'Olivia Walker',
      address: '0x556677889900aabbccddeeff0011223344556677',
      avatar: 'OW',
      lastTransaction: '4 hours ago'
    },
    {
      id: '17',
      name: 'Joseph Hall',
      address: '0x223344556677889900aabbccddeeff0011223344',
      avatar: 'JH',
      lastTransaction: '6 days ago'
    },
    {
      id: '18',
      name: 'Emily Young',
      address: '0x7766554433221100ffeeddccbbaa998877665544',
      avatar: 'EY',
      lastTransaction: '2 hours ago'
    },
    {
      id: '19',
      name: 'Thomas King',
      address: '0x44556677889900aabbccddeeff00112233445566',
      avatar: 'TK',
      lastTransaction: '1 month ago'
    },
    {
      id: '20',
      name: 'Jessica Scott',
      address: '0x99aabbccddeeff0011223344556677889900aabb',
      avatar: 'JS',
      lastTransaction: '12 hours ago'
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
              {/* 可编辑的金额部分 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amount to Send
                </label>

                {/* 主要金额输入区域 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 max-w-xs">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl sm:text-2xl font-bold">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xl sm:text-2xl font-bold text-gray-800"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-base sm:text-lg font-semibold"
                  >
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>

                {/* USD等值显示 */}
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">USD Equivalent:</span>
                    <span className="text-lg font-bold text-orange-800">
                      ${amount ? (parseFloat(amount) * 1.00).toFixed(2) : '0.00'} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* 快捷金额按钮 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Amounts
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {['10', '25', '50', '100', '250', '500', '1000', '2500'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className="px-2 py-2 sm:px-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors text-sm"
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>

              {/* 接收者信息 */}
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

                {/* 可编辑的备注 */}
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

              {/* 费用信息 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transfer Amount:</span>
                    <span className="font-medium">{amount || '0.00'} {selectedCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network Fee:</span>
                    <span className="font-medium">~0.50 {selectedCurrency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium">{amount ? (parseFloat(amount) * 0.01).toFixed(2) : '0.00'} {selectedCurrency}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-orange-600">
                        {amount ? (parseFloat(amount) + 0.50 + (parseFloat(amount) * 0.01)).toFixed(2) : '0.50'} {selectedCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 警告信息 */}
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
                disabled={!recipient || !amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Send ${amount || '0.00'} ${selectedCurrency}`
                )}
              </button>
            </Card>

            {/* 余额信息 */}
            <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-700 font-medium">Available Balance:</span>
                <span className="text-lg font-bold text-orange-800">1,750.00 {selectedCurrency}</span>
              </div>
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