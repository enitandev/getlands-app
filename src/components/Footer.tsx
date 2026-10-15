import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#07100b] text-[#8e9a93] pt-[60px] pb-[40px] px-[22px] lg:px-[max(6vw,72px)] border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[50px]">
        {/* Company Info */}
        <div className="space-y-[15px]">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-[145px] brightness-0 invert block" />
          <p className="text-[13px] text-[#8e9a93] leading-relaxed max-w-[280px]">
            Direct physical land allocations and short-cycle agricultural commodity trading. 100% physically backed real assets in Nigeria.
          </p>
          <div className="text-[12px] text-[#b8c2bd] space-y-1 pt-2">
            <p className="font-bold text-white">Lagos Office:</p>
            <p>3rd Floor, Okedara Building, Beside Jendol Superstores, Alakuko, Lagos State.</p>
          </div>
        </div>

        {/* Opportunities */}
        <div className="space-y-[12px]">
          <h4 className="text-[12px] font-bold text-white tracking-[0.14em] uppercase">Opportunities</h4>
          <ul className="space-y-[10px] text-[13px]">
            <li><Link href="/explore" className="hover:text-white transition-colors">Marketplace Catalog</Link></li>
            <li><a href="#commodities" className="hover:text-white transition-colors">Tomato Commodity Trading</a></li>
            <li><a href="#commodities" className="hover:text-white transition-colors">Pepper & Garri Aggregation</a></li>
            <li><a href="#landbank" className="hover:text-white transition-colors">Abeokuta Land Banking</a></li>
            <li><Link href="/explore" className="hover:text-white transition-colors">Ilewo Orile Freehold Land</Link></li>
          </ul>
        </div>

        {/* Partners & Platform */}
        <div className="space-y-[12px]">
          <h4 className="text-[12px] font-bold text-white tracking-[0.14em] uppercase">Partners & Agents</h4>
          <ul className="space-y-[10px] text-[13px]">
            <li><Link href="/partners" className="text-[#36bf76] font-bold hover:underline">Become a Sales Agent ↗</Link></li>
            <li><Link href="/agent" className="hover:text-white transition-colors">Agent Portal Login</Link></li>
            <li><Link href="/partners" className="hover:text-white transition-colors">Commission Structure</Link></li>
            <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Investor Portfolio</Link></li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="space-y-[12px]">
          <h4 className="text-[12px] font-bold text-white tracking-[0.14em] uppercase">Support & Direct Line</h4>
          <ul className="space-y-[10px] text-[13px]">
            <li>
              <a href="https://wa.me/2349133485636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-bold hover:text-[#36bf76] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#36bf76]"></span>
                WhatsApp: +234 913 348 5636
              </a>
            </li>
            <li><a href="mailto:hello@getlands.ng" className="hover:text-white transition-colors">hello@getlands.ng</a></li>
            <li className="pt-2">
              <Link href="/login" className="inline-block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold transition-colors">
                Client Portal Sign In ↗
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-[30px] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-[15px] text-[11px] text-[#6b7670]">
        <p>© 2026 Getlands Real-Asset Marketplace. All rights reserved.</p>
        <div className="flex gap-[20px]">
          <Link href="/explore" className="hover:text-white transition-colors">Marketplace</Link>
          <Link href="/partners" className="hover:text-white transition-colors">Partners</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <a href="https://getlands.ng" className="hover:text-white transition-colors">getlands.ng</a>
        </div>
      </div>
    </footer>
  );
}
