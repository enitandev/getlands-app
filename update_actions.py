import re

with open('src/app/actions/admin-customers.ts', 'r') as f:
    content = f.read()

# Update addLegacyCustomerAction to check for sendEmail
old_add = """  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      role: 'customer',
      password: hashedPassword,
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  revalidatePath('/admin/customers');

  return { success: true };"""

new_add = """  const sendEmail = formData.get('sendEmail') === 'on';

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      role: 'customer',
      password: hashedPassword,
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  if (sendEmail) {
    await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  }
  revalidatePath('/admin/customers');

  return { success: true };"""

content = content.replace(old_add, new_add)

# Add sendInviteAction
invite_action = """
export async function sendInviteAction(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'User not found' };

  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetExpires = new Date(Date.now() + 7 * 24 * 3600000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  return { success: true };
}
"""

content += invite_action

with open('src/app/actions/admin-customers.ts', 'w') as f:
    f.write(content)

print("Updated admin-customers.ts")
