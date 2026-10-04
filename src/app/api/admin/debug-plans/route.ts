import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const plans = await prisma.returnPlan.findMany();
  return NextResponse.json({ plans });
}
