import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientDashboardOverview from './ClientDashboardOverview';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      holdings: {
        include: { opportunity: true, cohort: true }
      },
      notifications: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      },
      bankAccounts: true
    }
  });

  if (!user) redirect('/login');

  const hasMissingBank = (!user.accountNumber || !user.bankName) && (!user.bankAccounts || user.bankAccounts.length === 0);

  const opportunities = await prisma.opportunity.findMany({
    where: { status: { not: 'draft' } },
    orderBy: { createdAt: 'desc' },
    include: { cohorts: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  const { getActiveAnnouncements } = await import('@/app/actions/announcements');
  const dashboardAnnouncements = await getActiveAnnouncements({
    userId: user.id,
    userRole: user.role,
    kycStatus: user.kycStatus,
    hasMissingBank,
    placement: 'dashboard_card'
  });

  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  const referralBonusPercentage = settings?.agentDirectCommissionFirst ?? 5.0;

  const returnPlans = await prisma.returnPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });

  const { getCustomerReports } = await import('@/app/actions/reports');
  const reports = await getCustomerReports(user.id);

  return (
    <ClientDashboardOverview 
      user={user} 
      dashboardAnnouncements={dashboardAnnouncements} 
      opportunities={opportunities} 
      returnPlans={returnPlans} 
      referralBonusPercentage={referralBonusPercentage} 
      reports={reports} 
    />
  );
}
