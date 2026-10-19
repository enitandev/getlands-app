"use client";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { toast } from '@/components/ui/Toast';

export default function ClientReferrals({ referralCode, totalEarned, totalSignups, successfulReferrals, referredUsers, referralBonusPercentage = 5 }: any) {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [origin, setOrigin] = useState('https://getlands.ng');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const referralLink = `${origin}/register?ref=${referralCode || ''}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Acquire real assets with Getlands. Sign up here: ${referralLink}`)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      const el = document.createElement('textarea');
      el.value = referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    toast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch {
      const el = document.createElement('textarea');
      el.value = referralCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedCode(true);
    toast('Referral code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-[40px]">
      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">REFER & EARN</div>
        <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
          Invite friends. Earn {referralBonusPercentage}%.
        </h1>
        <p className="text-[16px] text-[#68736d] max-w-[650px] leading-relaxed">
          Share your unique code or link. When your friends make their first investment, a <strong className="text-ink font-bold">{referralBonusPercentage}% cash bonus</strong> will be instantly credited to your Getlands Wallet.
        </p>
      </section>

      {/* Robust Referral Tools Box */}
      <section className="bg-white border border-[#008b45]/20 rounded-[24px] p-[25px] lg:p-[40px] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[15px] mb-[25px]">
          <div>
            <h2 className="font-manrope text-[20px] font-bold text-ink mb-[4px]">Your Referral Tools</h2>
            <p className="text-[13px] text-[#68736d]">Anyone who registers with your code or link becomes your referral.</p>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[11px] text-[#7a847f] font-bold uppercase tracking-wider">Reward Rate:</span>
            <span className="px-[12px] py-[4px] bg-[#eef3ef] text-[#008b45] text-[13px] font-bold rounded-full font-manrope">
              {referralBonusPercentage}% on First Acquisition
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-[25px]">
          {/* Code Block */}
          <div className="flex-1 bg-[#f4f7f5] rounded-[16px] p-[20px] border border-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[#008b45] rounded-full blur-[30px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex items-center justify-between mb-[10px]">
              <div className="text-[11px] font-bold text-[#68736d] uppercase tracking-wider">Your Code</div>
              <button 
                onClick={handleCopyCode} 
                className="text-[11px] font-bold text-[#008b45] hover:underline"
              >
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="font-manrope text-[32px] font-extrabold text-[#1a1a1a] tracking-widest">{referralCode}</div>
          </div>

          {/* Link Block */}
          <div className="flex-[2] flex flex-col justify-end">
            <div className="text-[11px] font-bold text-[#68736d] uppercase tracking-wider mb-[10px]">Your Referral Link</div>
            <div className="flex border border-black/10 rounded-[12px] overflow-hidden bg-[#f7f9f7]">
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                className="flex-1 min-w-0 bg-transparent px-[15px] text-[13px] text-ink outline-none font-medium" 
              />
              <button 
                onClick={handleCopyLink} 
                className="h-[52px] px-[24px] bg-[#182a20] text-white text-[13px] font-bold hover:bg-black transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copied!
                  </>
                ) : (
                  'Copy Link'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Action */}
        <div className="pt-[15px] border-t border-black/5 flex items-center justify-between flex-wrap gap-[15px]">
          <p className="text-[13px] text-[#68736d]">Instantly invite family, clients, or friends over WhatsApp:</p>
          <a 
            href={whatsappHref} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center justify-center h-[42px] px-[22px] rounded-full bg-[#25D366] text-white text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Share on WhatsApp
          </a>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[30px]">
          <div className="bg-white border border-black/5 rounded-[20px] p-[25px] shadow-sm">
            <div className="text-[13px] text-[#68736d] font-bold uppercase tracking-wider mb-[5px]">Total Signups</div>
            <div className="font-manrope text-[32px] tracking-[-0.03em] text-ink leading-none">{totalSignups}</div>
          </div>
          <div className="bg-white border border-black/5 rounded-[20px] p-[25px] shadow-sm">
            <div className="text-[13px] text-[#68736d] font-bold uppercase tracking-wider mb-[5px]">Successful Investors</div>
            <div className="font-manrope text-[32px] tracking-[-0.03em] text-ink leading-none">{successfulReferrals}</div>
          </div>
        </div>

        <h2 className="font-manrope text-[24px] tracking-[-0.03em] text-ink mb-[20px]">Your Network</h2>
        
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          {referredUsers.length === 0 ? (
            <div className="p-[40px] text-center">
              <p className="text-[15px] text-[#68736d]">You haven't invited anyone yet.</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-[2fr_2fr_1.5fr] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
                <div>User</div>
                <div>Date Joined</div>
                <div>Status</div>
              </div>
              <div className="divide-y divide-black/5">
                {referredUsers.map((u: any) => {
                  const maskEmail = (email: string) => {
                    const [name, domain] = email.split('@');
                    return `${name.substring(0, 2)}***@${domain}`;
                  };

                  return (
                    <div key={u.id} className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[16px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                      <div>
                        <strong className="block text-[14px] text-ink mb-[2px]">{u.firstName} {u.lastName}</strong>
                        <span className="text-[12px] text-[#7a847f]">{maskEmail(u.email)}</span>
                      </div>
                      
                      <div className="text-[13px] text-[#68736d]">
                        <span className="lg:hidden text-[11px] text-[#7a847f] uppercase font-bold block mb-[4px]">Joined</span>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      
                      <div>
                        <span className="lg:hidden text-[11px] text-[#7a847f] uppercase font-bold block mb-[4px]">Status</span>
                        {u.hasTriggeredReferralReward ? (
                          <span className="inline-flex px-[8px] py-[4px] rounded-full bg-[#eef3ef] text-[#008b45] text-[11px] font-bold uppercase tracking-wider">
                            Invested - Paid
                          </span>
                        ) : (
                          <span className="inline-flex px-[8px] py-[4px] rounded-full bg-black/5 text-ink text-[11px] font-bold uppercase tracking-wider">
                            Pending Investment
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
