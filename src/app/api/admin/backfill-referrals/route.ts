import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { referralCode: null }
    });

    let count = 0;
    for (const user of users) {
      const prefix = (user.firstName || 'USR').substring(0, 3).toUpperCase();
      let uniqueCode = '';
      let isUnique = false;
      
      while (!isUnique) {
        const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
        uniqueCode = `${prefix}-${randomSuffix}`;
        const existing = await prisma.user.findUnique({ where: { referralCode: uniqueCode }});
        if (!existing) isUnique = true;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: uniqueCode }
      });
      count++;
    }

    const setting = await prisma.platformSetting.findFirst();
    if (!setting) {
      await prisma.platformSetting.create({
        data: { id: 'global', referralBonusPercentage: 10.0 }
      });
    }

    return NextResponse.json({ success: true, updatedUsers: count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
