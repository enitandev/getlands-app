import { prisma } from './prisma';
import crypto from 'crypto';

export async function ensureReferralCode(user: any) {
  if (user.referralCode) return user.referralCode;

  const prefix = (user.firstName || 'USR').substring(0, 3).toUpperCase();
  let uniqueCode = '';
  let isUnique = false;
  
  while (!isUnique) {
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    uniqueCode = `${prefix}-${randomSuffix}`;
    const existingCode = await prisma.user.findUnique({ where: { referralCode: uniqueCode } });
    if (!existingCode) isUnique = true;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { referralCode: uniqueCode }
  });

  return uniqueCode;
}
