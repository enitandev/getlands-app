with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = content.replace("import { mockOpportunities, formatCurrency, mockWallet, LandOpportunity, FarmOpportunity, LandBankingOpportunity } from '@/lib/mockData';", "import { formatCurrency } from '@/lib/mockData';\nimport { checkoutAction } from '@/app/actions/checkout';")

# Replace function signature and hooks
content = content.replace("export default function Checkout() {", "export default function ClientCheckout({ opportunity: opp, walletBalance }: { opportunity: any, walletBalance: number }) {")
content = content.replace("function CheckoutContent() {", "")
content = content.replace("  const searchParams = useSearchParams();\n  const router = useRouter();\n  const slug = searchParams.get('opp');\n  const opp = mockOpportunities.find(o => o.slug === slug) || mockOpportunities[0];", "")
content = content.replace("return (\n    <Suspense fallback={<div className=\"min-h-screen bg-[#f7f9f7] grid place-items-center\">Loading checkout...</div>}>\n      <CheckoutContent />\n    </Suspense>\n  );\n}", "")
content = content.replace("export default function ClientCheckout({ opportunity: opp, walletBalance }: { opportunity: any, walletBalance: number }) {\n\n  return (", "export default function ClientCheckout({ opportunity: opp, walletBalance }: { opportunity: any, walletBalance: number }) {\n  const [hasPaid, setHasPaid] = useState(false);\n  const [file, setFile] = useState<File | null>(null);\n  const [isSubmitting, setIsSubmitting] = useState(false);\n  const [copied, setCopied] = useState(false);\n  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');\n\n  const getPrice = () => {\n    if (opp.category === 'land') return opp.price;\n    if (opp.category === 'farm') return opp.slotPrice;\n    if (opp.category === 'land_banking') return opp.acquisitionPrice;\n    return 0;\n  };\n\n  const amount = getPrice();\n  const fee = 0;\n  const total = amount + fee;\n\n  return (")

content = content.replace("mockWallet.balance", "walletBalance")

content = content.replace("const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSubmitting(true);\n    // Mock API call\n    setTimeout(() => {\n      setIsSubmitting(false);\n      router.push('/dashboard/holdings');\n    }, 1500);\n  };", "")

content = content.replace('<form className="space-y-[30px]" onSubmit={handleSubmit}>', '<form className="space-y-[30px]" action={async () => { setIsSubmitting(true); const fd = new FormData(); fd.append("opportunityId", opp.id); fd.append("paymentMethod", paymentMethod); fd.append("totalAmount", total.toString()); await checkoutAction(fd); }}>')


with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write(content)
