import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default function ClientDashboardOverview({ user, activeAnnouncement }: { user: any, activeAnnouncement: any }) {",
    "export default function ClientDashboardOverview({ user, activeAnnouncement, featuredOpps = [] }: { user: any, activeAnnouncement: any, featuredOpps?: any[] }) {"
)

featured_ui = """
          <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory gap-[15px] shrink-0 pb-[10px] md:pb-0 scrollbar-hide md:grid md:grid-cols-2 w-full md:w-auto mt-[20px] md:mt-0">
             {featuredOpps.map((opp, i) => (
               <Link href={`/explore/${opp.slug}`} key={opp.id} className="block w-[200px] md:w-auto shrink-0 snap-center bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider mb-[5px]">{i === 0 ? 'Featured' : 'Upcoming'}</div>
                  <div className="font-manrope text-[16px] text-white leading-tight">{opp.title}</div>
               </Link>
             ))}
             {featuredOpps.length === 0 && (
               <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md">
                  <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider mb-[5px]">Featured</div>
                  <div className="font-manrope text-[16px] text-white leading-tight">New opportunities loading...</div>
               </div>
             )}
          </div>
"""

content = re.sub(
    r'<div className="relative z-10 grid grid-cols-2 gap-\[15px\] shrink-0">.*?</div>',
    featured_ui.strip(),
    content,
    flags=re.DOTALL
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
