"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createProspectAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'sales') throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const interestLevel = formData.get('interestLevel') as string;
  const notes = formData.get('notes') as string;
  const followUpStr = formData.get('nextFollowUp') as string;
  
  let nextFollowUp = null;
  if (followUpStr) {
    nextFollowUp = new Date(followUpStr);
  }

  await prisma.prospect.create({
    data: {
      agentId: session.userId as string,
      name,
      phone: phone || null,
      email: email || null,
      interestLevel: interestLevel || 'WARM',
      notes: notes || null,
      nextFollowUp
    }
  });

  revalidatePath('/agent/network');
  return { success: true };
}

export async function updateProspectStatusAction(id: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'sales') throw new Error("Unauthorized");

  await prisma.prospect.update({
    where: { id, agentId: session.userId as string },
    data: { status }
  });

  revalidatePath('/agent/network');
  return { success: true };
}
