import re

with open('prisma/schema.prisma', 'r') as f:
    schema = f.read()

old_notif = """model Notification {
  id            String    @id @default(uuid())
  userId        String?   // null if global/admin notification
  title         String
  message       String
  unread        Boolean   @default(true)
  createdAt     DateTime  @default(now())

  user          User?     @relation(fields: [userId], references: [id])
}"""

new_notif = """model Notification {
  id            String    @id @default(uuid())
  userId        String?   // null if global/admin notification
  type          String    @default("SYSTEM") // TRANSACTION, UPDATE, SYSTEM, MARKETING
  title         String
  message       String
  linkUrl       String?
  actionText    String?
  unread        Boolean   @default(true)
  createdAt     DateTime  @default(now())

  user          User?     @relation(fields: [userId], references: [id])
}"""

schema = schema.replace(old_notif, new_notif)

with open('prisma/schema.prisma', 'w') as f:
    f.write(schema)
