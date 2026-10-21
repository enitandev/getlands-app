"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnnouncementProps {
  announcement: {
    id: string;
    title: string;
    message: string;
    type: string;
    actionText?: string | null;
    actionUrl?: string | null;
    isDismissible: boolean;
  } | null;
}

export default function GlobalAnnouncementBanner({ announcement }: AnnouncementProps) {
  const [isDismissed, setIsDismissed] = useState(true); // default hidden until mounted

  useEffect(() => {
    if (!announcement) return;
    try {
      const dismissed = localStorage.getItem(`getlands_dismissed_ann_${announcement.id}`);
      if (!dismissed) {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, [announcement]);

  if (!announcement || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(`getlands_dismissed_ann_${announcement.id}`, 'true');
    } catch {
      // ignore
    }
  };

  const { title, message, type, actionText, actionUrl, isDismissible } = announcement;

  // Visual Styles
  const styleConfig = {
    promo: {
      bg: 'bg-[#102218]',
      text: 'text-white',
      border: 'border-[#008b45]/30',
      badgeBg: 'bg-[#008b45] text-white',
      ctaColor: 'text-[#a9e7bd] hover:text-white',
      closeColor: 'text-white/60 hover:text-white',
    },
    warning: {
      bg: 'bg-[#fffbeb]',
      text: 'text-[#92400e]',
      border: 'border-[#fcd34d]',
      badgeBg: 'bg-[#d97706] text-white',
      ctaColor: 'text-[#b45309] hover:underline font-bold',
      closeColor: 'text-[#92400e]/60 hover:text-[#92400e]',
    },
    critical: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border-red-200',
      badgeBg: 'bg-red-600 text-white',
      ctaColor: 'text-red-700 hover:underline font-bold',
      closeColor: 'text-red-900/60 hover:text-red-900',
    },
    info: {
      bg: 'bg-[#f4f7f5]',
      text: 'text-ink',
      border: 'border-black/5',
      badgeBg: 'bg-[#182a20] text-white',
      ctaColor: 'text-[#008b45] hover:underline font-bold',
      closeColor: 'text-[#68736d] hover:text-ink',
    },
  }[type as 'promo' | 'warning' | 'critical' | 'info'] || {
    bg: 'bg-[#f4f7f5]',
    text: 'text-ink',
    border: 'border-black/5',
    badgeBg: 'bg-[#182a20] text-white',
    ctaColor: 'text-[#008b45] hover:underline font-bold',
    closeColor: 'text-[#68736d] hover:text-ink',
  };

  return (
    <div className={`w-full z-40 border-b ${styleConfig.bg} ${styleConfig.text} ${styleConfig.border} transition-all duration-300`}>
      <div className="max-w-[1400px] mx-auto px-[15px] lg:px-[30px] py-[10px] flex items-center justify-between gap-4 text-[13px]">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${styleConfig.badgeBg}`}>
            {type}
          </span>
          <span className="font-bold truncate">{title}</span>
          <span className="opacity-80 hidden md:inline truncate">— {message}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {actionText && actionUrl && (
            actionUrl.startsWith('http') ? (
              <a 
                href={actionUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={`text-[12px] font-bold flex items-center gap-1 ${styleConfig.ctaColor}`}
              >
                {actionText}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            ) : (
              <Link 
                href={actionUrl} 
                className={`text-[12px] font-bold flex items-center gap-1 ${styleConfig.ctaColor}`}
              >
                {actionText}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            )
          )}

          {isDismissible && (
            <button 
              onClick={handleDismiss} 
              aria-label="Dismiss banner"
              className={`p-1 rounded-full transition-colors ${styleConfig.closeColor}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
