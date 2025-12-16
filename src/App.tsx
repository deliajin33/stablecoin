import { useState } from 'react';
import { UserWallet } from './pages/UserWallet';
import { PaymentConfirm } from './pages/PaymentConfirm';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentReceipt } from './pages/PaymentReceipt';
import { MerchantPOS } from './pages/MerchantPOS';
import { PaymentQRCode } from './pages/PaymentQRCode';
import { AdminDashboard } from './pages/AdminDashboard';
import { PaymentCode } from './pages/PaymentCode';
import { Transfer } from './pages/Transfer';
import { Receive } from './pages/Receive';
import { TransactionHistory } from './pages/TransactionHistory';
import { ScanQRCode } from './pages/ScanQRCode';

type PageType = 'wallet' | 'scan' | 'payment-confirm' | 'payment-success' | 'payment-receipt' | 'merchant-pos' | 'payment-qr' | 'admin' | 'payment-code' | 'transfer' | 'receive' | 'transaction-history' | 'user-wallet';

interface PageData {
  merchantName?: string;
  amount?: number;
  currency?: string;
  requestId?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('wallet');
  const [pageData, setPageData] = useState<PageData>({});

  const handleNavigate = (page: string, data?: PageData) => {
    setCurrentPage(page as PageType);
    if (data) {
      setPageData(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'wallet':
      case 'user-wallet':
        return <UserWallet onNavigate={handleNavigate} />;

      case 'scan':
        return <ScanQRCode onNavigate={handleNavigate} />;

      case 'payment-confirm':
        return (
          <PaymentConfirm
            onNavigate={handleNavigate}
            paymentData={{
              merchantName: pageData.merchantName || '',
              amount: pageData.amount || 0,
              currency: pageData.currency || 'USDC',
              requestId: pageData.requestId || '',
            }}
          />
        );

      case 'payment-success':
        return (
          <PaymentSuccess
            onNavigate={handleNavigate}
            paymentData={{
              merchantName: pageData.merchantName || '',
              amount: pageData.amount || 0,
              currency: pageData.currency || 'USDC',
            }}
          />
        );

      case 'payment-receipt':
        return (
          <PaymentReceipt
            onNavigate={handleNavigate}
            paymentData={{
              merchantName: pageData.merchantName || '',
              amount: pageData.amount || 0,
              currency: pageData.currency || 'USDC',
            }}
          />
        );

      case 'merchant-pos':
        return <MerchantPOS onNavigate={handleNavigate} />;

      case 'payment-qr':
        return (
          <PaymentQRCode
            onNavigate={handleNavigate}
            paymentData={{
              merchantName: pageData.merchantName || '',
              amount: pageData.amount || 0,
              currency: pageData.currency || 'USDC',
              requestId: pageData.requestId || '',
            }}
          />
        );

      case 'payment-code':
        return <PaymentCode onNavigate={handleNavigate} />;

      case 'transfer':
        return <Transfer onNavigate={handleNavigate} />;

      case 'receive':
        return <Receive onNavigate={handleNavigate} />;

      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;

      case 'transaction-history':
        return <TransactionHistory onNavigate={handleNavigate} />;

      default:
        return <UserWallet onNavigate={handleNavigate} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}

export default App;
