"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function ClientCheckoutCard({ opp }: { opp: any }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);

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
    router.push(`/checkout?opp=${opp.slug}&qty=${qty}`);
  };

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
      
      {/* Quantity Selector - Show for farms and land, maybe not for single land banking units unless they want it. Let's show it for all for consistency, or mainly farms. */}
      {opp.status === 'available' && (
        <div className="mb-6">
          <div className="flex items-center justify-between p-2 border border-gray-200 rounded-[16px] bg-gray-50">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 flex items-center justify-center text-[20px] hover:bg-gray-50 transition-colors"
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
              className="w-12 h-12 rounded-[12px] bg-white border border-gray-200 flex items-center justify-center text-[20px] hover:bg-gray-50 transition-colors"
            >
              +
            </button>
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
