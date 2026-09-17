"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { checkoutAction } from '@/app/actions/checkout';

export default function ClientCheckout({ opportunity: opp, walletBalance }: { opportunity: any, walletBalance: number }) {
  const [hasPaid, setHasPaid] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');

  const getPrice = () => {
    if (opp.category === 'land') return opp.price;
    if (opp.category === 'farm') return opp.slotPrice;
    if (opp.category === 'land_banking') return opp.acquisitionPrice;
    return 0;
  };

  const total = getPrice();

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
      <div className="flex-1">
        <h1 className="font-manrope text-3xl lg:text-4xl font-bold mb-8">Review & Pay</h1>
        
        <div className="bg-white border border-black/5 rounded-2xl p-6 mb-8">
          <h3 className="font-manrope text-xl font-bold mb-4">Personal Information</h3>
          <p className="text-sm text-gray-500">Your details are populated from your profile.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-[400px]">
        <div className="bg-white border border-black/5 rounded-2xl p-6">
          <div className="border-b border-black/5 pb-4 mb-4">
            <h3 className="font-bold text-lg">{opp.title}</h3>
            <p className="text-sm text-gray-500">{opp.location}</p>
          </div>
          
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {!hasPaid ? (
            <div>
              <h4 className="font-bold mb-4">Payment Method</h4>
              <div className="space-y-4 mb-6">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer ${paymentMethod === 'transfer' ? 'border-[#008b45] bg-[#008b45]/5' : 'border-black/10'}`}>
                  <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="w-4 h-4 accent-[#008b45]" />
                  <div>
                    <strong className="block text-sm">Direct Bank Transfer</strong>
                    <span className="text-xs text-gray-500">Manual verification</span>
                  </div>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'wallet' ? 'border-[#008b45] bg-[#008b45]/5' : 'border-black/10'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-4 h-4 accent-[#008b45]" />
                    <div>
                      <strong className="block text-sm">Pay with Wallet</strong>
                      <span className="text-xs text-gray-500">Balance: {formatCurrency(walletBalance)}</span>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'transfer' ? (
                <button onClick={() => setHasPaid(true)} className="w-full py-3 bg-[#008b45] text-white font-bold rounded-full">
                  I have made payment
                </button>
              ) : (
                <form action={async () => {
                    if (walletBalance >= total) {
                        setIsSubmitting(true);
                        const fd = new FormData();
                        fd.append("opportunityId", opp.id);
                        fd.append("paymentMethod", paymentMethod);
                        fd.append("totalAmount", total.toString());
                        await checkoutAction(fd);
                    }
                  }}>
                  <button type="submit" disabled={walletBalance < total || isSubmitting} className="w-full py-3 bg-[#008b45] text-white font-bold rounded-full disabled:opacity-50">
                    Pay from Wallet
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form action={async () => { 
                setIsSubmitting(true); 
                const fd = new FormData(); 
                fd.append("opportunityId", opp.id); 
                fd.append("paymentMethod", paymentMethod); 
                fd.append("totalAmount", total.toString()); 
                await checkoutAction(fd); 
              }} className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="font-bold mb-4">Upload Receipt</h4>
              <input type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4 block w-full text-sm" />
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setHasPaid(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-full font-bold">Back</button>
                <button type="submit" disabled={!file || isSubmitting} className="flex-[2] py-3 bg-[#008b45] text-white font-bold rounded-full disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
