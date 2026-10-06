"use client";
import React, { useEffect, useState } from 'react';

export default function ReferralLinkCard({ code }: { code: string }) {
  const [origin, setOrigin] = useState('https://getlands.shop');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = `${origin}/register?ref=${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Acquire real assets with Getlands. Sign up here: ${link}`)}`;

  return (
    <div className="bg-white border border-[#008b45]/20 rounded-[24px] p-[25px] lg:p-[40px] mb-[40px] shrink-0">
      <h2 className="font-manrope text-[20px] font-bold text-ink mb-[8px]">Your Referral Link</h2>
      <p className="text-[13px] text-[#68736d] mb-[20px] leading-relaxed">
        Anyone who signs up through this link becomes your client. You earn on their acquisitions, and if one of your referrals is appointed as a sales agent, you also earn a recruiter bonus on their clients&apos; first acquisitions.
      </p>
      <div className="flex border border-black/10 rounded-[12px] overflow-hidden mb-[12px]">
        <input type="text" readOnly value={link} className="flex-1 min-w-0 bg-[#f7f9f7] px-[15px] text-[13px] text-ink outline-none" />
        <button onClick={handleCopy} className="h-[45px] px-[20px] bg-[#182a20] text-white text-[13px] font-bold hover:bg-black transition-colors shrink-0">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center h-[42px] px-[20px] rounded-full bg-[#25D366] text-white text-[13px] font-bold hover:opacity-90 transition-opacity">
        Share on WhatsApp
      </a>
    </div>
  );
}
