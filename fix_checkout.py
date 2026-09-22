import re

with open('src/app/actions/checkout.ts', 'r') as f:
    content = f.read()

# Replace the mangled block
mangled_block = """        data: {
          committedAmount: { increment: totalAmount },
          availableAmount: { decrement: totalAmount },
          fundedUnits: { increment: units },
          availableUnits: { decrement: units }
        }

    // 5. Trigger Referral Bonus if applicable
    await triggerReferralBonus(user.id, totalAmount);
      });
    }"""

fixed_block = """        data: {
          committedAmount: { increment: totalAmount },
          availableAmount: { decrement: totalAmount },
          fundedUnits: { increment: units },
          availableUnits: { decrement: units }
        }
      });
    }

    // 5. Trigger Referral Bonus if applicable
    await triggerReferralBonus(user.id, totalAmount);"""

content = content.replace(mangled_block, fixed_block)

with open('src/app/actions/checkout.ts', 'w') as f:
    f.write(content)
