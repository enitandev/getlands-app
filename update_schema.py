import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# Match the User model explicitly
user_pattern = r"(model User \{[\s\S]*?)(\s*holdings\s*Holding\[\])"
user_replacement = r"\1\n  // Referral System\n  referralCode          String?       @unique\n  referredById          String?\n  hasTriggeredReferralReward Boolean  @default(false)\n\2"
content = re.sub(user_pattern, user_replacement, content, count=1)

# Match PlatformSetting explicitly
setting_pattern = r"(model PlatformSetting \{[\s\S]*?agentCommission\s*Float\s*@default\(5\.0\))"
setting_replacement = r"\1\n  referralBonusPercentage Float    @default(10.0)"
content = re.sub(setting_pattern, setting_replacement, content, count=1)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)

