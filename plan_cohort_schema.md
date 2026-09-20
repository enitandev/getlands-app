# Schema Additions for Cohort Engine

```prisma
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
```

Modifications to existing models:
- Add `cohortId String?` to `Holding` and relation `cohort Cohort? @relation(fields: [cohortId], references: [id])`
- Add `cohorts Cohort[]` to `Opportunity`
- Add `cohortReservations CohortReservation[]` to `User`
