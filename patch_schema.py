with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# Add BankAccount relation to User model
# We can insert it right after the bank details block
old_bank_details = """  // Bank Details
  bankName              String?
  accountNumber         String?
  accountName           String?
"""
new_bank_details = """  // Bank Details (Legacy flat fields - moving towards BankAccount model)
  bankName              String?
  accountNumber         String?
  accountName           String?
  bankAccounts          BankAccount[]
"""
content = content.replace(old_bank_details, new_bank_details)

# Add BankAccount model to the end of the file
bank_account_model = """

model BankAccount {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  bankName      String
  accountNumber String
  accountName   String
  status        String   @default("active") // "active" or "retired"
  createdAt     DateTime @default(now())
}
"""
content += bank_account_model

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
