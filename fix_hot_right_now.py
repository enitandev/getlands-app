with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

import re

# We want to change the title size and spacing in the Hot Right Now section
old_title = 'className="font-manrope text-[20px] md:text-[24px] lg:text-[28px] tracking-[-0.03em] mb-[10px] leading-tight">New opportunities are live.</h2>'
new_title = 'className="font-manrope text-[16px] md:text-[24px] lg:text-[28px] tracking-[-0.03em] mb-[5px] md:mb-[10px] leading-tight">New opportunities are live.</h2>'
content = content.replace(old_title, new_title)

# Also tighten the gap between the title section and the horizontal scrolling cards on mobile
old_wrapper = 'className="bg-[#102218] rounded-[24px] p-[20px] md:p-[25px] flex flex-col lg:flex-row items-center justify-between gap-[20px] md:gap-[30px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden"'
new_wrapper = 'className="bg-[#102218] rounded-[24px] p-[15px] md:p-[25px] flex flex-col lg:flex-row md:items-center justify-between gap-[10px] md:gap-[30px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden"'
content = content.replace(old_wrapper, new_wrapper)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

