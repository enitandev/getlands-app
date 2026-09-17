import React from 'react';

interface HeroCardProps {
  category: string;
  location: string;
  title: string;
  priceOrReturn: string;
  statusLabel: string;
  statusValue: string;
  className?: string;
}

export function HeroCard({ category, location, title, priceOrReturn, statusLabel, statusValue, className = '' }: HeroCardProps) {
  return (
    <div className={`absolute w-[250px] bg-white/90 backdrop-blur-[18px] border border-black/5 rounded-[20px] p-[18px_19px] shadow-[0_28px_60px_rgba(19,46,31,0.15)] z-10 ${className}`}>
      <small className="block text-[#008b45] text-[9px] tracking-[0.13em] font-extrabold uppercase mb-[8px]">
        {category} · {location}
      </small>
      <strong className="block font-manrope text-[22px] tracking-[-0.04em] text-ink">{title}</strong>
      <span className="block text-[#68736d] mt-[3px] text-[14px]">{priceOrReturn}</span>
      <i className="flex justify-between border-t border-line mt-[13px] pt-[10px] text-[#7b8580] text-[10px] not-italic">
        {statusLabel} <b className="text-[#008b45] font-bold">{statusValue}</b>
      </i>
    </div>
  );
}
