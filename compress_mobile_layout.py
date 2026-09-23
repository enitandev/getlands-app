import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. Desktop grid overlap fix
content = content.replace(
    '<div className="col-span-8">',
    '<div className="col-span-8 min-w-0 overflow-hidden">'
)

# 2. Compress Mobile Header Area
content = content.replace(
    '<header className="lg:hidden flex items-center justify-between mb-[20px]">',
    '<header className="lg:hidden flex items-center justify-between mb-[10px]">'
)
content = content.replace(
    '<h2 className="font-manrope text-[24px] font-bold text-ink leading-tight">{user.firstName}</h2>',
    '<h2 className="font-manrope text-[20px] font-bold text-ink leading-tight">{user.firstName}</h2>'
)
content = content.replace(
    '<div className="flex items-center gap-[6px] bg-[#f7f9f7] px-[12px] py-[6px] rounded-full border border-black/5">',
    '<div className="flex items-center gap-[6px] bg-[#f7f9f7] px-[10px] py-[4px] rounded-full border border-black/5">'
)
content = content.replace(
    '<Link href="/dashboard/settings" className="relative w-[36px] h-[36px]',
    '<Link href="/dashboard/settings" className="relative w-[32px] h-[32px]'
)

# 3. Compress Portfolio & Wallet Bar
content = content.replace(
    '<div className="lg:hidden flex bg-white border border-black/5 rounded-[20px] p-[20px] mb-[20px] shadow-sm">',
    '<div className="lg:hidden flex bg-white border border-black/5 rounded-[16px] p-[12px] mb-[10px] shadow-sm">'
)
content = content.replace(
    '<div className="font-manrope font-bold text-[22px] tracking-tight">',
    '<div className="font-manrope font-bold text-[18px] tracking-tight">'
)
content = content.replace(
    '<Link href="/dashboard/wallet" className="bg-[#eef3ef] text-[#008b45] px-[12px] py-[6px] rounded-full text-[11px] font-bold">',
    '<Link href="/dashboard/wallet" className="bg-[#eef3ef] text-[#008b45] px-[10px] py-[4px] rounded-full text-[10px] font-bold">'
)

# 4. Compress OPEN NOW label margin
content = content.replace(
    '<div className="lg:hidden flex items-center justify-between mb-[10px]">',
    '<div className="lg:hidden flex items-center justify-between mb-[8px]">'
)

# 5. Compress Featured Opportunity Card
content = content.replace(
    '<div className="lg:col-span-8 bg-[#182a20] rounded-[24px] p-[20px] lg:p-[30px]',
    '<div className="lg:col-span-8 bg-[#182a20] rounded-[20px] lg:rounded-[24px] p-[15px] lg:p-[30px]'
)
content = content.replace(
    '<div className="flex justify-between items-center mb-[20px]">',
    '<div className="flex justify-between items-center mb-[10px] lg:mb-[20px]">'
)
content = content.replace(
    '<h3 className="font-manrope text-[32px] lg:text-[48px]',
    '<h3 className="font-manrope text-[24px] lg:text-[48px]'
)
content = content.replace(
    '<div className="flex items-end gap-[10px] mb-[30px]">',
    '<div className="flex items-end gap-[8px] mb-[15px] lg:mb-[30px]">'
)
content = content.replace(
    '<div className="font-manrope text-[56px] lg:text-[64px]',
    '<div className="font-manrope text-[36px] lg:text-[64px]'
)

# 6. Compress Closes In & Funded row
content = content.replace(
    '<div className="flex flex-col sm:flex-row gap-[15px] mb-[20px] lg:mb-[30px]">',
    '<div className="flex flex-row gap-[10px] lg:gap-[15px] mb-[15px] lg:mb-[30px]">'
)
content = content.replace(
    '<div className="bg-white/5 border border-white/10 rounded-[12px] p-[15px] flex-1">',
    '<div className="bg-white/5 border border-white/10 rounded-[10px] lg:rounded-[12px] p-[10px] lg:p-[15px] flex-1">'
)
content = content.replace(
    '<div className="font-mono text-[18px] font-bold text-white">',
    '<div className="font-mono text-[14px] lg:text-[18px] font-bold text-white">'
)

# 7. Compress White Calculator Card
content = content.replace(
    '<div className="lg:w-[320px] shrink-0 bg-white rounded-[20px] p-[20px] lg:p-[25px]',
    '<div className="lg:w-[320px] shrink-0 bg-white rounded-[16px] lg:rounded-[20px] p-[15px] lg:p-[25px]'
)
content = content.replace(
    '<div className="flex justify-between items-center mb-[15px]">',
    '<div className="flex justify-between items-center mb-[10px] lg:mb-[15px]">'
)
content = content.replace(
    '<div className="grid grid-cols-2 gap-[10px] mb-[20px]">',
    '<div className="grid grid-cols-2 gap-[8px] lg:gap-[10px] mb-[15px] lg:mb-[20px]">'
)
content = content.replace(
    '<button \n                    key={amt}\n                    onClick={() => setSelectedAmount(amt)}\n                    className={`h-[45px]',
    '<button \n                    key={amt}\n                    onClick={() => setSelectedAmount(amt)}\n                    className={`h-[36px] lg:h-[45px]'
)
content = content.replace(
    '<button \n                onClick={() => setIsDrawerOpen(true)}\n                className="w-full h-[55px]',
    '<button \n                onClick={() => setIsDrawerOpen(true)}\n                className="w-full h-[45px] lg:h-[55px]'
)
content = content.replace(
    '<div className="lg:hidden flex justify-between items-center mt-[15px] text-[12px]">',
    '<div className="lg:hidden flex justify-between items-center mt-[10px] text-[11px]">'
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

