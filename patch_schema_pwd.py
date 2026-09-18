with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

import re

old_fields = """  // Security
  resetPasswordToken    String?
  resetPasswordExpires  DateTime?"""

new_fields = """  // Security
  password              String        @default("")
  resetPasswordToken    String?
  resetPasswordExpires  DateTime?"""

content = content.replace(old_fields, new_fields)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
