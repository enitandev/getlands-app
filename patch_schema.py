with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

import re

old_user_model = """model User {
  id             String        @id @default(uuid())
  firstName      String
  lastName       String
  email          String        @unique
  role           String        @default("customer") // admin, customer, sales
  walletBalance  Float         @default(0.0)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  holdings       Holding[]
  transactions   Transaction[]
  notifications  Notification[]
}"""

new_user_model = """model User {
  id                    String        @id @default(uuid())
  firstName             String
  lastName              String
  email                 String        @unique
  role                  String        @default("customer") // admin, customer, sales
  walletBalance         Float         @default(0.0)
  
  // Settings & Profile
  avatarUrl             String?
  phoneNumber           String?
  homeAddress           String?
  
  // KYC
  kycStatus             String        @default("unverified") // unverified, pending, verified
  kycTier               Int           @default(1)
  nationalIdUrl         String?
  utilityBillUrl        String?
  
  // Next of Kin
  nextOfKinName         String?
  nextOfKinPhone        String?
  nextOfKinEmail        String?
  nextOfKinRelationship String?
  
  // Bank Details
  bankName              String?
  accountNumber         String?
  accountName           String?
  
  // Security
  resetPasswordToken    String?
  resetPasswordExpires  DateTime?
  
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  holdings              Holding[]
  transactions          Transaction[]
  notifications         Notification[]
}"""

content = content.replace(old_user_model, new_user_model)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
