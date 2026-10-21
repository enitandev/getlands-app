"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ModalProps {
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

export default function AnnouncementModal({ announcement }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!announcement) return;
    try {
      const dismissed = localStorage.getItem(`getlands_dismissed_modal_${announcement.id}`);
      if (!dismissed) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [announcement]);

  if (!announcement || !isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(`getlands_dismissed_modal_${announcement.id}`, 'true');
    } catch {
      // ignore
    }
  };

  const { title, message, type, actionText, actionUrl, isDismissible } = announcement;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden p-[30px] relative text-center">
        {isDismissible && (
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}

        <div className="mb-4">
          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            type === 'promo' ? 'bg-[#eef3ef] text-[#008b45]' :
            type === 'warning' ? 'bg-[#fffbeb] text-[#d97706]' :
            type === 'critical' ? 'bg-red-50 text-red-600' :
            'bg-black/5 text-ink'
          }`}>
            {type} Notice
          </span>
        </div>

        <h3 className="font-manrope font-bold text-[22px] text-ink mb-3 leading-snug">
          {title}
        </h3>

        <p className="text-[14px] text-[#68736d] leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actionText && actionUrl && (
            actionUrl.startsWith('http') ? (
              <a
                href={actionUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleClose}
                className="w-full sm:w-auto px-[24px] py-[12px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-sm"
              >
                {actionText}
              </a>
            ) : (
              <Link
                href={actionUrl}
                onClick={handleClose}
                className="w-full sm:w-auto px-[24px] py-[12px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-sm"
              >
                {actionText}
              </Link>
            )
          )}

          {isDismissible && (
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-[20px] py-[12px] bg-[#f4f7f5] text-ink text-[13px] font-bold rounded-full hover:bg-black/5 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
