import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Update signature
content = content.replace(
    "export default function ClientDashboardOverview({ user, activeAnnouncement, featuredOpps = [] }: { user: any, activeAnnouncement: any, featuredOpps?: any[] }) {",
    "export default function ClientDashboardOverview({ user, activeAnnouncement, featuredOpps = [], referralBonusPercentage = 10 }: { user: any, activeAnnouncement: any, featuredOpps?: any[], referralBonusPercentage?: number }) {"
)

# Create the banner UI
banner_ui = """
  const ReferralBanner = () => (
    <div className="bg-[#eef3ef] border border-[#008b45]/20 rounded-[20px] p-[25px] flex flex-col md:flex-row justify-between items-center gap-[20px] relative overflow-hidden group hover:bg-[#e6efe9] transition-colors">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="relative z-10 flex-1">
        <div className="text-[11px] text-[#008b45] font-bold uppercase tracking-[0.1em] mb-[8px] flex items-center gap-[6px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Refer & Earn
        </div>
        <h3 className="font-manrope text-[20px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">
          Earn {referralBonusPercentage}% in cash!
        </h3>
        <p className="text-[14px] text-[#68736d] max-w-[500px]">
          Invite a friend to Getlands. When they make their first investment, you get {referralBonusPercentage}% of their purchase credited straight to your wallet.
        </p>
      </div>
      <Link href="/dashboard/referrals" className="relative z-10 shrink-0 px-[20px] py-[12px] bg-white text-[#008b45] font-bold text-[13px] rounded-full border border-[#008b45]/20 shadow-sm hover:shadow-md hover:border-[#008b45]/40 transition-all">
        Get Your Link
      </Link>
    </div>
  );
"""

# Insert banner definition
content = content.replace("  const totalValue =", banner_ui + "\n  const totalValue =")

# Insert banner into empty state (after the black block)
empty_state_insert = """        </section>

        <ReferralBanner />

        {featuredOpps.length > 0 && ("""
content = content.replace("        </section>\n\n        {featuredOpps.length > 0 && (", empty_state_insert)

# Insert banner into active state (before "Hot Right Now")
active_state_insert = """        </section>

        <ReferralBanner />

        {/* Hot Right Now - Upsell Section */}"""
content = content.replace("        </section>\n\n        {/* Hot Right Now - Upsell Section */}", active_state_insert)


with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

