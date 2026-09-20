import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# 1. Add cohorts to Opportunity
if 'cohorts            Cohort[]' not in content:
    content = content.replace(
        'holdings            Holding[]',
        'holdings            Holding[]\n  cohorts             Cohort[]'
    )

# 2. Add cohortReservations to User
if 'cohortReservations    CohortReservation[]' not in content:
    content = content.replace(
        'commissions           Commission[]',
        'commissions           Commission[]\n  cohortReservations    CohortReservation[]'
    )

# 3. Add cohortId to Holding
if 'cohortId      String?' not in content:
    content = content.replace(
        'opportunityId String',
        'opportunityId String\n  cohortId      String?'
    )
    content = content.replace(
        'opportunity   Opportunity  @relation(fields: [opportunityId], references: [id])',
        'opportunity   Opportunity  @relation(fields: [opportunityId], references: [id])\n  cohort        Cohort?      @relation(fields: [cohortId], references: [id])'
    )

# 4. Append new models
new_models = """

model Cohort {
  id                  String    @id @default(uuid())
  opportunityId       String
  cohortCode          String    @unique
  name                String
  status              String    @default("COMING_SOON") 
  // COMING_SOON, PRE_ORDER, OPEN, FULL, ACTIVE, MATURING, COMPLETED
  
  capacityAmount      Float     @default(0)
  committedAmount     Float     @default(0)
  availableAmount     Float     @default(0)
  
  unitPrice           Float     @default(0)
  totalUnits          Float     @default(0)
  availableUnits      Float     @default(0)
  fundedUnits         Float     @default(0)
  
  preorderOpensAt     DateTime?
  publicOpensAt       DateTime?
  closesAt            DateTime?
  startsAt            DateTime?
  maturityAt          DateTime?
  completedAt         DateTime?
  
  targetReturnValue   Float?
  termsSnapshot       String?   @db.Text
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  opportunity         Opportunity @relation(fields: [opportunityId], references: [id])
  holdings            Holding[]
  reservations        CohortReservation[]
}

model CohortReservation {
  id          String   @id @default(uuid())
  cohortId    String
  userId      String
  units       Float
  amount      Float
  status      String   @default("PENDING") // PENDING, CONFIRMED, EXPIRED, CANCELLED, CONVERTED
  reservedAt  DateTime @default(now())
  expiresAt   DateTime?
  
  cohort      Cohort   @relation(fields: [cohortId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
}
"""

if 'model Cohort {' not in content:
    content += new_models

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)

