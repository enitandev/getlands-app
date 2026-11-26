import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export default async function ManageHoldingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  if (!session || !session.userId) redirect('/login');

  const holding = await prisma.holding.findUnique({
    where: { id: resolvedParams.id },
    include: { opportunity: true, cohort: true }
  });

  if (!holding || holding.userId !== session.userId) redirect('/dashboard');

  const isLand = holding.opportunity.category === 'land';
  const isCommodity = holding.opportunity.category === 'farm';
  const isLandBanking = holding.opportunity.category === 'land_banking';

  const isPaidInFull = holding.paymentStatus !== 'installment';
  const totalContract = holding.totalContractPrice && holding.totalContractPrice > holding.totalAmount
    ? holding.totalContractPrice
    : (holding.paymentStatus === 'installment' ? holding.totalAmount * 2 : holding.totalAmount);
  const balanceDue = Math.max(0, totalContract - holding.totalAmount);

  const dateAcquired = new Date(holding.dateAcquired);
  let durationMonths = 0;
  if (holding.opportunity.duration) {
    const match = holding.opportunity.duration.match(/(\d+)\s*(MONTH|YEAR)/i);
    if (match) {
      durationMonths = parseInt(match[1]);
      if (match[2].toUpperCase().startsWith('YEAR')) durationMonths *= 12;
    }
  }
  
  durationMonths = durationMonths || 6;
  
  const maturityDate = new Date(dateAcquired);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
  
  const now = new Date();
  let monthsPassed = (now.getFullYear() - dateAcquired.getFullYear()) * 12 + (now.getMonth() - dateAcquired.getMonth());
  if (now.getDate() < dateAcquired.getDate()) monthsPassed--;
  monthsPassed = Math.max(0, Math.min(monthsPassed, durationMonths));
  
  const bars = Array.from({ length: durationMonths }).map((_, i) => {
    const isPast = i < monthsPassed;
    const isCurrent = i === monthsPassed;
    const height = 20 + ((i + 1) / durationMonths) * 80;
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
        <div className="flex items-center gap-2">
          {isLand && (
            <span className={`px-[12px] py-[6px] text-[11px] font-bold uppercase tracking-[0.05em] rounded-full ${
              isPaidInFull 
                ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]' 
                : 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
            }`}>
              {isPaidInFull ? 'Paid in Full' : 'Installment Active'}
            </span>
          )}
          <span className="hidden lg:inline-flex px-[12px] py-[6px] bg-[#eef3ef] text-[#008b45] text-[11px] font-bold uppercase tracking-[0.05em] rounded-full">
            Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {/* Performance Overview (Left 2/3) */}
        <div className="lg:col-span-2 space-y-[30px]">
          {/* Main Stats Card */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm">
            <h2 className="font-manrope text-[18px] font-bold mb-[20px]">
              {isLand ? 'Land Acquisition Details' : 'Asset Performance'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[20px] mb-[30px]">
              <div>
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">
                  {isLand && !isPaidInFull ? 'Amount Paid' : 'Initial Value'}
                </div>
                <strong className="text-[20px] font-manrope text-ink">{formatCurrency(holding.totalAmount)}</strong>
              </div>
              <div>
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">
                  {isLand ? 'Allocated Plot' : 'Current Value'}
                </div>
                <strong className="text-[20px] font-manrope text-[#008b45]">
                  {isLand ? (holding.plotNumber || 'Pending Plot No.') : formatCurrency(holding.totalAmount)}
                </strong>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">
                  {isLand ? (isPaidInFull ? 'Units / Acreage' : 'Balance Remaining') : 'Appreciation'}
                </div>
                <strong className={`text-[20px] font-manrope ${!isPaidInFull && isLand ? 'text-[#dc2626]' : 'text-[#008b45]'}`}>
                  {isLand 
                    ? (!isPaidInFull ? formatCurrency(balanceDue) : `${holding.units} ${holding.units > 1 ? 'Plots' : 'Plot'}`) 
                    : (holding.opportunity.projectedReturn || 'N/A')}
                </strong>
              </div>
            </div>

            {/* Installment Progress Bar for Land */}
            {isLand && !isPaidInFull && (
              <div className="mb-[24px] p-[16px] bg-[#fffbeb] border border-[#fde68a] rounded-[16px]">
                <div className="flex justify-between items-center text-[12px] font-bold text-[#92400e] mb-2">
                  <span>Installment Payment Completion</span>
                  <span>{Math.round((holding.totalAmount / totalContract) * 100)}%</span>
                </div>
                <div className="w-full bg-[#fef3c7] h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#008b45] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((holding.totalAmount / totalContract) * 100))}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#78350f] mt-2">
                  Agreed contract price: <strong>{formatCurrency(totalContract)}</strong>. The formal Deed of Assignment will unlock immediately once payment reaches 100%.
                </p>
              </div>
            )}

            {/* Dynamic Lifecycle Chart (Only for cycles with duration/returns) */}
            {!isLand && (
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
            )}
          </div>

          {/* Legal Documents Section with Category-Specific Documents */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">Official Legal Documents</h3>
                <p className="text-[12px] text-[#68736d]">
                  {isLand 
                    ? 'Chambers-prepared conveyancing titles, deed and allocation certificates.' 
                    : 'Certified subscription agreement and allocation certificates.'}
                </p>
              </div>
            </div>
            
            <div className="divide-y divide-black/5 p-[20px]">
              {/* Document 1: Payment Receipt (Universal) */}
              <div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#008b45]/10 text-[#008b45] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </div>
                  <div>
                    <strong className="block text-[13px] text-ink">Official Payment Receipt</strong>
                    <span className="text-[11px] text-[#68736d]">Universal financial transaction record</span>
                  </div>
                </div>
                <a href={`/api/documents/receipt/${holding.id}?t=${Date.now()}`} target="_blank" className="px-[14px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] border border-black/5 rounded-full text-[11px] font-bold text-[#008b45] transition-colors">
                  Download
                </a>
              </div>

              {/* Document 2: Category Allocation Certificate */}
              <div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-full bg-amber-50 text-[#d4af37] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  </div>
                  <div>
                    <strong className="block text-[13px] text-ink">
                      {isLand 
                        ? 'Land Allocation Certificate' 
                        : isCommodity 
                          ? 'Commodity Cycle Allocation Certificate' 
                          : 'Land Banking Allocation Certificate'}
                    </strong>
                    <span className="text-[11px] text-[#68736d]">
                      {isLand 
                        ? (holding.plotNumber ? `Allocated to ${holding.plotNumber}` : 'Official plot beneficial allocation')
                        : 'Certificate of cycle participation'}
                    </span>
                  </div>
                </div>
                <a href={`/api/documents/certificate/${holding.id}?t=${Date.now()}`} target="_blank" className="px-[14px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] border border-black/5 rounded-full text-[11px] font-bold text-[#008b45] transition-colors">
                  Download
                </a>
              </div>

              {/* Document 3: Category Legal Agreement / Deed of Assignment */}
              {isLand ? (
                isPaidInFull ? (
                  /* Land: Paid in Full -> Deed of Assignment */
                  <div className="py-[15px] flex justify-between items-center">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[36px] h-[36px] rounded-full bg-[#008b45]/15 text-[#008b45] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="block text-[13px] text-ink">Standard Deed of Assignment</strong>
                          <span className="px-2 py-0.5 bg-[#ecfdf5] text-[#065f46] text-[10px] font-bold rounded-full border border-[#a7f3d0]">
                            Verified &amp; Executed
                          </span>
                        </div>
                        <span className="text-[11px] text-[#68736d]">
                          The Bridge Chambers • Chief Wakeel O. Liady • NBA Seal Included
                        </span>
                      </div>
                    </div>
                    <a href={`/api/documents/agreement/${holding.id}?t=${Date.now()}`} target="_blank" className="px-[14px] py-[6px] bg-[#008b45] text-white hover:bg-[#007339] rounded-full text-[11px] font-bold shadow-sm transition-colors">
                      Download Deed
                    </a>
                  </div>
                ) : (
                  /* Land: Installment -> Contract of Sale & Locked Deed */
                  <>
                    <div className="py-[15px] flex justify-between items-center">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="block text-[13px] text-ink">Contract of Sale &amp; Allocation Terms</strong>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                              Active Installment
                            </span>
                          </div>
                          <span className="text-[11px] text-[#68736d]">
                            Governing installment land acquisition and beneficial reservation
                          </span>
                        </div>
                      </div>
                      <a href={`/api/documents/agreement/${holding.id}?t=${Date.now()}`} target="_blank" className="px-[14px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] border border-black/5 rounded-full text-[11px] font-bold text-[#008b45] transition-colors">
                        Download
                      </a>
                    </div>

                    <div className="py-[15px] flex justify-between items-center opacity-75 bg-[#fafafa] -mx-[20px] px-[20px]">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="block text-[13px] text-gray-700">Deed of Assignment</strong>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                              Condition Precedent: Locked
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500">
                            Issued upon 100% full payment ({formatCurrency(balanceDue)} remaining)
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 cursor-not-allowed">
                        Locked
                      </span>
                    </div>
                  </>
                )
              ) : (
                /* Commodity / Farm or Land Banking Agreement */
                <div className="py-[15px] flex justify-between items-center">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-gray-100 text-[#52525b] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    </div>
                    <div>
                      <strong className="block text-[13px] text-ink">
                        {isCommodity ? 'Commodity Cycle Subscription Agreement' : 'Land Banking Investment & Buyback Agreement'}
                      </strong>
                      <span className="text-[11px] text-[#68736d]">
                        Official signed terms and cycle return guarantees
                      </span>
                    </div>
                  </div>
                  <a href={`/api/documents/agreement/${holding.id}?t=${Date.now()}`} target="_blank" className="px-[14px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] border border-black/5 rounded-full text-[11px] font-bold text-[#008b45] transition-colors">
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel (Right 1/3) */}
        <div className="space-y-[30px]">
          {/* Liquidation / Exit Card */}
          <div className="bg-[#102218] rounded-[24px] p-[30px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-[50px] -right-[50px] w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
            
            <h3 className="font-manrope text-[18px] font-bold mb-[10px]">
              {isLand ? 'Land Ownership & Custody' : 'Maturity & Payouts'}
            </h3>
            <p className="text-[13px] text-[#8ea096] mb-[16px] leading-[1.6]">
              {isLand
                ? 'Your land parcel is secured under legal conveyancing with The Bridge Chambers. Keep your Deed of Assignment and official receipts safe.'
                : `When returns or matured capital from this ${holding.opportunity.category.replace('_', ' ')} holding are credited to your Getlands Wallet, submit a withdrawal request from your Wallet to receive the money in your bank account.`}
            </p>
            
            {!isLand && (
              <>
                <div className="bg-white/10 border border-white/10 rounded-[12px] p-[12px_14px] mb-[16px] text-[12px] text-[#a9e7bd] leading-relaxed">
                  <strong>24 to 48 Hours Payout Policy:</strong> Bank payouts are made within 24 to 48 hours after you submit a withdrawal request in your Wallet.
                </div>
                
                <div className="bg-white/10 rounded-[12px] p-[15px] mb-[20px]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#8ea096] mb-[4px]">Maturity Date</div>
                  <strong className="text-[16px] text-white block">
                    {maturityDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </strong>
                </div>

                <Link
                  href="/dashboard/wallet?withdraw=true"
                  className="block text-center w-full py-[14px] bg-white text-ink font-bold text-[14px] rounded-full hover:bg-[#eef3ef] transition-colors"
                >
                  Withdraw from Wallet to Bank
                </Link>
              </>
            )}

            {isLand && !isPaidInFull && (
              <div className="bg-white/10 border border-white/10 rounded-[12px] p-[14px] mb-[16px]">
                <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#a9e7bd] mb-[4px]">
                  Installment Outstanding
                </div>
                <strong className="text-[18px] text-white block mb-1">
                  {formatCurrency(balanceDue)}
                </strong>
                <p className="text-[12px] text-[#8ea096]">
                  Pay remaining installments directly to unlock the full 6-Page Deed of Assignment.
                </p>
              </div>
            )}
          </div>

          {/* Support Widget */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm text-center">
            <div className="w-[50px] h-[50px] rounded-full bg-[#f7f9f7] mx-auto flex items-center justify-center text-[#008b45] mb-[15px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">Need Help?</h3>
            <p className="text-[13px] text-[#68736d] mb-[20px]">Talk directly to your dedicated property advisor or Getlands support.</p>
            <Link href="/dashboard/messages" className="inline-block px-[20px] py-[10px] bg-white border border-black/10 rounded-full text-[13px] font-bold text-ink hover:bg-[#f7f9f7] transition-colors">
              Message Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
