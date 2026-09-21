import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';

export default async function ManageHoldingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  if (!session || !session.userId) redirect('/login');

  const holding = await prisma.holding.findUnique({
    where: { id: resolvedParams.id },
    include: { opportunity: true, cohort: true }
  });

  if (!holding || holding.userId !== session.userId) redirect('/dashboard');

const dateAcquired = new Date(holding.dateAcquired);
  let durationMonths = 0;
  if (holding.opportunity.duration) {
    const match = holding.opportunity.duration.match(/(\d+)\s*(MONTH|YEAR)/i);
    if (match) {
      durationMonths = parseInt(match[1]);
      if (match[2].toUpperCase().startsWith('YEAR')) durationMonths *= 12;
    }
  }
  
  // Default to 6 if no duration found
  durationMonths = durationMonths || 6;
  
  const maturityDate = new Date(dateAcquired);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
  
  const now = new Date();
  let monthsPassed = (now.getFullYear() - dateAcquired.getFullYear()) * 12 + (now.getMonth() - dateAcquired.getMonth());
  if (now.getDate() < dateAcquired.getDate()) monthsPassed--;
  monthsPassed = Math.max(0, Math.min(monthsPassed, durationMonths)); // cap between 0 and total duration
  
  const bars = Array.from({ length: durationMonths }).map((_, i) => {
    const isPast = i < monthsPassed;
    const isCurrent = i === monthsPassed;
    const height = 20 + ((i + 1) / durationMonths) * 80; // Scale from 20% to 100%
    return { isPast, isCurrent, height: `${height}%` };
  });

  return (
    <div className="space-y-[40px] max-w-[1000px] mx-auto pb-[50px]">
      <div className="flex items-center justify-between gap-[15px]">
        <div className="flex items-center gap-[15px]">
          <Link href="/dashboard/holdings" className="w-[40px] h-[40px] bg-white border border-black/10 rounded-full flex items-center justify-center text-ink hover:bg-[#f7f9f7] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <div>
            <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">{holding.opportunity.title}</h1>
            <p className="text-[13px] text-[#68736d]">Acquired on {new Date(holding.dateAcquired).toLocaleDateString()} • REF-{holding.id.substring(0,8).toUpperCase()}</p>
          </div>
        </div>
        <span className="hidden lg:inline-flex px-[12px] py-[6px] bg-[#eef3ef] text-[#008b45] text-[11px] font-bold uppercase tracking-[0.05em] rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {/* Performance Overview (Left 2/3) */}
        <div className="lg:col-span-2 space-y-[30px]">
          {/* Main Stats Card */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm">
            <h2 className="font-manrope text-[18px] font-bold mb-[20px]">Asset Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[20px] mb-[30px]">
              <div>
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Initial Value</div>
                <strong className="text-[20px] font-manrope text-ink">{formatCurrency(holding.totalAmount)}</strong>
              </div>
              <div>
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Current Value</div>
                <strong className="text-[20px] font-manrope text-[#008b45]">{formatCurrency(holding.totalAmount)}</strong>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Appreciation</div>
                <strong className="text-[20px] font-manrope text-[#008b45]">{holding.opportunity.projectedReturn || "N/A"}</strong>
              </div>
            </div>

            {/* Dynamic Lifecycle Chart */}
            <div className="h-[200px] w-full bg-[#f7f9f7] rounded-[16px] border border-black/5 flex items-end justify-between p-[20px] gap-[4px] sm:gap-[10px]">
              {bars.map((bar, i) => (
                <div key={i} className={`flex-1 rounded-t-[8px] relative transition-all duration-500 ${bar.isPast || bar.isCurrent ? 'bg-[#008b45]' : 'bg-[#008b45]/15'}`} style={{ height: bar.height, opacity: bar.isCurrent ? 1 : (bar.isPast ? 0.7 : 1) }}>
                  {bar.isCurrent && (
                    <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-bold py-[4px] px-[8px] rounded-[4px] whitespace-nowrap shadow-md z-10">
                      Today
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
              <h3 className="font-manrope text-[16px] font-bold text-ink">Associated Documents</h3>
              <Link href="/dashboard/documents" className="text-[12px] font-bold text-[#008b45] hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-black/5 p-[20px]">
              <div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <svg className="text-[#008b45]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <div>
                    <strong className="block text-[13px] text-ink">Payment Receipt</strong>
                  </div>
                </div>
                <a href={`/api/documents/receipt/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>
              </div>
<div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <svg className="text-[#d4af37]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  <div>
                    <strong className="block text-[13px] text-ink">Certificate of Subscription</strong>
                  </div>
                </div>
                <a href={`/api/documents/certificate/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>
              </div>
              <div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <svg className="text-[#52525b]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <div>
                    <strong className="block text-[13px] text-ink">Signed Memorandum of Understanding</strong>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-[#68736d] cursor-not-allowed" title="Not available yet">Pending</button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel (Right 1/3) */}
        <div className="space-y-[30px]">
          {/* Liquidation / Exit Card */}
          <div className="bg-[#102218] rounded-[24px] p-[30px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-[50px] -right-[50px] w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
            
            <h3 className="font-manrope text-[18px] font-bold mb-[10px]">Maturity & Exit</h3>
            <p className="text-[13px] text-[#8ea096] mb-[20px] leading-[1.6]">
              This {holding.opportunity.category.replace('_', ' ')} holding has a lock-in period. You can request a payout or rollover upon maturity.
            </p>
            
            <div className="bg-white/10 rounded-[12px] p-[15px] mb-[20px]">
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#8ea096] mb-[4px]">Maturity Date</div>
              <strong className="text-[16px] text-white block">
                {maturityDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </strong>
            </div>

            <button className="w-full py-[14px] bg-white text-ink font-bold text-[14px] rounded-full hover:bg-[#eef3ef] transition-colors">
              Request Exit / Payout
            </button>
          </div>

          {/* Support Widget */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm text-center">
            <div className="w-[50px] h-[50px] rounded-full bg-[#f7f9f7] mx-auto flex items-center justify-center text-[#008b45] mb-[15px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">Need Help?</h3>
            <p className="text-[13px] text-[#68736d] mb-[20px]">Talk directly to your account manager regarding this asset.</p>
            <Link href="/dashboard/messages" className="inline-block px-[20px] py-[10px] bg-white border border-black/10 rounded-full text-[13px] font-bold text-ink hover:bg-[#f7f9f7] transition-colors">
              Message Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
