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

  if (isIOS) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-t-[32px] p-[30px] pb-[40px] animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative">
          
          <button onClick={() => setShowInstallBanner(false)} className="absolute top-[20px] right-[20px] w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center text-[#68736d] hover:bg-[#eef3ef] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="flex flex-col items-center text-center">
            <img src="/assets/pwa/icon-192.png" alt="Getlands App" className="w-[80px] h-[80px] rounded-[20px] shadow-[0_10px_20px_rgba(0,139,69,0.2)] mb-[20px]" />
            <h2 className="text-[24px] font-manrope font-extrabold text-ink leading-tight mb-[10px]">
              Install the Getlands App
            </h2>
            <p className="text-[15px] text-[#68736d] mb-[30px] max-w-[300px]">
              Add Getlands to your home screen for instant access and native push notifications.
            </p>
            
            <div className="bg-[#f7f9f7] w-full rounded-[20px] p-[20px] mb-[20px]">
              <div className="flex items-center gap-[15px] mb-[20px]">
                <div className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center text-[#007aff] shadow-sm shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </div>
                <div className="text-left">
                  <span className="text-[12px] font-bold text-[#a1aba6] uppercase tracking-wider block">Step 1</span>
                  <span className="text-[15px] font-bold text-ink">Tap the Share icon below</span>
                </div>
              </div>
              
              <div className="flex items-center gap-[15px]">
                <div className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center text-ink shadow-sm shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </div>
                <div className="text-left">
                  <span className="text-[12px] font-bold text-[#a1aba6] uppercase tracking-wider block">Step 2</span>
                  <span className="text-[15px] font-bold text-ink">Select "Add to Home Screen"</span>
                </div>
              </div>
            </div>

            {/* Bouncing arrow pointing down to Safari's share bar */}
            <div className="animate-bounce text-[#007aff] mt-[10px]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[90px] left-[15px] right-[15px] lg:bottom-[30px] lg:left-auto lg:right-[30px] lg:w-[350px] bg-white rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-[#008b45]/20 p-[20px] z-[100] flex items-center gap-[15px] animate-in slide-in-from-bottom-5">
      <img src="/assets/pwa/icon-192.png" alt="App Icon" className="w-[50px] h-[50px] rounded-[12px] shadow-sm" />
      <div className="flex-1">
        <h4 className="font-manrope font-bold text-[14px] text-ink leading-tight mb-[2px]">Install Getlands App</h4>
        <p className="text-[12px] text-[#68736d] leading-tight">For a faster, native experience.</p>
      </div>
      {installPrompt && (
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
