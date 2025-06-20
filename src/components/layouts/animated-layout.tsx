
import React from 'react';
import { PremiumBackground } from '@/components/ui/premium-background';

interface AnimatedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <PremiumBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
