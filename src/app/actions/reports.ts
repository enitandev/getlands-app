"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getAdminReports() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;

  // 1. Revenue over the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const transactions = await prisma.transaction.findMany({
    where: { 
      type: 'investment', 
      status: 'success',
      date: { gte: sixMonthsAgo }
    }
  });

  // Group by month
  const monthlyData: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyData[monthYear] = 0;
  }

  transactions.forEach(tx => {
    const monthYear = tx.date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (monthlyData[monthYear] !== undefined) {
      monthlyData[monthYear] += tx.amount;
    }
  });

  const revenueChart = Object.keys(monthlyData).map(month => ({
    name: month,
    revenue: monthlyData[month]
  }));

  // 2. Holdings by Category
  const holdings = await prisma.holding.findMany({
    where: { status: 'active' },
    include: { opportunity: true }
  });

  const categoryMap: Record<string, number> = { land: 0, farm: 0, land_banking: 0 };
  holdings.forEach(h => {
    if (categoryMap[h.opportunity.category] !== undefined) {
      categoryMap[h.opportunity.category] += h.totalAmount;
    }
  });

  const distributionChart = [
    { name: 'Land', value: categoryMap.land, color: '#008b45' },
    { name: 'Farms', value: categoryMap.farm, color: '#f5a623' },
    { name: 'Land Banking', value: categoryMap.land_banking, color: '#102218' }
  ];

  return {
    revenueChart,
    distributionChart
  };
}

export async function getCustomerReports(userId: string) {
  const holdings = await prisma.holding.findMany({
    where: { userId, status: 'active' },
    include: { opportunity: true }
  });

  const categoryMap: Record<string, number> = { land: 0, farm: 0, land_banking: 0 };
  let totalValue = 0;

  holdings.forEach(h => {
    totalValue += h.totalAmount;
    if (categoryMap[h.opportunity.category] !== undefined) {
      categoryMap[h.opportunity.category] += h.totalAmount;
    }
  });

  const distributionChart = [
    { name: 'Land', value: categoryMap.land, color: '#008b45' },
    { name: 'Farms', value: categoryMap.farm, color: '#f5a623' },
    { name: 'Land Banking', value: categoryMap.land_banking, color: '#102218' }
  ].filter(c => c.value > 0);

  return {
    totalValue,
    distributionChart
  };
}
