import re

with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

if "triggerReferralBonus" not in content:
    content = content.replace("import { prisma } from '@/lib/prisma';", "import { prisma } from '@/lib/prisma';\nimport { triggerReferralBonus } from '@/lib/referral';")

pattern = r"(      await prisma\.holding\.update\(\{\n        where: \{ id: holding\.id \},\n        data: \{ status: 'active' \}\n      \}\);\n)"
replacement = r"\1\n      // Check referral bonus\n      await triggerReferralBonus(tx.userId, tx.amount);\n"
content = re.sub(pattern, replacement, content)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
