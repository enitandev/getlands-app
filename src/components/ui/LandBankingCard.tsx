import React from 'react';

interface LandBankingCardProps {
  title: string;
  location: string;
  duration: string;
  entryPrice: string;
  exitPrice: string;
  status?: string;
  photoClass?: string;
  imageUrl?: string;
  className?: string;
}

export function LandBankingCard({ title, location, duration, entryPrice, exitPrice, photoClass = '', imageUrl, className = '', status }: LandBankingCardProps) {
  return (
    <article className={`absolute w-[320px] bg-[#fcf9f2] rounded-[24px] overflow-hidden shadow-[0_35px_80px_rgba(29,72,46,0.15)] border border-[#008b45]/10 ${className}`}>
      <div 
        className={`h-[180px] bg-cover bg-center relative ${photoClass}`} 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        <div className="absolute top-[15px] left-[15px] bg-white/90 text-ink px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">
          {duration}
        </div>
      </div>
      <div className="relative p-[15px_19px_15px] flex flex-col justify-between h-[180px]">
        <div>
          <div className="flex justify-between items-start">
            <small className="block text-[#008b45] text-[9px] tracking-[0.14em] font-extrabold uppercase mb-[4px]">Land Banking</small>
            {status === 'sold_out' && <span className="px-[8px] py-[3px] bg-[#e53935] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">Sold Out</span>}
          </div>
          <strong className="block font-manrope text-[18px] leading-tight text-ink mb-[2px] line-clamp-1">{title}</strong>
          <span className="text-[11px] text-[#77817c]">{location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-[10px] mt-auto border-t border-black/5 pt-[10px]">
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Entry</span>
            <b className="font-manrope text-[15px] text-ink">{entryPrice}</b>
          </div>
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Expected Exit</span>
            <b className="font-manrope text-[15px] text-[#008b45]">{exitPrice}</b>
          </div>
        </div>
      </div>
    </article>
  );
}
