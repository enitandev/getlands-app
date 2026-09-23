import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. State changes
state_code = """export default function ClientDashboardOverview({ user, opportunities = [] }: any) {
  const openOpps = opportunities?.filter((o: any) => o.status === 'available') || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Carousel logic
  const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? openOpps.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex(prev => (prev === openOpps.length - 1 ? 0 : prev + 1));
  
  const currentOpp = openOpps[currentIndex] || opportunities?.[0];
  const cohort = currentOpp?.cohorts?.[0];
  
  const getMinAmount = (opp: any) => {
    if (!opp) return 50000;
    return opp.slotPrice || opp.price || opp.acquisitionPrice || 50000;
  };
  
  const minAmount = getMinAmount(currentOpp);
  const amounts = [1, 2, 5, 10].map(multiplier => minAmount * multiplier);
  
  // When currentOpp changes, ensure selectedAmount is valid for the new opp
  const [selectedAmount, setSelectedAmount] = useState(amounts[1] || amounts[0] || 100000);
  
  // Sync selected amount when changing carousel
  React.useEffect(() => {
    setSelectedAmount(amounts[1] || amounts[0] || 100000);
  }, [currentIndex]);
"""

old_state_start = "export default function ClientDashboardOverview({ user, opportunities = [] }: any) {"
old_state_end = "const canUseWallet = user.walletBalance >= selectedAmount;"
old_state = content[content.find(old_state_start):content.find(old_state_end) + len(old_state_end)]

content = content.replace(old_state, state_code + "\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);\n  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');\n\n  const totalValue = user.holdings?.reduce((sum: number, h: any) => sum + (h.totalAmount || 0), 0) || 0;\n  const farmCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'farm').length || 0;\n  const landCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land').length || 0;\n  const landBankingCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land_banking').length || 0;\n  const canUseWallet = user.walletBalance >= selectedAmount;")


# 2. Update filtering for bottom lists (using currentOpp instead of featuredOpp)
content = content.replace(
    'const openFarms = opportunities.filter((o: any) => o.category === \'farm\' && o.status === \'available\' && o.id !== featuredOpp?.id);',
    'const openFarms = opportunities.filter((o: any) => o.category === \'farm\' && o.status === \'available\' && o.id !== currentOpp?.id);'
)
content = content.replace(
    'const openLands = opportunities.filter((o: any) => o.category === \'land\' && o.status === \'available\' && o.id !== featuredOpp?.id);',
    'const openLands = opportunities.filter((o: any) => o.category === \'land\' && o.status === \'available\' && o.id !== currentOpp?.id);'
)
content = content.replace(
    'const openLandBanking = opportunities.filter((o: any) => o.category === \'land_banking\' && o.status === \'available\' && o.id !== featuredOpp?.id);',
    'const openLandBanking = opportunities.filter((o: any) => o.category === \'land_banking\' && o.status === \'available\' && o.id !== currentOpp?.id);'
)

# Replace all featuredOpp with currentOpp
content = content.replace('featuredOpp', 'currentOpp')

# 3. Add arrow functionality and remove "See all"
content = content.replace(
    '<Link href="/explore" className="text-[#008b45] text-[12px] font-bold hover:underline">See all</Link>',
    ''
)
content = content.replace(
    '<span className="text-[#68736d] ml-[5px] font-normal">1 of {opportunities.filter((o:any)=>o.status===\'available\').length}</span>',
    '<span className="text-[#68736d] ml-[5px] font-normal">{openOpps.length > 0 ? currentIndex + 1 : 0} OF {openOpps.length}</span>'
)

# Connect the arrows on desktop
content = content.replace(
    '<div className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white/50"><svg width="14" height="14"',
    '<button onClick={handlePrev} className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><svg width="14" height="14"'
)
content = content.replace(
    ' points="15 18 9 12 15 6"></polyline></svg></div>',
    ' points="15 18 9 12 15 6"></polyline></svg></button>'
)

content = content.replace(
    '<div className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white"><svg width="14" height="14"',
    '<button onClick={handleNext} className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><svg width="14" height="14"'
)
content = content.replace(
    ' points="9 18 15 12 9 6"></polyline></svg></div>',
    ' points="9 18 15 12 9 6"></polyline></svg></button>'
)

# Fix the header subtext
content = content.replace(
    '{currentOpp?.title ? `${currentOpp.title} closes first.` : \'\'}',
    '{currentOpp?.title ? `${openOpps.length} available.` : \'\'}'
)


# 4. Hide Also open on mobile entirely (handled by responsive grid classes)
content = content.replace(
    '<div className="hidden lg:grid grid-cols-12 gap-[30px]">',
    '<div className="hidden lg:grid grid-cols-12 gap-[30px] mb-[40px]">' # Just adding margin bottom
)
content = content.replace(
    '<div className="col-span-8 min-w-0 overflow-hidden">',
    '<div className="col-span-8 min-w-0 overflow-hidden bg-white rounded-[24px] border border-black/5 p-[30px] shadow-sm">'
)
content = content.replace(
    '<div className="flex gap-[20px] overflow-x-auto pb-[20px] scrollbar-hide">',
    '<div className="grid grid-cols-2 xl:grid-cols-2 gap-[20px]">'
)

# Remove the "Browse marketplace" link on desktop
content = content.replace(
    '<Link href="/explore" className="text-[14px] font-bold text-[#008b45] hover:underline">Browse marketplace</Link>',
    ''
)


with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

