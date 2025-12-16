import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, AlertCircle, CheckCircle2, ArrowLeft, Scan, QrCode } from 'lucide-react';
import { Card } from '../components/Card';

interface ScanQRCodeProps {
  onNavigate: (page: string, data?: any) => void;
}

export const ScanQRCode: React.FC<ScanQRCodeProps> = ({ onNavigate }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedQR, setDetectedQR] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [scanLinePosition, setScanLinePosition] = useState(0);

  // 生成随机金额和商家信息
  const randomAmount = React.useMemo(() => {
    const amounts = [12.50, 25.00, 38.75, 45.00, 67.80, 89.99, 125.50, 156.25, 199.99, 299.00];
    return amounts[Math.floor(Math.random() * amounts.length)];
  }, []);

  const merchants = ['Demo Store', 'Coffee Shop', 'Restaurant', 'Book Store', 'Electronics', 'Supermarket', 'Fast Food', 'Gas Station', 'Pharmacy', 'Bakery'];
  const randomMerchant = React.useMemo(() => {
    return merchants[Math.floor(Math.random() * merchants.length)];
  }, []);

  // 模拟扫描线动画
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanLinePosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning]);

  // 模拟扫描进度和检测
  useEffect(() => {
    if (!isScanning) return;

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          setIsScanning(false);
          setDetectedQR(true);
          setTimeout(() => {
            setShowSuccess(true);
            setTimeout(() => {
              // 跳转到支付确认页面，使用随机生成的金额和商家
              onNavigate('payment-confirm', {
                merchantName: randomMerchant,
                amount: randomAmount,
                currency: 'USDC',
                requestId: `REQ${Date.now()}`,
              });
            }, 1500);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [isScanning, onNavigate]);

  const handleCancel = () => {
    setIsScanning(false);
    onNavigate('wallet');
  };

  const handleRetry = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDetectedQR(false);
    setShowSuccess(false);
    setError('');
    setScanLinePosition(0);
  };

  const handleManualInput = () => {
    onNavigate('payment-confirm', {
      merchantName: randomMerchant,
      amount: randomAmount,
      currency: 'USDC',
      requestId: `REQ${Date.now()}`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Scan QR Code</h1>
          <button
            onClick={handleManualInput}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manual
          </button>
        </div>
      </div>

      {/* 相机视图区域 */}
      <div className="relative h-screen flex items-center justify-center">
        {/* 模拟相机背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50" />

        {/* 扫描框 */}
        <div className="relative z-10">
          <div className="relative w-72 h-72 bg-black/20 rounded-2xl border-2 border-white/30 overflow-hidden">
            {/* 扫描线 */}
            {isScanning && (
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  top: `${scanLinePosition}%`,
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)',
                  transition: 'top 0.05s linear'
                }}
              />
            )}

            {/* 四个角落的扫描框 */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

            {/* 模拟二维码 */}
            <div className="absolute inset-4 bg-white rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                {/* 简化的二维码图案 */}
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const pattern = [
                      1,1,1,1,1,1,
                      1,0,0,0,0,1,
                      1,0,1,1,0,1,
                      1,0,1,1,0,1,
                      1,0,0,0,0,1,
                      1,1,1,1,1,1
                    ];
                    return (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-sm ${
                          pattern[i] === 1 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* 商家信息 */}
                <div className="text-xs text-gray-700 font-medium">{randomMerchant}</div>
                <div className="text-xs text-gray-600">${randomAmount.toFixed(2)}</div>

                {/* 二维码边角装饰 */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black" />
              </div>
            </div>

            {/* 扫描状态覆盖层 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {isScanning && (
                <div className="text-center bg-black/70 p-4 rounded-lg">
                  <Scan className="w-12 h-12 text-cyan-400 animate-pulse mx-auto mb-3" />
                  <p className="text-sm text-white">Scanning...</p>
                  <div className="mt-3 w-40 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-300 mt-2">{Math.floor(scanProgress)}%</p>
                </div>
              )}

              {detectedQR && !showSuccess && (
                <div className="text-center bg-black/70 p-4 rounded-lg animate-pulse">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-emerald-300">QR Code Detected!</p>
                </div>
              )}

              {showSuccess && (
                <div className="text-center bg-black/70 p-4 rounded-lg animate-bounce">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-emerald-300">Payment Ready</p>
                </div>
              )}
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {isScanning
                ? "Align QR code within frame"
                : detectedQR
                ? "Processing payment..."
                : "Ready to scan"}
            </p>
          </div>
        </div>

        {/* 底部操作区域 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="space-y-4">
            {/* 手动输入选项 */}
            <button
              onClick={handleManualInput}
              className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-colors border border-white/20"
            >
              <p className="font-medium">Enter Payment Code Manually</p>
              <p className="text-xs text-gray-400 mt-1">Type merchant payment code</p>
            </button>

            {/* 错误状态 */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* 重试按钮 */}
            {!isScanning && !detectedQR && (
              <button
                onClick={handleRetry}
                className="w-full p-4 bg-cyan-500/20 backdrop-blur-sm rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
              >
                Retry Scanning
              </button>
            )}
          </div>
        </div>

        {/* 模拟相机闪光效果 */}
        {detectedQR && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-white animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};