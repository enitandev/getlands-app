import React from 'react';

type HoldingType = 'land' | 'pepper' | 'bank';

interface HoldingRowProps {
  type: HoldingType;
  icon: string;
  title: string;
  subtitle: string;
  value: string;
}

export function HoldingRow({ type, icon, title, subtitle, value }: HoldingRowProps) {
  const typeStyles = {
    land: "bg-[#e7f1e9] text-[#008b45]",
    pepper: "bg-[#edf2df] text-[#65814e]",
    bank: "bg-[#e9eff0] text-[#5d747a]"
  };

  return (
    <div className="holding grid grid-cols-[40px_1fr_auto_20px] items-center gap-[12px] border-t border-[#edf0ed] py-[13px]">
      <i className={`hold w-[40px] h-[40px] rounded-[12px] grid place-items-center not-italic font-extrabold font-manrope ${typeStyles[type]}`}>
        {icon}
      </i>
      <div>
        <b className="text-[12px] block">{title}</b>
        <span className="text-[10px] text-[#7a847e] block mt-[3px]">{subtitle}</span>
      </div>
      <strong className="text-[12px] text-[#008b45]">{value}</strong>
      <em className="not-italic text-[#88918c]">↗</em>
    </div>
  );
}
