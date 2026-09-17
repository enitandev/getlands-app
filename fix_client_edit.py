with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default function CreateOpportunityPage() {\n  const [category, setCategory] = useState(initialData.category)<'land' | 'farm' | 'land_banking'>('land');",
    "export default function ClientEditOpportunity({ initialData }: { initialData: any }) {\n  const [category, setCategory] = useState<'land' | 'farm' | 'land_banking'>(initialData.category || 'land');"
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
