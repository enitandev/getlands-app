import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);

export default async function TeamPage() {
  const session = await getSession();
  const agentId = session?.userId as string;

  // Find all sub-agents (users with role 'sales' referred by this agent)
  const subAgentsData = await prisma.user.findMany({
    where: { referredById: agentId, role: 'sales' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true
    }
  });

  // Get client counts manually
  const clientCounts = await prisma.user.groupBy({
    by: ['referredById'],
    where: { referredById: { in: subAgentsData.map(sa => sa.id) } },
    _count: { id: true }
  });
  
  const clientCountMap: Record<string, number> = {};
  for (const c of clientCounts) {
    if (c.referredById) clientCountMap[c.referredById] = c._count.id;
  }

  // Find Tier 2 commissions earned by this agent
  const tier2Commissions = await prisma.commission.findMany({
    where: { agentId, tierLevel: 2 },
    select: { amount: true, status: true, holding: { select: { user: { select: { referredById: true } } } } }
  });

  const earnedBySubAgent: Record<string, number> = {};
  let totalTier2Earned = 0;

  for (const c of tier2Commissions) {
    if (c.status !== 'VOID') {
      const subAgentId = c.holding?.user?.referredById;
      if (subAgentId) {
        earnedBySubAgent[subAgentId] = (earnedBySubAgent[subAgentId] || 0) + c.amount;
      }
      totalTier2Earned += c.amount;
    }
  }

  const subAgents = subAgentsData.map(sa => ({
    ...sa,
    clientCount: clientCountMap[sa.id] || 0,
    earnedForMe: earnedBySubAgent[sa.id] || 0
  }));

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      
      <header className="mb-[30px] shrink-0">
        <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">My Team</h1>
        <p className="text-[14px] text-[#68736d]">Manage your sub-agents and track Tier 2 override commissions.</p>
      </header>

      <div className="bg-[#182a20] rounded-[24px] p-[30px] flex flex-col justify-center relative overflow-hidden mb-[30px] shrink-0">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-[#a6baa9] text-[13px] font-bold tracking-wider uppercase mb-[5px] relative z-10">Total Team Earnings (1.5% Override)</h2>
        <div className="text-[32px] font-manrope font-bold text-white leading-none relative z-10">
          {formatCurrency(totalTier2Earned)}
        </div>
      </div>

      <div className="flex-1 bg-white border border-black/5 rounded-[24px] overflow-hidden flex flex-col min-h-[400px]">
        {subAgents.length === 0 ? (
          <div className="p-[60px] text-center">
            <h3 className="text-[16px] font-bold text-ink mb-[5px]">No sub-agents yet</h3>
            <p className="text-[13px] text-[#68736d]">When someone signs up using your link and is approved as a Sales Agent, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 overflow-y-auto">
            {subAgents.map(sa => (
              <div key={sa.id} className="p-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-[15px] hover:bg-[#fcfdfc] transition-colors">
                <div className="flex items-center gap-[12px] min-w-0">
                  <div className="w-[40px] h-[40px] rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-[13px] shrink-0 border border-amber-100">
                    {sa.firstName[0]}{sa.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[14px] text-ink truncate">{sa.firstName} {sa.lastName}</div>
                    <div className="text-[12px] text-[#68736d] truncate">{sa.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-[20px] sm:gap-[30px] ml-[52px] sm:ml-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold text-[#7a847f] uppercase tracking-wider mb-[2px]">Clients</div>
                    <div className="font-bold text-[14px] text-ink">{sa.clientCount}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-[#7a847f] uppercase tracking-wider mb-[2px]">Earned for you</div>
                    <div className="font-bold text-[14px] text-[#008b45]">{formatCurrency(sa.earnedForMe)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
