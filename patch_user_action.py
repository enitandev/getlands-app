import re

with open('src/app/actions/user.ts', 'r') as f:
    content = f.read()

old_bank_action = """export async function updateBankDetailsAction(formData: FormData) {
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
}"""

new_bank_action = """export async function updateBankDetailsAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const bankName = formData.get('bankName') as string;
  const accountNumber = formData.get('accountNumber') as string;
  const accountName = formData.get('accountName') as string;

  if (!bankName || !accountNumber || !accountName) return { error: 'All fields are required' };

  try {
    // 1. Retire old active bank accounts
    await prisma.bankAccount.updateMany({
      where: { 
        userId: session.userId as string,
        status: 'active'
      },
      data: { status: 'retired' }
    });

    // 2. Create the new active bank account
    await prisma.bankAccount.create({
      data: {
        userId: session.userId as string,
        bankName,
        accountNumber,
        accountName,
        status: 'active'
      }
    });

    // 3. Update legacy flat fields for backward compatibility
    await prisma.user.update({
      where: { id: session.userId as string },
      data: { bankName, accountNumber, accountName }
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update bank details' };
  }
}

export async function getBankHistoryAction() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const banks = await prisma.bankAccount.findMany({
      where: { userId: session.userId as string },
      orderBy: { createdAt: 'desc' }
    });
    return { banks };
  } catch (error) {
    return { error: 'Failed to fetch bank history' };
  }
}"""

content = content.replace(old_bank_action, new_bank_action)

with open('src/app/actions/user.ts', 'w') as f:
    f.write(content)
