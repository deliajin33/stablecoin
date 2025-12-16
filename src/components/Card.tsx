import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', gradient = false }) => {
  const baseStyles = 'rounded-2xl shadow-lg p-6';
  const bgStyles = gradient
    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 text-white'
    : 'bg-white';

  return (
    <div className={`${baseStyles} ${bgStyles} ${className}`}>
      {children}
    </div>
  );
};
