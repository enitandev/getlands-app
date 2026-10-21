"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    actionText?: string | null;
    actionUrl?: string | null;
    isDismissible: boolean;
  }>;
}

export default function DashboardAnnouncementCard({ announcements }: DashboardCardProps) {
  const [activeList, setActiveList] = useState<typeof announcements>([]);

  useEffect(() => {
    if (!announcements || announcements.length === 0) return;
    try {
      const remaining = announcements.filter(ann => {
        return !localStorage.getItem(`getlands_dismissed_card_${ann.id}`);
      });
      setActiveList(remaining);
    } catch {
      setActiveList(announcements);
    }
  }, [announcements]);

  if (!activeList || activeList.length === 0) return null;

  const handleDismiss = (id: string) => {
    setActiveList(prev => prev.filter(a => a.id !== id));
    try {
      localStorage.setItem(`getlands_dismissed_card_${id}`, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 mb-[25px]">
      {activeList.map(ann => {
        const { id, title, message, type, actionText, actionUrl, isDismissible } = ann;

        const styleConfig = {
          promo: {
            bg: 'bg-[#102218]',
            text: 'text-white',
            border: 'border-[#008b45]/30',
            badgeBg: 'bg-[#008b45] text-white',
            btnBg: 'bg-[#008b45] text-white hover:bg-[#007339]',
            subtext: 'text-[#a6baa9]',
          },
          warning: {
            bg: 'bg-[#fffbeb]',
            text: 'text-ink',
            border: 'border-[#fcd34d]',
            badgeBg: 'bg-[#d97706] text-white',
            btnBg: 'bg-[#d97706] text-white hover:bg-[#b45309]',
            subtext: 'text-[#78350f]',
          },
          critical: {
            bg: 'bg-red-50',
            text: 'text-red-950',
            border: 'border-red-200',
            badgeBg: 'bg-red-600 text-white',
            btnBg: 'bg-red-600 text-white hover:bg-red-700',
            subtext: 'text-red-800',
          },
          info: {
            bg: 'bg-white',
            text: 'text-ink',
            border: 'border-black/5',
            badgeBg: 'bg-[#182a20] text-white',
            btnBg: 'bg-[#182a20] text-white hover:bg-black',
            subtext: 'text-[#68736d]',
          },
        }[type as 'promo' | 'warning' | 'critical' | 'info'] || {
          bg: 'bg-white',
          text: 'text-ink',
          border: 'border-black/5',
          badgeBg: 'bg-[#182a20] text-white',
          btnBg: 'bg-[#182a20] text-white hover:bg-black',
          subtext: 'text-[#68736d]',
        };

        return (
          <div 
            key={id} 
            className={`rounded-[24px] p-[24px] lg:p-[30px] border shadow-sm relative overflow-hidden transition-all duration-300 ${styleConfig.bg} ${styleConfig.text} ${styleConfig.border}`}
          >
            {type === 'promo' && (
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-[20px]">
              <div className="space-y-[8px] max-w-[700px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styleConfig.badgeBg}`}>
                    {type}
                  </span>
                  <h3 className="font-manrope font-bold text-[18px] lg:text-[20px] leading-tight">
                    {title}
                  </h3>
                </div>
                <p className={`text-[13px] lg:text-[14px] leading-relaxed ${styleConfig.subtext}`}>
                  {message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {actionText && actionUrl && (
                  actionUrl.startsWith('http') ? (
                    <a
                      href={actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-[20px] py-[10px] rounded-full text-[13px] font-bold transition-colors shadow-sm ${styleConfig.btnBg}`}
                    >
                      {actionText}
                    </a>
                  ) : (
                    <Link
                      href={actionUrl}
                      className={`px-[20px] py-[10px] rounded-full text-[13px] font-bold transition-colors shadow-sm ${styleConfig.btnBg}`}
                    >
                      {actionText}
                    </Link>
                  )
                )}

                {isDismissible && (
                  <button
                    onClick={() => handleDismiss(id)}
                    className="w-[32px] h-[32px] rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
                    title="Dismiss"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
