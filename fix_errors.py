import re

# Fix auth.ts await cookies()
with open('src/app/actions/auth.ts', 'r') as f:
    content = f.read()

content = content.replace("const cookieStore = cookies();", "const cookieStore = await cookies();")

with open('src/app/actions/auth.ts', 'w') as f:
    f.write(content)

# Fix referral.ts reference field
with open('src/lib/referral.ts', 'r') as f:
    content = f.read()

old_tx = """        data: {
          userId: referrer.id,
          type: 'referral_bonus',
          amount: bonusAmount,
          status: 'success'
        }"""
new_tx = """        data: {
          userId: referrer.id,
          type: 'referral_bonus',
          amount: bonusAmount,
          status: 'success',
          reference: `REF-BONUS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }"""
content = content.replace(old_tx, new_tx)

with open('src/lib/referral.ts', 'w') as f:
    f.write(content)

