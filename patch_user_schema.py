import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# Add phoneNumber and address to User model
replacement = """
  email         String    @unique
  password      String?
  phoneNumber   String?
  address       String?   @db.Text
"""

content = re.sub(
    r'email\s+String\s+@unique\n\s+password\s+String\?',
    replacement.strip(),
    content
)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
