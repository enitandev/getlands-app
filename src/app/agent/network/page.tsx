import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

export default async function AgentClientsPage() {
  const session = await getSession();
  const agentId = session?.userId as string;

  const clients = await prisma.user.findMany({
    where: { referredById: agentId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      hasTriggeredReferralReward: true,
      holdings: {
        where: { status: { in: ['active', 'completed', 'matured'] } },
        select: { totalAmount: true }
      }
    }
  });

  // Commission this agent earned from each client's acquisitions
  const commissions = await prisma.commission.findMany({
    where: { agentId, tierLevel: 1, holdingId: { not: null } },
    select: { amount: true, status: true, holding: { select: { userId: true } } }
  });
  const earnedByClient: Record<string, number> = {};
  for (const c of commissions) {
    const uid = c.holding?.userId;
    if (uid && c.status !== 'VOID') earnedByClient[uid] = (earnedByClient[uid] || 0) + c.amount;
  }

  const rows = clients.map(c => {
    const totalAcquired = c.holdings.reduce((s, h) => s + h.totalAmount, 0);
    const status = c.holdings.length > 0
      ? (c.holdings.length > 1 ? 'Repeat Client' : 'Active Client')
      : 'Signed Up';
    return { ...c, totalAcquired, status, earned: earnedByClient[c.id] || 0 };
  });

  const activeCount = rows.filter(r => r.holdings.length > 0).length;

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      <header className="mb-[25px] shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-[15px]">
        <div>
          <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">My Clients</h1>
          <p className="text-[14px] text-[#68736d]">{rows.length} signed up · {activeCount} with acquisitions</p>
        </div>
        <Link href="/agent/draft" className="h-[42px] px-[20px] bg-[#008b45] text-white text-[13px] font-bold rounded-full flex items-center justify-center hover:bg-[#007339] transition-colors w-fit">
          Draft Portfolio for a Client
        </Link>
      </header>

      <div className="bg-white border border-black/5 rounded-[20px] overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-[40px] text-center">
            <div className="text-[14px] font-bold text-ink mb-[5px]">No clients yet</div>
            <p className="text-[13px] text-[#68736d] mb-[15px]">Share your referral link from the Overview page to get your first client.</p>
            <Link href="/agent" className="text-[#008b45] text-[13px] font-bold hover:underline">Get my referral link</Link>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {rows.map(c => (
              <div key={c.id} className="p-[18px] lg:p-[20px] flex items-center justify-between gap-[15px]">
                <div className="flex items-center gap-[12px] min-w-0">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#008b45] font-bold text-[13px] shrink-0">
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[14px] text-ink truncate">
                      {c.firstName} {c.lastName}
                      {c.role === 'sales' && <span className="ml-[8px] text-[10px] bg-amber-100 text-amber-700 px-[7px] py-[2px] rounded-full uppercase tracking-wider">Sub-agent</span>}
                    </div>
                    <div className="text-[12px] text-[#68736d] truncate">{c.email}</div>
                    <div className="text-[11px] text-[#7a847f]">Joined {new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider mb-[4px] ${c.holdings.length > 0 ? 'bg-[#eef3ef] text-[#008b45]' : 'bg-gray-100 text-gray-500'}`}>
                    {c.status}
                  </span>
                  <div className="text-[13px] font-bold text-ink">{c.totalAcquired > 0 ? formatCurrency(c.totalAcquired) : '—'}</div>
                  {c.earned > 0 && <div className="text-[11px] text-[#008b45] font-bold">You earned {formatCurrency(c.earned)}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
