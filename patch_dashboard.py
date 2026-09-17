with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { mockHoldings, mockNotifications, formatCurrency, mockAnnouncements, mockWallet } from '@/lib/mockData';", "import { formatCurrency } from '@/lib/mockData';")
content = content.replace("export default function DashboardOverview() {", "export default function ClientDashboardOverview({ user, activeAnnouncement }: { user: any, activeAnnouncement: any }) {")
content = content.replace("const totalValue = mockHoldings.reduce((sum, h) => sum + h.total_amount, 0);", "const totalValue = user.holdings.reduce((sum: number, h: any) => sum + h.totalAmount, 0);")
content = content.replace("const activeAnnouncement = mockAnnouncements.find(a => a.isActive);", "")

content = content.replace("mockWallet.balance", "user.walletBalance")
content = content.replace("mockHoldings.slice(0, 3).map", "user.holdings.slice(0, 3).map")
content = content.replace("mockNotifications.map", "user.notifications.map")

# Mapping holding fields
content = content.replace("h.total_amount", "h.totalAmount")
content = content.replace("h.opportunity.cover_image", "h.opportunity.coverImage")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
