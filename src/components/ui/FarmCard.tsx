import React from 'react';
import Link from 'next/link';

interface FarmCardProps {
  crop: string;
  cycle: string;
  title: string;
  location: string;
  targetReturn: string;
  returnsFrequency?: string;
  price: string;
  photoClass?: string;
  status?: string;
  imageUrl?: string;
  className?: string;
  cohortStatus?: string;
  cohortProgress?: number;
  cohortLabel?: string;
}

export function FarmCard({ crop, cycle, title, location, targetReturn, returnsFrequency, price, photoClass = '', imageUrl, className = '', cohortStatus, cohortProgress, cohortLabel }: FarmCardProps) {
  const formatDuration = (val: string) => {
    if (!val) return '';
    const isNumeric = /^\d+$/.test(val.trim());
    return isNumeric ? `${val} MONTHS` : val;
  };

  return (
    <article className={`farm-card group h-[520px] rounded-[25px] overflow-hidden relative bg-[#102218] text-white shadow-[0_28px_60px_rgba(24,53,36,0.12)] ${className}`}>
      <div 
        className={`farm-photo absolute inset-[0_0_42%_0] bg-cover bg-center transition-transform duration-[1.1s] ease-custom group-hover:scale-[1.06] ${photoClass}`} 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(4,13,8,0.05)] via-[40%] to-[#09160e] to-[69%]" />
      
      
      <div className="absolute top-[18px] left-[18px] flex gap-[8px] z-10">
        <div className="bg-white/90 text-[#213029] px-[10px] py-[7px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">
          {formatDuration(cycle)}
        </div>
        {cohortStatus && (
          <div className={`px-[10px] py-[7px] rounded-full text-[9px] font-extrabold uppercase shadow-sm ${
            cohortStatus === 'OPEN' ? 'bg-[#008b45] text-white' :
            cohortStatus === 'PRE_ORDER' ? 'bg-[#f5a623] text-white' :
            cohortStatus === 'FULL' || cohortStatus === 'SOLD_OUT' ? 'bg-[#e53935] text-white' :
            'bg-[#f7f9f7] text-[#68736d]'
          }`}>
            {cohortStatus === 'PRE_ORDER' ? 'PRE-ORDER' : cohortStatus.replace('_', ' ')}
          </div>
        )}
      </div>


      <div className="absolute left-[23px] right-[23px] bottom-[23px] z-10">
        <small className="text-[9px] tracking-[0.14em] text-[#86e2a6] font-extrabold uppercase">{crop}</small>
        <h3 className="font-manrope text-[28px] tracking-[-0.05em] my-[6px]">{title}</h3>
        <p className="text-[11px] text-[#98a69e] m-0 mb-[15px]">{location}</p>
        {cohortStatus === 'OPEN' && typeof cohortProgress === 'number' && (
          <div className="mt-[15px] mb-[5px]">
            <div className="flex justify-between text-[9px] text-[#98a69e] mb-[4px] font-bold">
              <span>{cohortLabel || 'Funding Progress'}</span>
              <span>{cohortProgress}%</span>
            </div>
            <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#a9e7bd] rounded-full" style={{ width: `${cohortProgress}%` }}></div>
            </div>
          </div>
        )}

        
        <div className="border-t border-white/15 pt-[16px] grid grid-cols-[auto_1fr_auto] items-end gap-[10px]">
          <div>
            <strong className="font-manrope text-[39px] tracking-[-0.06em] text-[#a9e7bd] leading-none">{targetReturn}</strong>
            {returnsFrequency && <span className="block text-[#a9e7bd] text-[11px] mt-[2px]">{returnsFrequency}</span>}
          </div>
          <span className="text-[9px] text-[#85928b] pb-[6px]">target return</span>
          <b className="text-[12px] pb-[6px]">
            {price} <em className="block text-[#7e8b84] not-italic text-[9px] font-normal">per slot</em>
          </b>
        </div>
      </div>
    </article>
  );
}
