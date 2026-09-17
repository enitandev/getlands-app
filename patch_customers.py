with open('src/app/admin/customers/ClientCustomers.tsx', 'r') as f:
    content = f.read()

content = content.replace("export default function AdminCustomers() {", "export default function ClientCustomers({ users }: { users: any[] }) {")

# Remove mock data array
content = content.replace('''  const mockCustomers = [
    { id: '1', name: 'Emeka Abraham', email: 'emeka@example.com', joined: 'Feb 2025', holdings: 3, totalValue: 1600000, status: 'active' },
    { id: '2', name: 'Ngozi Okoro', email: 'ngozi@example.com', joined: 'Mar 2025', holdings: 0, totalValue: 0, status: 'prospect' },
    { id: '3', name: 'David Smith', email: 'david@example.com', joined: 'Jul 2024', holdings: 1, totalValue: 500000, status: 'active' },
  ];''', "")

# Replace map
content = content.replace("mockCustomers.map(customer =>", "users.map(customer =>")

# Replace field accesses
content = content.replace("customer.name", "customer.firstName + ' ' + customer.lastName")
content = content.replace("customer.joined", "new Date(customer.createdAt).toLocaleDateString()")
content = content.replace("customer.holdings", "customer.holdings.length")
content = content.replace("{formatCurrency(customer.totalValue)}", "{formatCurrency(customer.walletBalance)}")

with open('src/app/admin/customers/ClientCustomers.tsx', 'w') as f:
    f.write(content)
