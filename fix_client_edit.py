with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    lines = f.readlines()

# Remove all "use client"; lines
lines = [line for line in lines if '"use client";' not in line]

# Reinsert it at the very top
lines.insert(0, '"use client";\n')

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.writelines(lines)
