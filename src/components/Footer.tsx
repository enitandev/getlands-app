import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#07100b] text-[#8e9a93] p-[35px_22px] lg:p-[48px_max(6vw,72px)] block lg:flex items-end justify-between gap-[30px] flex-wrap">
      <div>
        <img src="/assets/getlands-logo.png" alt="Getlands" className="w-[140px] brightness-0 invert block mb-[11px]" />
        <span className="text-[10px]">Land. Farms. Opportunities.</span>
      </div>
      <nav className="my-[28px] lg:my-0 grid grid-cols-2 lg:flex lg:gap-[25px] gap-[15px] lg:order-none order-3 w-full lg:w-auto justify-between lg:justify-normal">
        <Link href="#marketplace" className="text-[#b8c2bd] text-[10px] no-underline">Marketplace</Link>
        <Link href="#how" className="text-[#b8c2bd] text-[10px] no-underline">How it works</Link>
        <Link href="#portfolio" className="text-[#b8c2bd] text-[10px] no-underline">My Getlands</Link>
        <a href="https://getlands.shop" className="text-[#b8c2bd] text-[10px] no-underline">getlands.shop ↗</a>
      </nav>
      <small className="text-[9px]">© 2026 Getlands</small>
    </footer>
  );
}
