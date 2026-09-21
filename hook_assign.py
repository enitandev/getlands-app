import re

with open('src/app/actions/admin-customers.ts', 'r') as f:
    content = f.read()

if "triggerReferralBonus" not in content:
    content = content.replace("import { sendClaimAccountEmail, sendNewInvestmentEmail } from '@/lib/email';", "import { sendClaimAccountEmail, sendNewInvestmentEmail } from '@/lib/email';\nimport { triggerReferralBonus } from '@/lib/referral';")

pattern = r"(    data: \{\n      userId: user\.id,\n      type: 'investment',\n      amount: amountPaid,\n      status: 'success'\n    \}\n  \}\);\n)"
replacement = r"\1\n  // Check and trigger referral bonus if applicable\n  await triggerReferralBonus(user.id, amountPaid);\n"
content = re.sub(pattern, replacement, content)

with open('src/app/actions/admin-customers.ts', 'w') as f:
    f.write(content)
