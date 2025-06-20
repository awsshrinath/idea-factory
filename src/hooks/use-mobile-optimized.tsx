
import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

export function useMobileOptimized() {
  const isMobile = useIsMobile();
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const getResponsiveClasses = (baseClasses: string, mobileOverrides?: string) => {
    if (isMobile && mobileOverrides) {
      return `${baseClasses} ${mobileOverrides}`;
    }
    return baseClasses;
  };

  const getButtonSize = () => {
    return isMobile ? 'mobile' : 'default';
  };

  const getCardPadding = () => {
    return isMobile ? 'p-4' : 'p-6';
  };

  const getGridCols = (desktop: number, tablet: number = 2, mobile: number = 1) => {
    if (isMobile) return `grid-cols-${mobile}`;
    return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  };

  const getTouchTargetSize = () => {
    return touchDevice ? 'min-h-[48px] min-w-[48px]' : 'min-h-[40px] min-w-[40px]';
  };

  return {
    isMobile,
    touchDevice,
    getResponsiveClasses,
    getButtonSize,
    getCardPadding,
    getGridCols,
    getTouchTargetSize,
  };
}
