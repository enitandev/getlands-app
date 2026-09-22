import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LegacyReferralModal } from '../LegacyReferralModal';

export default async function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      holdings: {
        include: {
          opportunity: true
        },
        orderBy: { dateAcquired: 'desc' }
      },
      bankAccounts: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) return notFound();

  const totalValue = user.holdings.reduce((sum, h) => sum + h.totalAmount, 0);
  const activeHoldings = user.holdings.filter(h => h.status === 'active').length;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <div className="space-y-[40px] max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between gap-[15px]">
        <div className="flex items-center gap-[15px]">
          <Link href="/admin/customers" className="w-[40px] h-[40px] bg-white border border-black/10 rounded-full flex items-center justify-center text-ink hover:bg-[#f7f9f7] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <div>
            <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Customer Profile</h1>
            <p className="text-[13px] text-[#68736d]">Detailed view of holdings and documents.</p>
          </div>
        </div>
        
        <div className="flex gap-[10px]">
          {!user.referredById && <LegacyReferralModal referredUserId={user.id} />}
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm flex flex-col md:flex-row gap-[30px] items-start">
        <div className="w-[100px] h-[100px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[32px] shrink-0 shadow-lg">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="font-manrope text-[24px] font-bold text-ink mb-[5px]">{user.firstName} {user.lastName}</h2>
          <p className="text-[14px] text-[#68736d] mb-[20px]">{user.email} {user.phoneNumber ? `• ${user.phoneNumber}` : ''} • Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] border-t border-black/5 pt-[20px]">
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Total Value</div>
              <strong className="text-[18px] text-[#008b45]">{formatCurrency(totalValue)}</strong>
            </div>
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Holdings</div>
              <strong className="text-[18px] font-manrope text-ink">{activeHoldings} Active</strong>
            </div>
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Account Status</div>
              <span className="inline-flex px-[8px] py-[2px] bg-[#eef3ef] text-[#008b45] text-[10px] font-bold uppercase tracking-[0.05em] rounded-full mt-[4px]">{user.kycStatus || 'Unverified'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[30px]">
        {/* Payout Details / Bank History */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc]">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Payout Details (Bank History)</h3>
          </div>
          <div className="divide-y divide-black/5">
            {user.bankAccounts.length === 0 && !user.bankName ? (
              <div className="p-[30px] text-center text-[13px] text-[#68736d]">No bank details saved.</div>
            ) : (
              <div className="p-[20px] space-y-[15px]">
                {/* Active Bank */}
                {user.bankAccounts.filter(b => b.status === 'active').map(bank => (
                  <div key={bank.id} className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[12px] p-[15px] flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[9px] font-bold px-[8px] py-[2px] rounded-bl-[8px] tracking-wider uppercase">Active</div>
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-ink text-[14px]">{bank.bankName}</div>
                        <div className="text-[13px] text-[#68736d] font-mono tracking-widest">{bank.accountNumber}</div>
                        <div className="text-[12px] text-[#008b45] font-bold">{bank.accountName}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Legacy Active Bank */}
                {user.bankAccounts.length === 0 && user.bankName && (
                  <div className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[12px] p-[15px] flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[9px] font-bold px-[8px] py-[2px] rounded-bl-[8px] tracking-wider uppercase">Active (Legacy)</div>
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-ink text-[14px]">{user.bankName}</div>
                        <div className="text-[13px] text-[#68736d] font-mono tracking-widest">{user.accountNumber}</div>
                        <div className="text-[12px] text-[#008b45] font-bold">{user.accountName}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retired Banks */}
                {user.bankAccounts.filter(b => b.status === 'retired').map(bank => (
                  <div key={bank.id} className="border border-gray-200 bg-gray-50 rounded-[12px] p-[15px] flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-gray-600 text-[14px]">{bank.bankName} <span className="text-[10px] bg-gray-200 px-[6px] py-[2px] rounded-full uppercase tracking-wider ml-[5px]">Retired</span></div>
                        <div className="text-[12px] text-gray-500 font-mono tracking-widest">{bank.accountNumber}</div>
                        <div className="text-[11px] text-gray-500">{bank.accountName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Holdings */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc]">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Current Holdings & Documents</h3>
          </div>
          <div className="divide-y divide-black/5">
            {user.holdings.length === 0 ? (
              <div className="p-[30px] text-center text-[13px] text-[#68736d]">No holdings found for this customer.</div>
            ) : (
              user.holdings.map(h => (
                <div key={h.id} className="p-[20px] flex flex-col lg:flex-row justify-between lg:items-center gap-[20px]">
                  <div>
                    <strong className="block text-[15px] text-ink">{h.opportunity.title}</strong>
                    <span className="text-[13px] text-[#68736d]">Acquired: {new Date(h.dateAcquired).toLocaleDateString()} • {h.units} Units</span>
                    <strong className="block text-[14px] text-[#008b45] mt-[5px]">{formatCurrency(h.totalAmount)}</strong>
                  </div>
                  
                  <div className="flex flex-col gap-[10px] lg:items-end">
                    <a href={`/api/documents/receipt/${h.id}?t=${Date.now()}`} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-[12px] font-bold text-[#008b45] hover:underline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      Official Receipt
                    </a>
                    
                    <a href={`/api/documents/agreement/${h.id}?t=${Date.now()}`} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-[12px] font-bold text-[#008b45] hover:underline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      Subscription Agreement
                    </a>
                    
                    {h.opportunity.category !== 'land-banking' && (
                      <a href={`/api/documents/certificate/${h.id}?t=${Date.now()}`} target="_blank" rel="noreferrer" className="flex items-center gap-[10px] text-[12px] font-bold text-[#008b45] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        Investment Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
