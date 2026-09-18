with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

content = content.replace(
    "notifications         Notification[]",
    "notifications         Notification[]\n  commissions           Commission[]"
)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
