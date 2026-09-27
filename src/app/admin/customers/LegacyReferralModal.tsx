"use client";
import React, { useState, useEffect } from 'react';
import { recordReferralRobustAction, searchCustomersForReferralAction, fetchCustomerHoldingsAction } from '@/app/actions/admin-legacy-referral';
import { toast } from '@/components/ui/Toast';

export function RecordReferralModal({ referrerUserId }: { referrerUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [holdings, setHoldings] = useState<any[]>([]);
  const [selectedHoldingId, setSelectedHoldingId] = useState<string>('');
  
  const [paymentStatus, setPaymentStatus] = useState<'offline' | 'wallet'>('offline');

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delay = setTimeout(async () => {
        const results = await searchCustomersForReferralAction(searchQuery);
        setSearchResults(results.filter(u => u.id !== referrerUserId));
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, referrerUserId]);

  useEffect(() => {
    if (selectedUser) {
      fetchCustomerHoldingsAction(selectedUser.id).then(res => {
        setHoldings(res);
        if (res.length > 0) setSelectedHoldingId(res[0].id);
      });
    } else {
      setHoldings([]);
      setSelectedHoldingId('');
    }
  }, [selectedUser]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUser || !selectedHoldingId) return toast('Please complete all fields', 'error');

    setLoading(true);
    const fd = new FormData();
    fd.append('referrerId', referrerUserId);
    fd.append('referredUserId', selectedUser.id);
    fd.append('holdingId', selectedHoldingId);
    fd.append('paymentStatus', paymentStatus);
    
    const res = await recordReferralRobustAction(fd);
    setLoading(false);
    
    if (res.error) {
      toast(res.error, 'error');
    } else {
      toast('Referral recorded successfully!', 'success');
      setIsOpen(false);
      // Reset form
      setSelectedUser(null);
      setSearchQuery('');
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  const selectedHolding = holdings.find(h => h.id === selectedHoldingId);
  const estimatedBonus = selectedHolding ? selectedHolding.totalAmount * 0.10 : 0;

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="px-[16px] py-[8px] bg-[#008b45] border border-black/10 text-white text-[12px] font-bold rounded-full hover:bg-[#007339] transition-colors">
        Record Referral
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[20px] bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[450px] rounded-[24px] p-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsOpen(false)} className="absolute top-[20px] right-[20px] w-[30px] h-[30px] rounded-full bg-[#f7f9f7] flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <h2 className="font-manrope text-[20px] font-bold text-ink mb-[5px]">Record Referral</h2>
        <p className="text-[13px] text-[#68736d] mb-[20px] leading-relaxed">
          Log a referral made by this customer to automatically calculate and credit their bonus.
        </p>

        <form onSubmit={onSubmit} className="space-y-[20px]">
          {/* Field 1: Referred User Search */}
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-[5px]">1. Search Referred Customer</label>
            {!selectedUser ? (
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type name or email..." 
                  className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] p-[12px_16px] outline-none focus:border-[#008b45] transition-colors text-[14px]" 
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-[5px] bg-white border border-black/5 shadow-lg rounded-[12px] overflow-hidden z-10 max-h-[200px] overflow-y-auto">
                    {searchResults.map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => {
                          if (u.referredById) {
                            toast('User already has a referrer', 'error');
                            return;
                          }
                          setSelectedUser(u);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className={`p-[12px_16px] cursor-pointer border-b border-black/5 last:border-0 hover:bg-[#f7f9f7] ${u.referredById ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <strong className="block text-[13px] text-ink">{u.firstName} {u.lastName}</strong>
                        <span className="text-[11px] text-[#68736d]">{u.email} {u.referredById ? '(Already referred)' : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-[12px_16px] bg-[#eef3ef] border border-[#008b45]/20 rounded-[12px]">
                <div>
                  <strong className="block text-[13px] text-[#008b45]">{selectedUser.firstName} {selectedUser.lastName}</strong>
                  <span className="text-[11px] text-[#008b45]/70">{selectedUser.email}</span>
                </div>
                <button type="button" onClick={() => setSelectedUser(null)} className="text-[11px] font-bold text-[#008b45] hover:underline">Change</button>
              </div>
            )}
          </div>

          {/* Field 2: Select Package / Investment */}
          {selectedUser && (
            <div>
              <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-[5px]">2. Select Qualifying Investment</label>
              {holdings.length === 0 ? (
                <div className="text-[13px] text-red-500 bg-red-50 p-[12px] rounded-[12px]">This customer has no active investments to calculate a bonus from.</div>
              ) : (
                <select 
                  value={selectedHoldingId} 
                  onChange={e => setSelectedHoldingId(e.target.value)}
                  className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] p-[12px_16px] outline-none focus:border-[#008b45] transition-colors text-[14px]"
                >
                  {holdings.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.opportunity.title} ({formatCurrency(h.totalAmount)})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Field 3: Payment Status */}
          {selectedUser && holdings.length > 0 && selectedHoldingId && (
            <div>
              <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-[5px]">3. Payment Status</label>
              <div className="space-y-[10px]">
                <label className={`flex items-start gap-[10px] p-[12px] rounded-[12px] border cursor-pointer transition-colors ${paymentStatus === 'offline' ? 'border-[#008b45] bg-[#eef3ef]/50' : 'border-black/5 bg-white'}`}>
                  <input type="radio" name="paymentStatus" value="offline" checked={paymentStatus === 'offline'} onChange={() => setPaymentStatus('offline')} className="mt-[3px]" />
                  <div>
                    <strong className="block text-[13px] text-ink">Already Paid Offline</strong>
                    <span className="block text-[11px] text-[#68736d]">Records a historical transaction only. Does not add to withdrawable wallet.</span>
                  </div>
                </label>
                <label className={`flex items-start gap-[10px] p-[12px] rounded-[12px] border cursor-pointer transition-colors ${paymentStatus === 'wallet' ? 'border-[#008b45] bg-[#eef3ef]/50' : 'border-black/5 bg-white'}`}>
                  <input type="radio" name="paymentStatus" value="wallet" checked={paymentStatus === 'wallet'} onChange={() => setPaymentStatus('wallet')} className="mt-[3px]" />
                  <div>
                    <strong className="block text-[13px] text-ink">Credit Wallet Now</strong>
                    <span className="block text-[11px] text-[#68736d]">Adds exactly <span className="font-bold text-[#008b45]">{formatCurrency(estimatedBonus)}</span> (10% bonus) to their active wallet.</span>
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <button type="submit" disabled={loading || !selectedUser || holdings.length === 0} className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)] disabled:opacity-50 mt-[10px]">
            {loading ? 'Processing...' : 'Confirm & Record'}
          </button>
        </form>
      </div>
    </div>
  );
}
