"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function ClientCheckoutCard({ opp, plans }: { opp: any, plans?: any[] }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plans?.[0]?.id || null);

  const getPrice = () => {
    if (opp.category === 'land') return opp.price || 0;
    if (opp.category === 'farm') return opp.slotPrice || 0;
    if (opp.category === 'land_banking') return opp.acquisitionPrice || 0;
    return 0;
  };

  const unitPrice = getPrice();
  const isFarm = opp.category === 'farm';
  const isLand = opp.category === 'land';

  const handleAcquire = () => {
    const planParam = selectedPlanId ? `&plan=${selectedPlanId}` : '';
    router.push(`/dashboard/checkout?opp=${opp.slug}&qty=${qty}${planParam}`);
  };

  const selectedPlan = plans?.find(p => p.id === selectedPlanId);
  
  // Calculate projections if it's a farm
  let totalProfit = 0;
  let numPayments = 0;
  let paymentAmount = 0;
  
  if (isFarm && selectedPlan) {
    const totalPrincipal = unitPrice * qty;
    const durationMonths = parseInt(opp.duration) || 6;
    numPayments = Math.floor(durationMonths / selectedPlan.intervalMonths);
    paymentAmount = totalPrincipal * (selectedPlan.ratePercent / 100);
    totalProfit = paymentAmount * numPayments;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] p-[30px] shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-[13px] text-gray-500 mb-[5px] font-bold">
            {isFarm ? 'Price per slot' : 'Acquisition Price'}
          </div>
          <div className="font-manrope text-[36px] font-bold tracking-[-0.05em] leading-none text-[#1a1a1a]">
            {formatCurrency(unitPrice)}
          </div>
        </div>
        
        {/* Only show stated exit value for land banking */}
        {opp.category === 'land_banking' && (
          <div className="text-right">
            <div className="text-[13px] text-gray-500 mb-[5px] font-bold">Stated Exit Value</div>
            <div className="font-manrope text-[24px] font-bold tracking-[-0.05em] text-[#008b45] leading-none">
              {formatCurrency(opp.statedExitValue || 0)}
            </div>
          </div>
        )}
      </div>

      {isFarm && plans && plans.length > 0 && (
        <div className="mb-6">
          <div className="text-[14px] font-bold text-[#1a1a1a] mb-3">Select Return Plan</div>
          <div className="grid grid-cols-3 gap-2">
            {plans.map(plan => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-[16px] border-2 transition-all ${
                    isSelected 
                      ? 'border-[#008b45] bg-[#008b45]/5' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase tracking-wider text-white bg-[#008b45] px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      {plan.badge}
                    </div>
                  )}
                  <strong className={`font-manrope text-[24px] tracking-[-0.04em] leading-none mb-1 ${isSelected ? 'text-[#008b45]' : 'text-[#1a1a1a]'}`}>
                    {plan.ratePercent}%
                  </strong>
                  <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-[#008b45]' : 'text-gray-500'}`}>
                    {plan.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Quantity Selector */}
      {opp.status === 'available' && (
        <div className="mb-6">
          <div className="flex items-center justify-between p-2 border border-gray-200 rounded-[16px] bg-gray-50">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 flex items-center justify-center text-[20px] hover:bg-gray-50 transition-colors text-ink"
            >
              -
            </button>
            <div className="flex flex-col items-center">
              <span className="font-manrope text-[18px] font-bold text-[#1a1a1a]">{qty}</span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                {isFarm ? (qty === 1 ? 'Slot' : 'Slots') : (qty === 1 ? 'Unit' : 'Units')}
              </span>
            </div>
            <button 
              onClick={() => setQty(qty + 1)}
              className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 flex items-center justify-center text-[20px] hover:bg-gray-50 transition-colors text-ink"
            >
              +
            </button>
          </div>
        </div>
      )}

      {isFarm && selectedPlan && opp.status === 'available' && (
        <div className="mb-8 p-5 bg-[#f4f7f5] rounded-[16px] border border-[#008b45]/10">
          <h4 className="font-bold text-[14px] text-[#1a1a1a] mb-4">Projected Returns</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-gray-600">You acquire ({qty} slot{qty > 1 ? 's' : ''})</span>
              <span className="font-bold text-[#1a1a1a]">{formatCurrency(unitPrice * qty)}</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-gray-600">You receive</span>
              <span className="font-bold text-[#008b45]">{formatCurrency(paymentAmount)} × {numPayments}</span>
            </div>
            <div className="flex justify-between items-center text-[14px] pt-3 border-t border-black/5">
              <span className="text-gray-600 font-bold">Total Profit</span>
              <span className="font-bold text-[#008b45] text-[16px]">{formatCurrency(totalProfit)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-black/5 text-[12px] text-gray-500 leading-[1.5]">
            <strong className="text-gray-700">Principal Return:</strong> Your initial {formatCurrency(unitPrice * qty)} will be returned at the end of the {opp.duration || '6'}-month cycle (subject to a standard platform trading fee).
          </div>
        </div>
      )}
      
      {opp.status === 'available' ? (
        <button 
          onClick={handleAcquire}
          className="w-full h-[54px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-all shadow-[0_8px_20px_rgba(0,139,69,0.2)] flex items-center justify-center gap-2"
        >
          Acquire {qty > 1 ? `${qty} ${isFarm ? 'Slots' : 'Units'} ` : 'Now '} 
          {qty > 1 && `• ${formatCurrency(unitPrice * qty)}`}
        </button>
      ) : (
        <button disabled className="w-full h-[54px] bg-gray-100 text-gray-400 font-bold rounded-full cursor-not-allowed">
          {opp.status === 'sold_out' ? 'Sold Out' : 'Currently Unavailable'}
        </button>
      )}
      <div className="text-center text-[12px] text-gray-400 mt-[15px]">
        By proceeding, you agree to the product terms and disclosures.
      </div>
    </div>
  );
}
