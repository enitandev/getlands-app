"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function createCohort(formData: FormData) {
  await checkAdmin();
  
  const opportunityId = formData.get('opportunityId') as string;
  const name = formData.get('name') as string;
  const status = formData.get('status') as string; // COMING_SOON, PRE_ORDER, OPEN, FULL
  
  const capacityAmount = parseFloat(formData.get('capacityAmount') as string || '0');
  const unitPrice = parseFloat(formData.get('unitPrice') as string || '0');
  const totalUnits = parseFloat(formData.get('totalUnits') as string || '0');
  
  const preorderOpensAtStr = formData.get('preorderOpensAt') as string;
  const publicOpensAtStr = formData.get('publicOpensAt') as string;
  const closesAtStr = formData.get('closesAt') as string;
  
  const cohortId = formData.get('cohortId') as string | null;
  const cohortCode = `${opportunityId.substring(0, 4)}-${Math.floor(Math.random() * 10000)}`.toUpperCase();

  const data = {
    opportunityId,
    name,
    status,
    capacityAmount,
    unitPrice,
    totalUnits,
    preorderOpensAt: preorderOpensAtStr ? new Date(preorderOpensAtStr) : null,
    publicOpensAt: publicOpensAtStr ? new Date(publicOpensAtStr) : null,
    closesAt: closesAtStr ? new Date(closesAtStr) : null,
  };

  if (cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data
    });
  } else {
    await prisma.cohort.create({
      data: {
        ...data,
        cohortCode,
        availableAmount: capacityAmount,
        availableUnits: totalUnits,
      }
    });
  }

  revalidatePath('/admin/marketplace');
  revalidatePath(`/admin/marketplace/edit/${opportunityId}`); // or whatever the slug is
}

export async function updateCohortStatus(cohortId: string, status: string) {
  await checkAdmin();
  await prisma.cohort.update({
    where: { id: cohortId },
    data: { status }
  });
  revalidatePath('/admin/marketplace');
}

export async function deleteCohort(cohortId: string) {
  await checkAdmin();
  await prisma.cohort.delete({
    where: { id: cohortId }
  });
  revalidatePath('/admin/marketplace');
}
