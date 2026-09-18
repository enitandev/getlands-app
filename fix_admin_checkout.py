import re

with open('src/app/actions/admin.ts', 'r') as f:
    admin_ts = f.read()

# Remove duplicate descriptions
admin_ts = re.sub(r"const description = formData\.get\('description'\) as string;\n  const description = formData\.get\('description'\) as string;", r"const description = formData.get('description') as string;", admin_ts)
with open('src/app/actions/admin.ts', 'w') as f:
    f.write(admin_ts)

with open('src/app/actions/checkout.ts', 'r') as f:
    checkout_ts = f.read()

# I accidentally added units to transaction. Let's reset checkout.ts entirely to the clean version and just add it correctly.
