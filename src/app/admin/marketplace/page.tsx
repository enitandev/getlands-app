import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/mockData';
import ClientAdminMarketplaceDelete from './ClientAdminMarketplaceDelete';

export default async function AdminMarketplace() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-[30px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[20px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Marketplace Management</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage land, farms, and structured opportunities visible to customers.</p>
        </div>
        <Link href="/admin/marketplace/create" className="flex items-center justify-center w-full lg:w-auto px-[24px] py-[14px] lg:py-[12px] bg-[#008b45] text-white text-[14px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
          + Create Opportunity
        </Link>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Opportunity</div>
          <div>Category</div>
          <div>Price / Target</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-black/5">
          {opportunities.map(opp => {
            let priceDisplay = '';
            if (opp.category === 'land') priceDisplay = formatCurrency(opp.price || 0);
            if (opp.category === 'farm') priceDisplay = `${opp.projectedReturn || '0'} / ${formatCurrency(opp.slotPrice || 0)}`;
            if (opp.category === 'land_banking') priceDisplay = formatCurrency(opp.acquisitionPrice || 0);

            return (
              <div key={opp.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_80px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[16px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div className="flex gap-[15px] items-center">
                  <div className="w-[40px] h-[40px] rounded-[8px] bg-cover bg-center shrink-0 border border-black/5" style={{ backgroundImage: `url(${opp.coverImage})` }}></div>
                  <div>
                    <strong className="block text-[14px] text-ink">{opp.title}</strong>
                    <span className="text-[12px] text-[#68736d] truncate">{opp.location}, {opp.state}</span>
                  </div>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                  <span className="lg:hidden text-[#7a847f]">Category:</span>
                  <span className="inline-flex px-[8px] py-[2px] bg-[#eef3ef] text-[#008b45] text-[10px] font-bold uppercase tracking-[0.05em] rounded-full">
                    {opp.category.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                  <span className="lg:hidden text-[#7a847f]">Price / Target:</span>
                  <strong className="text-[13px] text-ink">{priceDisplay}</strong>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                  <span className="lg:hidden text-[#7a847f]">Status:</span>
                  <span className={`inline-flex px-[8px] py-[2px] text-[10px] font-bold uppercase tracking-[0.05em] rounded-full ${
                    opp.status === 'available' ? 'bg-[#f7f9f7] text-[#68736d] border border-black/10' : 'bg-[#fdeeee] text-[#e53935]'
                  }`}>
                    {opp.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mt-[10px] lg:mt-0 text-right">
                  <div className="flex justify-end items-center gap-[15px]">
                    <Link href={`/admin/marketplace/edit/${opp.slug}`} className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">
                      Edit
                    </Link>
                    <ClientAdminMarketplaceDelete id={opp.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
