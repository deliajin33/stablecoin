import { useState } from 'react';
import { UserWallet } from './pages/UserWallet';
import { PaymentConfirm } from './pages/PaymentConfirm';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { MerchantPOS } from './pages/MerchantPOS';
import { PaymentQRCode } from './pages/PaymentQRCode';
import { AdminDashboard } from './pages/AdminDashboard';

type PageType = 'wallet' | 'scan' | 'payment-confirm' | 'payment-success' | 'merchant-pos' | 'payment-qr' | 'admin';

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
        return <UserWallet onNavigate={handleNavigate} />;

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

      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;

      default:
        return <UserWallet onNavigate={handleNavigate} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}

export default App;
