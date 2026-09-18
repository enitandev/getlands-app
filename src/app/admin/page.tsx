import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/mockData';

export default async function AdminDashboard() {
  // Fetch aggregations
  const successTx = await prisma.transaction.aggregate({
    where: { type: 'investment', status: 'success' },
    _sum: { amount: true }
  });
  const totalRevenue = successTx._sum.amount || 0;

  const activeHoldings = await prisma.holding.count({ where: { status: 'active' } });
  const availableOpps = await prisma.opportunity.count({ where: { status: 'available' } });
  const pendingActions = await prisma.transaction.count({ where: { status: 'pending' } });

  // Fetch lists
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { user: true }
  });

  const activeFarms = await prisma.opportunity.findMany({
    where: { category: 'farm', status: 'available' },
    take: 4
  });

  return (
    <div className="space-y-[30px]">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Total Revenue</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Active Holdings</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">{activeHoldings}</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Available Opps</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">{availableOpps}</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(245,166,35,0.15)] border border-[#f5a623]/30">
          <div className="text-[12px] text-[#d48806] uppercase tracking-[0.05em] font-bold mb-[10px] flex justify-between">
            Pending Actions
            <span className="w-[18px] h-[18px] bg-[#f5a623] text-white rounded-full flex items-center justify-center text-[10px]">{pendingActions}</span>
          </div>
          <div className="space-y-[8px] mt-[15px]">
            <Link href="/admin/finance" className="block text-[13px] font-bold text-ink hover:text-[#008b45]">
              {pendingActions} Manual Payment Verifications
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
        {/* Recent Transactions */}
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 flex justify-between items-center">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Recent Transactions</h3>
            <Link href="/admin/finance" className="text-[13px] text-[#008b45] font-bold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-black/5 max-h-[400px] overflow-y-auto">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="p-[15px_24px] flex items-center justify-between hover:bg-[#f7f9f7] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{tx.user.firstName} {tx.user.lastName}</strong>
                  <span className="text-[12px] text-[#68736d] capitalize">{tx.type} • {tx.reference}</span>
                </div>
                <div className="text-right">
                  <strong className="block text-[14px] text-ink">{formatCurrency(tx.amount)}</strong>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.05em] ${tx.status === 'success' ? 'text-[#008b45]' : tx.status === 'pending' ? 'text-[#f5a623]' : 'text-[#e53935]'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="p-[24px] text-center text-[#68736d] text-[13px]">No transactions yet.</div>
            )}
          </div>
        </div>

        {/* Active Farm Cycles */}
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 flex justify-between items-center">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Active Farm Cycles</h3>
            <Link href="/admin/marketplace" className="text-[13px] text-[#008b45] font-bold hover:underline">Manage</Link>
          </div>
          <div className="p-[24px] space-y-[20px]">
            {activeFarms.map(farm => (
              <div key={farm.id}>
                <div className="flex justify-between mb-[8px]">
                  <strong className="text-[14px] text-ink">{farm.title}</strong>
                  <span className="text-[12px] text-[#68736d]">{farm.duration || 'N/A'}</span>
                </div>
                <div className="w-full h-[6px] bg-[#eef3ef] rounded-full overflow-hidden">
                  <div className="h-full bg-[#008b45] w-[50%] rounded-full"></div>
                </div>
              </div>
            ))}
            {activeFarms.length === 0 && (
              <div className="text-center text-[#68736d] text-[13px]">No active farm cycles.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
