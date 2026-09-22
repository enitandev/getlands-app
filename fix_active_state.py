with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

import re

# 1. Update the top level return wrapper
old_return = """  return (
    <div className="space-y-[20px] md:space-y-[40px]">
      {activeAnnouncement && ("""
new_return = """  return (
    <div className="space-y-[15px] md:space-y-[40px]">
      <MobileSuperHeader />
      {activeAnnouncement && ("""
content = content.replace(old_return, new_return)

# 2. Hide the desktop layout
old_desktop_section = """      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
        <h1 className="font-manrope text-[28px] md:text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px] md:mb-[20px]">
          Welcome back, {user.firstName}.
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">"""

new_desktop_section = """      <div className="hidden md:block">
      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
        <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
          Welcome back, {user.firstName}.
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">"""
content = content.replace(old_desktop_section, new_desktop_section)

# 3. Close the hidden md:block correctly before ReferralBanner
old_closing = """          </div>
        </div>
      </section>

      <ReferralBanner />"""
new_closing = """          </div>
        </div>
      </section>
      </div>

      <ReferralBanner />"""
content = content.replace(old_closing, new_closing)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

