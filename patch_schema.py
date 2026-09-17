with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

import re

old_datasource = """datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}"""

new_datasource = """datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}"""

content = content.replace(old_datasource, new_datasource)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
