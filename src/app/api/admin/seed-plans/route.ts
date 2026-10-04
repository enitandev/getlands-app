import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== 'seed-plans-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure global settings has tradingFeePercentage
  let settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  if (!settings) {
    settings = await prisma.platformSetting.create({ data: { id: 'global' } });
  }

  // Create the 3 plans
  const plans = [
    { name: 'Monthly', ratePercent: 5.0, intervalMonths: 1, badge: null, sortOrder: 1 },
    { name: 'Bi-Monthly', ratePercent: 12.0, intervalMonths: 2, badge: 'Most Popular', sortOrder: 2 },
    { name: 'Quarterly', ratePercent: 20.0, intervalMonths: 3, badge: 'Best Value', sortOrder: 3 },
  ];

  for (const p of plans) {
    const existing = await prisma.returnPlan.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.returnPlan.create({ data: p });
    } else {
      await prisma.returnPlan.update({ where: { id: existing.id }, data: p });
    }
  }

  return NextResponse.json({ success: true, message: "Plans seeded" });
}
