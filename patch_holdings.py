with open('src/app/dashboard/holdings/ClientHoldings.tsx', 'r') as f:
    content = f.read()

content = content.replace("export default function HoldingsPage() {", "export default function ClientHoldings({ holdings }: { holdings: any[] }) {")
content = content.replace("mockHoldings.map", "holdings.map")

content = content.replace("h.opportunity.cover_image", "h.opportunity.coverImage")
content = content.replace("h.total_amount", "h.totalAmount")

with open('src/app/dashboard/holdings/ClientHoldings.tsx', 'w') as f:
    f.write(content)
