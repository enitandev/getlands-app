"use client";
import { useEffect, useState } from 'react';

export default function PWARegistration() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // 2. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // 3. Detect iOS
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    
    if (iOSSafari) {
      setIsIOS(true);
      // Show for logged in users
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/agent')) {
        setShowInstallBanner(true);
      }
    }

    // 4. Handle Android/Chrome beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/agent')) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-[90px] left-[15px] right-[15px] lg:bottom-[30px] lg:left-auto lg:right-[30px] lg:w-[350px] bg-white rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#008b45]/20 p-[20px] z-[100] flex items-center gap-[15px] animate-in slide-in-from-bottom-5">
      <img src="/assets/pwa/icon-192.png" alt="App Icon" className="w-[50px] h-[50px] rounded-[12px] shadow-sm" />
      <div className="flex-1">
        <h4 className="font-manrope font-bold text-[14px] text-ink leading-tight mb-[2px]">Install Getlands App</h4>
        <p className="text-[12px] text-[#68736d] leading-tight">
          {isIOS ? 'Tap Share ⍐ then "Add to Home Screen"' : 'For a faster, native experience.'}
        </p>
      </div>
      {!isIOS && installPrompt && (
        <button 
          onClick={() => {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                setShowInstallBanner(false);
              }
            });
          }}
          className="px-[16px] py-[8px] bg-[#008b45] text-white text-[12px] font-bold rounded-full hover:bg-[#007339] transition-colors shrink-0"
        >
          Install
        </button>
      )}
      <button onClick={() => setShowInstallBanner(false)} className="absolute -top-[10px] -right-[10px] w-[24px] h-[24px] bg-white border border-black/10 rounded-full flex items-center justify-center text-[#68736d] shadow-sm hover:text-ink">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
}
