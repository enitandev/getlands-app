import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

# 1. Update navItems definition
old_nav_items = """  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Icons.Overview },
    { name: 'Holdings', path: '/dashboard/holdings', icon: Icons.Holdings },
    { name: 'Transactions', path: '/dashboard/transactions', icon: Icons.Transactions },
    { name: 'Messages', path: '/dashboard/messages', icon: Icons.Messages },
    { name: 'Settings', path: '/dashboard/settings', icon: Icons.Settings },
    { name: 'Referrals', path: '/dashboard/referrals', icon: Icons.Referrals },
    { name: 'Marketplace', path: '/explore', icon: Icons.Marketplace }
  ];"""

new_nav_items = """  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Icons.Overview },
    { name: 'Marketplace', path: '/explore', icon: Icons.Marketplace, badge: 2 },
    { name: 'Holdings', path: '/dashboard/holdings', icon: Icons.Holdings },
    { name: 'Wallet & transactions', path: '/dashboard/wallet', icon: Icons.Wallet },
    { name: 'Messages', path: '/dashboard/messages', icon: Icons.Messages },
    { name: 'Settings', path: '/dashboard/settings', icon: Icons.Settings },
  ];"""
content = content.replace(old_nav_items, new_nav_items)

# 2. Add badge rendering in nav loop
old_nav_link = """                {!isCollapsed && <span>{item.name}</span>}
              </Link>"""
new_nav_link = """                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {!isCollapsed && item.badge && (
                  <span className="bg-[#008b45] text-white text-[10px] font-bold w-[20px] h-[20px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>"""
content = content.replace(old_nav_link, new_nav_link)

# 3. Update the bottom of the sidebar (Add Referral Card + User Pill)
old_sidebar_bottom = """        <div className={`mt-auto w-full ${isCollapsed ? 'px-[15px]' : ''}`}>
          <Link 
            href="/dashboard/settings"
            className={`flex items-center ${isCollapsed ? 'justify-center p-[10px]' : 'justify-between px-[10px]'} w-full text-[#68736d] text-[15px] font-bold hover:text-[#008b45] transition-colors`}
            title={isCollapsed ? "Settings & Profile" : undefined}
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#18201c] shrink-0 text-[12px]">{initials}</div>
              {!isCollapsed && <span className="truncate">{fullName}</span>}
            </div>
            {!isCollapsed && (
              <div className="relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#e53935] rounded-full"></span>
              </div>
            )}
          </Link>
        </div>"""

new_sidebar_bottom = """        <div className={`mt-auto w-full ${isCollapsed ? 'px-[15px]' : ''} flex flex-col gap-[20px]`}>
          {!isCollapsed && (
            <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5">
              <h4 className="font-bold text-ink text-[14px] mb-[5px]">Earn 10% per referral</h4>
              <p className="text-[#68736d] text-[12px] leading-relaxed mb-[15px]">
                Credited to your wallet when a friend makes their first investment.
              </p>
              <button className="w-full h-[40px] bg-white border border-[#008b45]/20 text-[#008b45] text-[13px] font-bold rounded-full hover:bg-[#eef3ef] transition-colors">
                Copy invite link
              </button>
            </div>
          )}

          <Link 
            href="/dashboard/settings"
            className={`flex items-center ${isCollapsed ? 'justify-center p-[10px]' : 'gap-[12px] px-[10px]'} w-full text-ink text-[14px] font-bold hover:text-[#008b45] transition-colors`}
            title={isCollapsed ? "Settings & Profile" : undefined}
          >
            <div className="w-[32px] h-[32px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#008b45] shrink-0 text-[12px] font-bold tracking-wider">{initials}</div>
            {!isCollapsed && <span className="truncate">{fullName}</span>}
          </Link>
        </div>"""
content = content.replace(old_sidebar_bottom, new_sidebar_bottom)

# 4. Update the Mobile Bottom Nav entirely
old_mobile_nav = """      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-black/5 px-[15px] flex items-center justify-between z-50">
        {mobileNavItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center gap-[6px] w-[50px] h-[60px] transition-colors ${isActive ? 'text-[#008b45]' : 'text-[#a1aba6] hover:text-[#68736d]'}`}
            >
              <div className="scale-90">{item.icon}</div>
              <span className="text-[8px] font-bold tracking-[0.02em]">{item.name}</span>
            </Link>
          );
        })}
      </nav>"""

new_mobile_nav = """      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-black/5 flex items-center justify-around z-50 pb-[10px]">
        <Link href="/dashboard" className={`flex flex-col items-center gap-[4px] ${pathname === '/dashboard' ? 'text-[#008b45]' : 'text-[#a1aba6]'}`}>
          <div className="scale-[0.8]">{Icons.Overview}</div>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        
        <Link href="/dashboard/holdings" className={`flex flex-col items-center gap-[4px] ${pathname === '/dashboard/holdings' ? 'text-[#008b45]' : 'text-[#a1aba6]'}`}>
          <div className="scale-[0.8]">{Icons.Holdings}</div>
          <span className="text-[10px] font-bold">Holdings</span>
        </Link>
        
        {/* FAB for Acquire */}
        <Link href="/explore" className="relative -top-[15px] flex flex-col items-center gap-[6px]">
          <div className="w-[60px] h-[60px] bg-[#008b45] rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(0,139,69,0.3)] border-[4px] border-[#f7f9f7]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="text-[11px] font-bold text-ink">Acquire</span>
        </Link>
        
        <Link href="/dashboard/wallet" className={`flex flex-col items-center gap-[4px] ${pathname === '/dashboard/wallet' ? 'text-[#008b45]' : 'text-[#a1aba6]'}`}>
          <div className="scale-[0.8]">{Icons.Wallet}</div>
          <span className="text-[10px] font-bold">Wallet</span>
        </Link>
        
        <Link href="/dashboard/settings" className={`flex flex-col items-center gap-[4px] ${pathname === '/dashboard/settings' ? 'text-[#008b45]' : 'text-[#a1aba6]'}`}>
          <div className="scale-[0.8]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <span className="text-[10px] font-bold">Me</span>
        </Link>
      </nav>"""
content = content.replace(old_mobile_nav, new_mobile_nav)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
