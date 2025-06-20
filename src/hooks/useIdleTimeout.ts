import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useIdleTimeout = (timeout: number) => {
  const { signOut } = useAuth();
  const [isIdle, setIsIdle] = useState(false);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleIdle = () => {
      setIsIdle(true);
      signOut();
    };

    const setupTimer = () => {
      timer = setTimeout(handleIdle, timeout);
    };

    const clearTimer = () => {
      clearTimeout(timer);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const eventListener = () => {
      clearTimer();
      setupTimer();
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, eventListener);
    });

    setupTimer();

    return () => {
      clearTimer();
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
    };
  }, [timeout, signOut, resetTimer]);

  return isIdle;
}; 