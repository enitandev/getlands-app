import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. Hide Also Open on Mobile
content = content.replace(
    '        {/* Also open Carousel */}\n        <div className="lg:col-span-8',
    '        {/* Also open Carousel */}\n        <div className="hidden lg:block lg:col-span-8'
)

# 2. Add "See all" link back to Mobile
old_mobile_header = """      <div className="lg:hidden flex items-center justify-between mb-[8px] shrink-0">
        <div className="flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-wider text-[#008b45]">
          <span className="w-[6px] h-[6px] bg-[#008b45] rounded-full animate-pulse"></span>
          FEATURED NOW <span className="text-[#68736d] ml-[5px] font-normal">{carouselOpps.length > 0 ? featuredIndex + 1 : 0} OF {carouselOpps.length}</span>
        </div>
      </div>"""

new_mobile_header = """      <div className="lg:hidden flex items-center justify-between mb-[8px] shrink-0">
        <div className="flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-wider text-[#008b45]">
          <span className="w-[6px] h-[6px] bg-[#008b45] rounded-full animate-pulse"></span>
          FEATURED NOW <span className="text-[#68736d] ml-[5px] font-normal">{carouselOpps.length > 0 ? featuredIndex + 1 : 0} OF {carouselOpps.length}</span>
        </div>
        <Link href="/dashboard/marketplace" className="text-[#008b45] text-[12px] font-bold hover:underline">See all</Link>
      </div>"""
content = content.replace(old_mobile_header, new_mobile_header)


# 3. Shrink Desktop Fonts for Title & Percentage
content = content.replace(
    '<h3 className="font-manrope text-[24px] lg:text-[48px] font-bold leading-none mb-[5px] tracking-tight">{currentOpp.title}</h3>',
    '<h3 className="font-manrope text-[24px] lg:text-[38px] font-bold leading-none mb-[5px] tracking-tight">{currentOpp.title}</h3>'
)
content = content.replace(
    '<div className="font-manrope text-[36px] lg:text-[64px] font-bold text-[#a9e7bd] leading-none tracking-tighter">{currentOpp.projectedReturn || \'Variable\'}</div>',
    '<div className="font-manrope text-[36px] lg:text-[56px] font-bold text-[#a9e7bd] leading-none tracking-tighter">{currentOpp.projectedReturn || \'Variable\'}</div>'
)


# 4. Stack Closes In and Funded cards vertically instead of horizontally side-by-side
content = content.replace(
    '<div className="flex flex-row gap-[10px] lg:gap-[15px] mb-[15px] lg:mb-[30px]">',
    '<div className="flex flex-col gap-[10px] lg:gap-[15px] mb-[15px] lg:mb-[30px]">'
)


with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
