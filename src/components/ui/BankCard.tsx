import React from 'react';

interface BankCardProps {
  status: string;
  acquireAmount: string;
  exitAmount: string;
  months: string;
  size: string;
  location: string;
  className?: string;
}

export function BankCard({ status, acquireAmount, exitAmount, months, size, location, className = '' }: BankCardProps) {
  return (
    <div className={`bank-card absolute left-[8%] top-[30%] w-[500px] bg-white/95 border border-black/5 rounded-[27px] p-[28px] shadow-[0_35px_80px_rgba(22,55,36,0.2)] rotate-2 ${className}`}>
      <div className="flex justify-between items-center">
        <small className="text-[9px] tracking-[0.13em] text-[#008b45] font-extrabold uppercase">
          LAND BANKING · {location.toUpperCase()}
        </small>
        <b className="text-[9px] text-[#008b45] bg-[#e8f5ec] rounded-full px-[9px] py-[7px]">
          {status.toUpperCase()}
        </b>
      </div>
      
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[22px] my-[55px] mb-[38px]">
        <div>
          <span className="block text-[9px] text-[#7b8580] tracking-[0.11em] mb-[6px]">ACQUIRE</span>
          <strong className="font-manrope text-[28px] tracking-[-0.055em]">{acquireAmount}</strong>
        </div>
        <i className="not-italic text-[28px] text-[#008b45]">→</i>
        <div>
          <span className="block text-[9px] text-[#7b8580] tracking-[0.11em] mb-[6px]">STATED EXIT VALUE</span>
          <strong className="font-manrope text-[28px] tracking-[-0.055em]">{exitAmount}</strong>
        </div>
      </div>
      
      <div className="border-t border-line pt-[15px] flex justify-between text-[#77817b] text-[10px]">
        <span>{months} months</span>
        <span>{size}</span>
        <span>{location} State</span>
      </div>
    </div>
  );
}
