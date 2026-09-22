"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { toast } from '@/components/ui/Toast';

export default function ClientReferrals({ referralCode, totalEarned, totalSignups, successfulReferrals, referredUsers }: any) {
  const [copied, setCopied] = useState(false);
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${referralCode}` : `https://getlands.shop/register?ref=${referralCode}`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast('Referral link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-[40px]">
      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">REFER & EARN</div>
        <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
          Invite friends. Earn cash.
        </h1>
        <p className="text-[16px] text-[#68736d] max-w-[600px]">
          Share your unique link. When your friends make their first investment, a cash bonus will be instantly credited to your Getlands Wallet.
        </p>
      </section>

      <section className="bg-[#102218] text-white rounded-[24px] p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#008b45] rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col lg:flex-row gap-[40px] lg:items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="text-[13px] text-[#a6baa9] mb-[10px] font-bold uppercase tracking-wider">Your Referral Link</div>
            <div className="flex items-center gap-[15px] bg-white/5 p-[10px] pl-[20px] rounded-full border border-white/10 max-w-[500px]">
              <div className="flex-1 font-mono text-[14px] truncate text-[#86e2a6]">
                {referralLink}
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-[#008b45] hover:bg-[#007339] text-white px-[20px] py-[10px] rounded-full text-[13px] font-bold transition-colors shrink-0"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="flex gap-[40px] shrink-0">
            <div>
              <div className="text-[13px] text-[#a6baa9] mb-[5px] font-bold uppercase tracking-wider">Total Earned</div>
              <div className="font-manrope text-[32px] lg:text-[40px] tracking-[-0.03em] text-white leading-none">
                {formatCurrency(totalEarned)}
              </div>
            </div>
          </div>
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
