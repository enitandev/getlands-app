import re

with open('src/app/actions/admin-customers.ts', 'r') as f:
    content = f.read()

# Make sure crypto is imported
if "import crypto" not in content:
    content = content.replace("import { revalidatePath } from 'next/cache';", "import { revalidatePath } from 'next/cache';\nimport crypto from 'crypto';")


old_block = r"(  const sendEmail = formData\.get\('sendEmail'\) === 'on';\n\n  const user = await prisma\.user\.create\(\{\n    data: \{\n      firstName,\n      lastName,\n      email,\n      phoneNumber: phone,\n      password: hashedPassword,\n      resetPasswordToken: resetToken,\n      resetPasswordExpires: resetExpires\n    \}\n  \}\);)"

new_block = """  const sendEmail = formData.get('sendEmail') === 'on';

  // Generate unique referral code
  const prefix = (firstName || 'USR').substring(0, 3).toUpperCase();
  let uniqueCode = '';
  let isUnique = false;
  while (!isUnique) {
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    uniqueCode = `${prefix}-${randomSuffix}`;
    const existingCode = await prisma.user.findUnique({ where: { referralCode: uniqueCode } });
    if (!existingCode) isUnique = true;
  }

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password: hashedPassword,
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
      referralCode: uniqueCode
    }
  });"""

content = re.sub(old_block, new_block, content)

with open('src/app/actions/admin-customers.ts', 'w') as f:
    f.write(content)
