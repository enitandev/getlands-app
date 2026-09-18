"use client";
import React, { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

let toastTimeout: NodeJS.Timeout;

export const toast = (message: string, type: ToastType = 'success') => {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export function ToastContainer() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');

  useEffect(() => {
    const handleShowToast = (e: any) => {
      setMessage(e.detail.message);
      setType(e.detail.type);
      setIsVisible(true);

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-[#008b45]' : type === 'error' ? 'bg-red-500' : 'bg-gray-800';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-down">
      <div className={`${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium text-sm transition-all`}>
        {type === 'success' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        )}
        {type === 'error' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )}
        {message}
      </div>
    </div>
  );
}
