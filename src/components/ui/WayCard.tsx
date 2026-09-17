import React from 'react';
import Link from 'next/link';

interface WayCardProps {
  number: string;
  action: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
  bgClass: string;
  className?: string;
}

export function WayCard({ number, action, title, description, href, linkText, bgClass, className = '' }: WayCardProps) {
  return (
    <article className={`way group h-[560px] rounded-[28px] overflow-hidden relative border border-white/10 ${className}`}>
      <div className={`way-bg absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-custom group-hover:scale-[1.07] ${bgClass}`} />
      <div className="absolute inset-auto inset-x-[28px] bottom-[28px] z-10">
        <small className="text-[9px] tracking-[0.14em] text-[#b8e4c7] font-extrabold uppercase">
          {number} · {action}
        </small>
        <h3 className="font-manrope text-[53px] tracking-[-0.06em] text-white my-[7px]">{title}</h3>
        <p className="max-w-[330px] text-[#d2dbd6] text-[13px] leading-[1.45] m-0 mb-[20px]">
          {description}
        </p>
        <Link href={href} className="text-white text-[11px] font-bold no-underline hover:underline">
          {linkText}
        </Link>
      </div>
    </article>
  );
}
