import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';

export default async function OpportunityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!opp) {
    return <div className="min-h-screen grid place-items-center text-ink text-[18px]">Opportunity not found.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="fixed z-50 top-[10px] lg:top-[18px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] lg:w-[min(1480px,calc(100%-72px))] h-[60px] lg:h-[68px] flex items-center justify-between">
        <Link href="/" className="brand block w-[120px] lg:w-[143px]">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
        </Link>
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-[2px] p-[5px] bg-white/78 backdrop-blur-[22px] border border-black/5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <Link href="/explore" className="px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] hover:bg-[#eef3ef] transition-colors">← Back to Marketplace</Link>
        </nav>
      </header>

      <section className="pt-[110px] lg:pt-[130px] px-[22px] lg:px-[max(6vw,72px)] pb-[60px]">
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[60px]">
          <div className="flex-1">
            <div className="w-full h-[350px] lg:h-[550px] rounded-[30px] overflow-hidden bg-cover bg-center mb-[40px]" style={{ backgroundImage: `url(${opp.coverImage})` }} />
            
            <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#008b45] uppercase mb-[15px]">{opp.category.replace('_', ' ')}</div>
            <h1 className="font-manrope text-[40px] lg:text-[60px] tracking-[-0.05em] leading-[1.1] mb-[20px]">{opp.title}</h1>
            <p className="text-[17px] text-[#68736d] leading-[1.6] max-w-[600px] mb-[40px]">
              {opp.category === 'land' ? 'Acquire premium real-estate verified by our expert team. Perfect for residential or commercial development.' : 
               opp.category === 'farm' ? 'Participate in this managed agricultural cycle. We handle operations, you participate in the outcome.' : 
               'A structured land banking opportunity designed for a defined holding period with a clear stated exit value.'}
            </p>
            
            <h3 className="font-manrope text-[24px] tracking-[-0.03em] mb-[20px] border-b border-line pb-[15px]">Quick Facts</h3>
            <ul className="space-y-[15px] text-[15px]">
              <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Location:</span> <b>{opp.location}, {opp.state}</b></li>
              <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Status:</span> <b className="capitalize">{opp.status.replace('_', ' ')}</b></li>
              
              {opp.category === 'land' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Land Size:</span> <b>{opp.landSize}</b></li>
                  <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Documentation:</span> <b>{opp.documentationStatus}</b></li>
                </>
              )}
              
              {opp.category === 'farm' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Duration:</span> <b>{opp.duration}</b></li>
                  <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Target Return:</span> <b className="text-[#008b45]">{opp.projectedReturn} {opp.returnsFrequency ? `(${opp.returnsFrequency})` : ""}</b></li>
                </>
              )}

              {opp.category === 'land_banking' && (
                <>
                  <li className="flex gap-[20px]"><span className="w-[120px] text-[#7a847f]">Holding Period:</span> <b>{opp.duration}</b></li>
                </>
              )}
            </ul>
          </div>
          
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-[100px] bg-white border border-black/10 rounded-[24px] p-[30px] shadow-[0_25px_60px_rgba(0,0,0,0.05)]">
              {opp.category === 'land' && (
                <>
                  <div className="text-[12px] text-[#7a847f] mb-[5px]">Acquisition Price</div>
                  <div className="font-manrope text-[40px] tracking-[-0.05em] mb-[25px]">{formatCurrency(opp.price || 0)}</div>
                </>
              )}
              {opp.category === 'farm' && (
                <>
                  <div className="text-[12px] text-[#7a847f] mb-[5px]">Price per slot</div>
                  <div className="font-manrope text-[40px] tracking-[-0.05em] mb-[25px]">{formatCurrency(opp.slotPrice || 0)}</div>
                </>
              )}
              {opp.category === 'land_banking' && (
                <>
                  <div className="text-[12px] text-[#7a847f] mb-[5px]">Acquisition Price</div>
                  <div className="font-manrope text-[32px] tracking-[-0.05em] mb-[15px]">{formatCurrency(opp.acquisitionPrice || 0)}</div>
                  <div className="text-[12px] text-[#7a847f] mb-[5px]">Stated Exit Value</div>
                  <div className="font-manrope text-[32px] text-[#008b45] tracking-[-0.05em] mb-[25px]">{formatCurrency(opp.statedExitValue || 0)}</div>
                </>
              )}
              
              {opp.status === 'available' ? (
                <Button href={`/checkout?opp=${opp.slug}`} variant="primary" className="w-full justify-center">
                  Acquire Now
                </Button>
              ) : (
                <button disabled className="w-full py-[14px] px-[28px] bg-black/5 text-[#7a847f] text-[14px] font-bold rounded-full cursor-not-allowed">
                  {opp.status === 'sold_out' ? 'Sold Out' : 'Currently Unavailable'}
                </button>
              )}
              <div className="text-center text-[11px] text-[#7a847f] mt-[15px]">
                By proceeding, you agree to the product terms and disclosures.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
