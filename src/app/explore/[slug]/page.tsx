import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ClientCheckoutCard from './ClientCheckoutCard';

export default async function OpportunityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const formatDuration = (val: string | null) => {
    if (!val) return 'N/A';
    const isNumeric = /^\d+$/.test(val.trim());
    return isNumeric ? `${val} MONTHS` : val;
  };

  const opp = await prisma.opportunity.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!opp) {
    return <div className="min-h-screen grid place-items-center text-ink text-[18px]">Opportunity not found.</div>;
  }

  return (
    <main className="min-h-screen bg-white font-manrope">
      <header className="fixed z-50 top-[10px] lg:top-[18px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] lg:w-[min(1480px,calc(100%-72px))] h-[60px] lg:h-[68px] flex items-center justify-between">
        <Link href="/" className="brand block w-[120px] lg:w-[143px]">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
        </Link>
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-[2px] p-[5px] bg-white/78 backdrop-blur-[22px] border border-black/5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <Link href="/explore" className="px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] hover:bg-[#eef3ef] transition-colors">← Back to Marketplace</Link>
        </nav>
      </header>

      <section className="pt-[110px] lg:pt-[130px] px-[22px] lg:px-[max(6vw,72px)] pb-[60px] max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[60px]">
          
          {/* LEFT SIDE: Image Gallery */}
          <div className="lg:w-1/2">
            <div className="w-full h-[400px] lg:h-[700px] rounded-[30px] overflow-hidden bg-cover bg-center sticky top-[100px]" style={{ backgroundImage: `url(${opp.coverImage})` }} />
          </div>
          
          {/* RIGHT SIDE: Content & Checkout */}
          <div className="lg:w-1/2 pt-4">
            <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#008b45] uppercase mb-[15px]">{opp.category.replace('_', ' ')}</div>
            <h1 className="font-manrope text-[40px] lg:text-[56px] font-extrabold tracking-[-0.04em] leading-[1.1] mb-[24px] text-[#1a1a1a]">{opp.title}</h1>
            
            {/* Dynamic Description preserving whitespace */}
            <div className="text-[16px] text-[#68736d] leading-[1.7] mb-[40px] whitespace-pre-wrap">
              {opp.description || (opp.category === 'land' ? 'Acquire premium real-estate verified by our expert team. Perfect for residential or commercial development.' : 
               opp.category === 'farm' ? 'Participate in this managed agricultural cycle. We handle operations, you participate in the outcome.' : 
               'A structured land banking opportunity designed for a defined holding period with a clear stated exit value.')}
            </div>
            
            <h3 className="font-manrope text-[20px] font-bold tracking-[-0.03em] mb-[20px] border-b border-gray-100 pb-[15px] text-[#1a1a1a]">Quick Facts</h3>
            <ul className="space-y-[16px] text-[15px] mb-[40px]">
              <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Location:</span> <b className="text-[#1a1a1a]">{opp.location}, {opp.state}</b></li>
              <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Status:</span> <b className="capitalize text-[#1a1a1a]">{opp.status.replace('_', ' ')}</b></li>
              
              {opp.category === 'land' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Land Size:</span> <b className="text-[#1a1a1a]">{opp.landSize}</b></li>
                  <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Documentation:</span> <b className="text-[#1a1a1a]">{opp.documentationStatus}</b></li>
                </>
              )}
              
              {opp.category === 'farm' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Duration:</span> <b className="text-[#1a1a1a]">{formatDuration(opp.duration)}</b></li>
                  <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Target Return:</span> <b className="text-[#008b45]">{opp.projectedReturn} {opp.returnsFrequency ? `(${opp.returnsFrequency})` : ""}</b></li>
                </>
              )}

              {opp.category === 'land_banking' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[140px] text-[#7a847f]">Holding Period:</span> <b className="text-[#1a1a1a]">{formatDuration(opp.duration)}</b></li>
                </>
              )}
            </ul>

            {/* Interactive Checkout Card */}
            <ClientCheckoutCard opp={opp} />
          </div>

        </div>
      </section>
    </main>
  );
}
