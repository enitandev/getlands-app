"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// SETTINGS ACTIONS
export async function updatePlatformSettingsAction(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const supportEmail = formData.get('supportEmail') as string;
  const processingFee = parseFloat(formData.get('processingFee') as string);
  const agentCommission = parseFloat(formData.get('agentCommission') as string);
  
  const corporateBankName = formData.get('corporateBankName') as string;
  const corporateAccountName = formData.get('corporateAccountName') as string;
  const corporateAccountNumber = formData.get('corporateAccountNumber') as string;

  await prisma.platformSetting.upsert({
    where: { id: 'global' },
    update: {
      companyName, supportEmail, processingFee, agentCommission,
      corporateBankName, corporateAccountName, corporateAccountNumber
    },
    create: {
      id: 'global',
      companyName, supportEmail, processingFee, agentCommission,
      corporateBankName, corporateAccountName, corporateAccountNumber
    }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
}

// SALES ACTIONS
export async function createLeadAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const expressedInterest = formData.get('expressedInterest') as string;

  await prisma.lead.create({
    data: { name, email, expressedInterest }
  });

  revalidatePath('/admin/sales');
}

export async function deleteLeadAction(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/admin/sales');
}

export async function updateLeadStatusAction(id: string, status: string) {
  await prisma.lead.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin/sales');
}
