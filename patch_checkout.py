with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write("""\"use client\";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { checkoutAction } from '@/app/actions/checkout';
import { toast } from '@/components/ui/Toast';

export default function ClientCheckout({ opportunity: opp, walletBalance, user }: { opportunity: any, walletBalance: number, user?: any }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer state (25 minutes)
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  useEffect(() => {
    if (paymentMethod === 'transfer' && step === 1) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getPrice = () => {
    if (opp.category === 'land') return opp.price;
    if (opp.category === 'farm') return opp.slotPrice;
    if (opp.category === 'land_banking') return opp.acquisitionPrice;
    return 0;
  };

  const total = getPrice();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Account number copied to clipboard', 'success');
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("opportunityId", opp.id);
    fd.append("paymentMethod", paymentMethod);
    fd.append("totalAmount", total.toString());
    
    // In a real app we would upload the receipt to Supabase Storage here
    // if (file) { ... upload logic ... fd.append("receiptUrl", url) }

    await checkoutAction(fd);
    // checkoutAction handles redirect to /checkout/success
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8">
      
      {/* LEFT COLUMN - MAIN CONTENT */}
      <div className="flex-1">
        <h1 className="font-manrope text-3xl lg:text-[40px] font-bold mb-8 text-[#1a1a1a] tracking-tight">
          {step === 1 ? 'Review & Pay' : 'Confirm Payment'}
        </h1>
        
        {step === 1 && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-manrope text-[18px] font-bold mb-4 text-[#1a1a1a]">Personal Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4f7f5] rounded-full flex items-center justify-center text-[#008b45] font-bold text-lg">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-[#1a1a1a] text-[15px]">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[14px] text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-manrope text-[18px] font-bold mb-4 text-[#1a1a1a]">Payment Method</h3>
              <div className="space-y-4">
                <label className={`flex items-start gap-4 p-5 border-2 rounded-[16px] cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-[#008b45] bg-[#008b45]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="w-5 h-5 mt-0.5 accent-[#008b45]" />
                  <div className="flex-1">
                    <strong className="block text-[15px] text-[#1a1a1a] mb-1">Bank Transfer</strong>
                    <span className="text-[13px] text-gray-500">Pay directly into our corporate bank account. Manual verification required.</span>
                    
                    {/* Bank Transfer Details (Expands when selected) */}
                    {paymentMethod === 'transfer' && (
                      <div className="mt-6 p-6 bg-white border border-gray-200 rounded-[12px] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-[14px] font-bold text-[#1a1a1a]">Transfer Details</span>
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[13px] font-bold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            {formatTime(timeLeft)}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-[13px] text-gray-500">Bank Name</span>
                            <span className="text-[14px] font-bold text-[#1a1a1a]">Guaranty Trust Bank (GTB)</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-[13px] text-gray-500">Account Number</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[18px] font-manrope font-extrabold text-[#008b45] tracking-widest">0123456789</span>
                              <button type="button" onClick={() => handleCopy('0123456789')} className="text-gray-400 hover:text-[#008b45] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-[13px] text-gray-500">Account Name</span>
                            <span className="text-[14px] font-bold text-[#1a1a1a]">Getlands Tech Limited</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-[13px] flex items-start gap-2">
                          <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                          Please ensure you transfer the exact amount of {formatCurrency(total)}.
                        </div>
                      </div>
                    )}
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 border-2 rounded-[16px] cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-[#008b45] bg-[#008b45]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                  <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-5 h-5 mt-0.5 accent-[#008b45]" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <strong className="block text-[15px] text-[#1a1a1a] mb-1">Pay with Wallet</strong>
                      <span className="text-[14px] font-bold text-[#008b45]">{formatCurrency(walletBalance)}</span>
                    </div>
                    <span className="text-[13px] text-gray-500">Instant processing with zero fees.</span>
                    
                    {paymentMethod === 'wallet' && walletBalance < total && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-[13px] flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        Insufficient balance. Please fund your wallet or use Bank Transfer.
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#eef3ef] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="text-[#008b45]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h3 className="font-manrope text-[24px] font-bold mb-2 text-[#1a1a1a]">Upload Proof of Payment</h3>
            <p className="text-[14px] text-gray-500 mb-8 max-w-[400px] mx-auto">
              Please upload a clear screenshot of your bank transfer receipt. Our team will verify the payment and allocate your asset within 24 hours.
            </p>
            
            <div className="max-w-[400px] mx-auto">
              <label className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-300 rounded-[16px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <div className="text-center">
                      <svg className="w-10 h-10 text-[#008b45] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-sm font-semibold text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-400 group-hover:text-[#008b45] transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-[#008b45]">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>

              <button onClick={() => setStep(1)} className="text-[14px] font-bold text-gray-500 hover:text-[#1a1a1a] transition-colors">
                ← Go back to transfer details
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* RIGHT COLUMN - ORDER SUMMARY */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm sticky top-[100px]">
          <h3 className="font-manrope text-[18px] font-bold mb-6 text-[#1a1a1a]">Order Summary</h3>
          
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
              <img src={opp.coverImage} alt={opp.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-[#1a1a1a] line-clamp-1">{opp.title}</h4>
              <p className="text-[13px] text-gray-500 line-clamp-1">{opp.location}</p>
              <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded-md">
                {opp.category.replace('_', ' ')}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 pb-2 space-y-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-[#1a1a1a]">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Processing Fee</span>
              <span className="font-bold text-[#008b45]">Free</span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-[15px] font-bold text-[#1a1a1a]">Total</span>
              <span className="text-[24px] font-manrope font-extrabold text-[#1a1a1a] leading-none">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {step === 1 ? (
            paymentMethod === 'transfer' ? (
              <button onClick={() => setStep(2)} className="w-full h-[54px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-all shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                I have made payment
              </button>
            ) : (
              <button 
                onClick={handleSubmitPayment}
                disabled={walletBalance < total || isSubmitting} 
                className="w-full h-[54px] bg-[#008b45] text-white font-bold rounded-full disabled:opacity-50 hover:bg-[#007339] transition-all shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {isSubmitting ? 'Processing...' : 'Pay from Wallet'}
              </button>
            )
          ) : (
            <button 
              onClick={handleSubmitPayment}
              disabled={!file || isSubmitting} 
              className="w-full h-[54px] bg-[#008b45] text-white font-bold rounded-full disabled:opacity-50 hover:bg-[#007339] transition-all shadow-[0_8px_20px_rgba(0,139,69,0.2)] flex items-center justify-center gap-2">
              {isSubmitting ? 'Submitting...' : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Submit Payment
                </>
              )}
            </button>
          )}
          
          <p className="text-center text-[12px] text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Secure encrypted transaction
          </p>
        </div>
      </div>
    </div>
  );
}
""")
