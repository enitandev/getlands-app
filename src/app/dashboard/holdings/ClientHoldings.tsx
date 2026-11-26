"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { uploadTransactionReceiptAction } from '@/app/actions/checkout';
import { toast } from '@/components/ui/Toast';
import Link from "next/link";

export default function ClientHoldings({ holdings }: { holdings: any[] }) {
  const router = useRouter();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleUploadProof = async (holding: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ref = holding.paymentReference || holding.referenceCode || `HLD-${holding.id.slice(0, 8).toUpperCase()}`;
    setUploadingId(holding.id);
    try {
      const fd = new FormData();
      fd.append('reference', ref);
      fd.append('receipt', file);
      const res = await uploadTransactionReceiptAction(fd);
      if (res.error) {
        toast(res.error, 'error');
      } else {
        toast('Proof of payment uploaded successfully!', 'success');
        router.refresh();
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to upload receipt', 'error');
    } finally {
      setUploadingId(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-[30px]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px]">
        <div>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none">
            Your Holdings
          </h1>
        </div>
        <Button href="/explore" variant="primary">Acquire more</Button>
      </section>

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[18px] p-[18px_22px] flex flex-col sm:flex-row sm:items-center justify-between gap-[14px] shadow-sm">
        <div>
          <strong className="block text-[14px] text-[#78350f] font-manrope mb-[2px]">
            How to Receive Your Payouts in Your Bank Account
          </strong>
          <p className="text-[13px] text-[#92400e] leading-relaxed">
            When your investment returns are credited to your Getlands Wallet, please go to your <strong>Wallet</strong> and submit a withdrawal request to get the money in your bank account. Payouts are processed within <strong>24 to 48 hours</strong> after a withdrawal request is made.
          </p>
        </div>
        <Link
          href="/dashboard/wallet?withdraw=true"
          className="px-[18px] py-[10px] bg-[#182a20] hover:bg-[#008b45] text-white text-[12px] font-bold rounded-full transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          Open Wallet to Withdraw &rarr;
        </Link>
      </div>

      <div className="bg-white border border-black/5 rounded-[24px] overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_140px] gap-[20px] p-[20px_30px] bg-[#fcfdfc] border-b border-black/5 text-[12px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Opportunity</div>
          <div>Category &amp; Status</div>
          <div>Acquired</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Action</div>
        </div>

        {/* Holdings List */}
        <div className="divide-y divide-black/5">
          {holdings.map(holding => {
            const isPending = holding.status === 'pending';
            const ref = holding.paymentReference || holding.referenceCode;
            return (
              <div key={holding.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_140px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_30px] items-center hover:bg-[#fcfdfc] transition-colors">
                <div className="flex gap-[16px] items-center">
                  <div className="hidden lg:flex w-[44px] h-[44px] rounded-full bg-[#eef3ef] text-[#008b45] items-center justify-center font-bold text-[10px] tracking-[0.1em] uppercase shrink-0">
                    {holding.opportunity.category.substring(0, 4)}
                  </div>
                  <div>
                    <strong className="block text-[16px] text-ink">{holding.opportunity.title}</strong>
                    <span className="text-[12px] text-[#7a847f]">{holding.opportunity.location}</span>
                    {ref && (
                      <div className="flex items-center gap-[10px] mt-[4px] flex-wrap">
                        <span className="text-[11px] font-mono text-[#68736d]">Ref: {ref}</span>
                        {!ref.startsWith('INV-W-') && (
                          <a
                            href={`/api/receipt/${encodeURIComponent(ref)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-[#008b45] hover:underline"
                          >
                            View Receipt ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                  <span className="lg:hidden text-[#7a847f]">Status:</span>
                  <div className="flex flex-col lg:items-start items-end gap-[4px]">
                    <span className="capitalize">{holding.opportunity.category.replace('_', ' ')}</span>
                    <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                      isPending ? 'bg-[#fff8e1] text-[#d48806]' : 'bg-[#eef3ef] text-[#008b45]'
                    }`}>
                      {isPending ? 'Pending Verification' : holding.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                  <span className="lg:hidden text-[#7a847f]">Date:</span>
                  {new Date(holding.dateAcquired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <div className="flex justify-between lg:block lg:text-right">
                  <span className="lg:hidden text-[13px] text-[#7a847f]">Amount:</span>
                  <strong className="text-[16px] text-ink">{formatCurrency(holding.totalAmount)}</strong>
                </div>

                <div className="text-right mt-[10px] lg:mt-0 flex lg:flex-col items-center lg:items-end justify-end gap-[8px]">
                  {isPending && (
                    <label className="px-[10px] py-[5px] rounded-full bg-[#f4f7f5] hover:bg-[#eef3ef] text-[11px] font-bold text-[#182a20] cursor-pointer transition-colors whitespace-nowrap">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleUploadProof(holding, e)}
                        disabled={uploadingId === holding.id}
                      />
                      {uploadingId === holding.id ? 'Uploading...' : 'Upload Proof'}
                    </label>
                  )}
                  <Link href={`/dashboard/holdings/${holding.id}`} className="text-[13px] font-bold text-[#008b45] hover:underline">
                    Manage
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
