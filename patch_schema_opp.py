with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

import re

# Update Opportunity
old_opp = """  coverImage          String
  status              String     @default("available") // available, sold_out, draft
  createdAt           DateTime   @default(now())"""

new_opp = """  coverImage          String
  description         String?    @db.Text
  status              String     @default("available") // available, sold_out, draft
  createdAt           DateTime   @default(now())"""

content = content.replace(old_opp, new_opp)

# Update Holding
old_holding = """  opportunityId String
  totalAmount   Float
  dateAcquired  DateTime     @default(now())"""

new_holding = """  opportunityId String
  totalAmount   Float
  units         Float        @default(1)
  dateAcquired  DateTime     @default(now())"""

content = content.replace(old_holding, new_holding)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
