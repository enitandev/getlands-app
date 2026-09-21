import re

with open('src/app/actions/checkout.ts', 'r') as f:
    content = f.read()

if "triggerReferralBonus" not in content:
    content = content.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\nimport { triggerReferralBonus } from '@/lib/referral';")

pattern = r"(    // 4\. Update cohort committed amount if applicable[\s\S]*?    \}\n)"
replacement = r"\1\n    // 5. Trigger Referral Bonus if applicable\n    await triggerReferralBonus(user.id, totalAmount);\n"
content = re.sub(pattern, replacement, content)

with open('src/app/actions/checkout.ts', 'w') as f:
    f.write(content)
