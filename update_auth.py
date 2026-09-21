import re

with open('src/app/actions/auth.ts', 'r') as f:
    content = f.read()

# Make sure cookies is imported
if "from 'next/headers'" not in content:
    content = content.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\nimport { cookies } from 'next/headers';\nimport crypto from 'crypto';")

old_register = r"  const bcrypt = require\('bcryptjs'\);\n  const hashedPassword = await bcrypt\.hash\(password, 10\);\n\n  const user = await prisma\.user\.create\(\{\n    data: \{\n      firstName,\n      lastName,\n      email,\n      role,\n      password: hashedPassword\n    \}\n  \}\);"

new_register = """  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Referral Handling
  let referredById = null;
  const cookieStore = cookies();
  const refCode = cookieStore.get('ref_code')?.value;
  if (refCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: refCode } });
    if (referrer) referredById = referrer.id;
  }

  // Generate a unique referral code for the new user
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
      role,
      password: hashedPassword,
      referralCode: uniqueCode,
      referredById
    }
  });"""

content = re.sub(old_register, new_register, content)

with open('src/app/actions/auth.ts', 'w') as f:
    f.write(content)
