import { useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/auth';

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_DURATION = 2 * 60 * 1000; // 2 minutes before timeout

export const useSessionTimeout = (onTimeout?: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();

  const logout = useCallback(async () => {
    await authService.logout();
    if (onTimeout) {
      onTimeout();
    } else {
      window.location.href = '/login?reason=timeout';
    }
  }, [onTimeout]);

  const showWarning = useCallback(() => {
    const confirmed = window.confirm(
      'Your session will expire in 2 minutes due to inactivity. Click OK to stay logged in.'
    );
    
    if (confirmed) {
      resetTimeout();
    } else {
      logout();
    }
  }, [logout]);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set timeout if user is authenticated
    if (authService.isAuthenticated()) {
      // Set warning timeout
      warningTimeoutRef.current = setTimeout(showWarning, TIMEOUT_DURATION - WARNING_DURATION);
      
      // Set logout timeout
      timeoutRef.current = setTimeout(logout, TIMEOUT_DURATION);
    }
  }, [showWarning, logout]);

  const handleActivity = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      return;
    }

    // Start the timeout
    resetTimeout();

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [handleActivity, resetTimeout]);

  return { resetTimeout };
};