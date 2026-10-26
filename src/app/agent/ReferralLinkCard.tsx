"use client";
import React, { useEffect, useState } from 'react';

export default function ReferralLinkCard({ code }: { code: string }) {
  const [origin, setOrigin] = useState('https://getlands.ng');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = `${origin}/register?ref=${code}`;

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    onSuccess();
  };

  const handleCopyLink = () => {
    copyToClipboard(link, () => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const templates = [
    {
      title: "Food Commodities (From ₦50,000)",
      description: "Best for everyday friends looking to start small with high cashflow.",
      text: `Instead of letting cash sit in the bank losing value to inflation, you can earn up to 20% every 3 months sponsoring real food commodities (Garri, Pepper, Onions, Tomatoes). 

Start with as little as ₦50,000. Payouts drop directly into your account on schedule.

Sign up with my link here: ${link}`
    },
    {
      title: "10% First-Month Promo (Limited 100 Units)",
      description: "High urgency offer for quick signups and first-time buyers.",
      text: `Getlands is running a limited 10% first-month return promo on Pepper, Onions, Tomatoes, and Garri. 

Only 100 promotional units are available this month. Lock down your slot before it sells out: ${link}`
    },
    {
      title: "Abeokuta Land & 40% Land Banking",
      description: "Best for high-trust buyers who want physical land or post-dated cheques.",
      text: `Looking for clean, titled land in Abeokuta? 

Location: Ilewo Orile (10 mins from Alamala Barracks and 10 mins from Crescent University).
* Full plot is ₦500,000 (Deed of Assignment and Registered Survey).
* 1 Acre (6 plots) is ₦2,500,000.

If you prefer cash returns, their Land Banking pays 40% in 12 months with post-dated cheques handed to you upfront.

Register here to view the survey plan: ${link}`
    }
  ];

  const handleCopyTemplate = (text: string, idx: number) => {
    copyToClipboard(text, () => {
      setCopiedTemplateIdx(idx);
      setTimeout(() => setCopiedTemplateIdx(null), 2000);
    });
  };

  return (
    <div className="bg-white border border-[#008b45]/20 rounded-[24px] p-[25px] lg:p-[40px] mb-[40px] shrink-0 space-y-[30px]">
      <div>
        <h2 className="font-manrope text-[20px] font-bold text-ink mb-[8px]">Your Referral Tools & Link</h2>
        <p className="text-[13px] text-[#68736d] leading-relaxed">
          Anyone who signs up using your code or link becomes your client. You earn a 5% commission on their first transaction and 2% on subsequent purchases, credited directly into your wallet.
        </p>
      </div>
      
      {/* Code and Link Blocks */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Code Block */}
        <div className="flex-1 bg-[#f4f7f5] rounded-[16px] p-[20px] border border-black/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[#008b45] rounded-full blur-[30px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="text-[11px] font-bold text-[#68736d] uppercase tracking-wider mb-[10px]">Your Referral Code</div>
          <div className="font-manrope text-[32px] font-extrabold text-[#1a1a1a] tracking-widest">{code}</div>
        </div>

        {/* Link Block */}
        <div className="flex-[2] flex flex-col justify-end">
          <div className="text-[11px] font-bold text-[#68736d] uppercase tracking-wider mb-[10px]">Your Referral Link</div>
          <div className="flex border border-black/10 rounded-[12px] overflow-hidden">
            <input type="text" readOnly value={link} className="flex-1 min-w-0 bg-[#f7f9f7] px-[15px] text-[13px] text-ink outline-none font-medium" />
            <button onClick={handleCopyLink} className="h-[52px] px-[24px] bg-[#182a20] text-white text-[13px] font-bold hover:bg-black transition-colors shrink-0">
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Status Swipe Files */}
      <div className="pt-[10px] border-t border-black/5">
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <h3 className="font-manrope text-[16px] font-bold text-ink">Ready-to-Post WhatsApp Status Scripts</h3>
            <p className="text-[12px] text-[#68736d]">Share these high-converting messages directly to your WhatsApp status or broadcast list.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {templates.map((tpl, idx) => {
            const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(tpl.text)}`;

            return (
              <div key={idx} className="bg-[#fcfdfc] border border-black/5 rounded-[16px] p-[18px] flex flex-col justify-between hover:border-[#008b45]/30 transition-all">
                <div>
                  <h4 className="font-manrope text-[14px] font-bold text-ink mb-[4px]">{tpl.title}</h4>
                  <p className="text-[11px] text-[#68736d] mb-[12px]">{tpl.description}</p>
                  <div className="bg-white border border-black/5 rounded-[10px] p-[12px] text-[12px] text-[#333] leading-relaxed max-h-[140px] overflow-y-auto mb-[14px] whitespace-pre-line">
                    {tpl.text}
                  </div>
                </div>

                <div className="flex items-center gap-[8px] pt-[8px]">
                  <button
                    onClick={() => handleCopyTemplate(tpl.text, idx)}
                    className="flex-1 py-[8px] bg-white border border-black/10 hover:border-[#008b45] text-[12px] font-bold text-ink rounded-lg transition-colors text-center"
                  >
                    {copiedTemplateIdx === idx ? 'Copied!' : 'Copy Text'}
                  </button>
                  <a
                    href={whatsappShareHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-[8px] bg-[#25D366] hover:bg-[#20ba5a] text-white text-[12px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
