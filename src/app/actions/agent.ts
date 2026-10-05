"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function draftPortfolioAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) throw new Error("Unauthorized");

  const agent = await prisma.user.findUnique({ where: { id: session.userId as string } });
  if (!agent || agent.role !== 'sales') throw new Error("Not a sales agent");

  const clientId = formData.get('clientId') as string;
  const opportunityId = formData.get('opportunityId') as string;
  const planId = formData.get('planId') as string | null;
  const amountStr = formData.get('amount') as string;
  const totalAmount = parseFloat(amountStr);

  if (!clientId || !opportunityId || !totalAmount || isNaN(totalAmount)) {
    throw new Error("Missing required fields");
  }

  // Verify client belongs to agent
  const client = await prisma.user.findUnique({ where: { id: clientId } });
  if (!client || client.referredById !== agent.id) {
    throw new Error("Client does not belong to your network");
  }

  let planData = {};
  if (planId) {
    const plan = await prisma.returnPlan.findUnique({ where: { id: planId } });
    if (plan) {
      planData = {
        planId: plan.id,
        planName: plan.name,
        ratePercent: plan.ratePercent,
        intervalMonths: plan.intervalMonths
      };
    }
  }

  // Generate Reference Code
  const referenceCode = `DRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const holding = await prisma.holding.create({
    data: {
      userId: clientId,
      opportunityId,
      totalAmount,
      units: 1, // Basic assumption for now
      status: 'pending',
      referenceCode,
      ...planData
    }
  });

  return { success: true, referenceCode, holdingId: holding.id };
}
