"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function updatePersonalInfoAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const homeAddress = formData.get('homeAddress') as string;

  if (!firstName || !lastName) return { error: 'Name is required' };

  try {
    await prisma.user.update({
      where: { id: session.userId as string },
      data: { firstName, lastName, phoneNumber, homeAddress }
    });
    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update personal info' };
  }
}

export async function updateBankDetailsAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const bankName = formData.get('bankName') as string;
  const accountNumber = formData.get('accountNumber') as string;
  const accountName = formData.get('accountName') as string;

  try {
    await prisma.user.update({
      where: { id: session.userId as string },
      data: { bankName, accountNumber, accountName }
    });
    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update bank details' };
  }
}

export async function updateNextOfKinAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const nextOfKinName = formData.get('nextOfKinName') as string;
  const nextOfKinRelationship = formData.get('nextOfKinRelationship') as string;
  const nextOfKinPhone = formData.get('nextOfKinPhone') as string;
  const nextOfKinEmail = formData.get('nextOfKinEmail') as string;

  try {
    await prisma.user.update({
      where: { id: session.userId as string },
      data: { nextOfKinName, nextOfKinRelationship, nextOfKinPhone, nextOfKinEmail }
    });
    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update next of kin' };
  }
}

import { createClient } from '@supabase/supabase-js';

export async function submitKycAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const ninFile = formData.get('ninFile') as File;
  const utilityFile = formData.get('utilityFile') as File;

  if (!ninFile || !utilityFile || ninFile.size === 0 || utilityFile.size === 0) {
    return { error: 'Both documents are required' };
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upload NIN
    const ninBytes = await ninFile.arrayBuffer();
    const ninFilename = `${Date.now()}-nin-${ninFile.name.replace(/\s+/g, '-')}`;
    const { error: ninErr } = await supabase.storage.from('getlands').upload(`kyc/${ninFilename}`, Buffer.from(ninBytes), { contentType: ninFile.type });
    if (ninErr) throw ninErr;
    const { data: { publicUrl: ninUrl } } = supabase.storage.from('getlands').getPublicUrl(`kyc/${ninFilename}`);

    // Upload Utility
    const utBytes = await utilityFile.arrayBuffer();
    const utFilename = `${Date.now()}-utility-${utilityFile.name.replace(/\s+/g, '-')}`;
    const { error: utErr } = await supabase.storage.from('getlands').upload(`kyc/${utFilename}`, Buffer.from(utBytes), { contentType: utilityFile.type });
    if (utErr) throw utErr;
    const { data: { publicUrl: utUrl } } = supabase.storage.from('getlands').getPublicUrl(`kyc/${utFilename}`);

    await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        kycStatus: 'pending',
        nationalIdUrl: ninUrl,
        utilityBillUrl: utUrl
      }
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error("KYC Error:", error);
    return { error: 'Failed to upload documents' };
  }
}
