import React from 'react';
import Link from 'next/link';

interface MarketCardProps {
  id?: string;
  category: string;
  title: string;
  location: string;
  status?: string;
  priceOrReturn: string;
  photoClass?: string;
  imageUrl?: string;
  className?: string;
  cohortStatus?: string;
  cohortProgress?: number;
}

export function MarketCard({ category, title, location, priceOrReturn, photoClass = '', imageUrl, className = '', status, cohortStatus, cohortProgress }: MarketCardProps) {
  return (
    <article className={`absolute w-[320px] bg-white rounded-[24px] overflow-hidden shadow-[0_35px_80px_rgba(29,72,46,0.15)] border border-black/5 ${className}`}>
      <div 
        className={`h-[205px] bg-cover bg-center ${photoClass}`} 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      <div className="relative p-[18px_19px_20px] flex flex-col justify-between h-[155px]">
        <div>
          <div className="flex justify-between items-start">
            <small className="block text-[#008b45] text-[9px] tracking-[0.14em] font-extrabold uppercase mb-[4px]">{category}</small>
            {status === 'sold_out' && <span className="px-[8px] py-[3px] bg-[#e53935] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">Sold Out</span>}
          </div>
          <strong className="block font-manrope text-[21px] leading-tight text-ink mb-[4px] line-clamp-2">{title}</strong>
          <span className="text-[11px] text-[#77817c]">{location}</span>
        </div>
        <div className="text-right mt-auto">
          <b className="font-manrope text-[19px] text-ink">{priceOrReturn}</b>
        </div>
      </div>
    </article>
  );
}
