"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { usePathname } from 'next/navigation';

const Icons = {
  Referrals: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Overview: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>
  ),
  Settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  ),
  Messages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
  ),
  Holdings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  Transactions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
  ),
  Documents: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Marketplace: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  )
};

export default function ClientDashboardLayout({ children, initials, fullName }: { children: React.ReactNode; initials: string; fullName: string; }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Icons.Overview },
    { name: 'Holdings', path: '/dashboard/holdings', icon: Icons.Holdings },
    { name: 'Transactions', path: '/dashboard/transactions', icon: Icons.Transactions },
    { name: 'Messages', path: '/dashboard/messages', icon: Icons.Messages },
    { name: 'Settings', path: '/dashboard/settings', icon: Icons.Settings },
    { name: 'Referrals', path: '/dashboard/referrals', icon: Icons.Referrals },
    { name: 'Marketplace', path: '/explore', icon: Icons.Marketplace }
  ];

  // Limit mobile nav to core features
  const mobileNavItems = navItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f7f9f7] flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-black/5 h-screen sticky top-0 transition-all duration-300 ease-custom ${isCollapsed ? 'w-[80px] items-center px-0' : 'w-[280px] px-[25px]'} py-[40px] z-50`}
      >
        <div className={`flex items-center mb-[50px] ${isCollapsed ? 'justify-center w-full' : 'justify-between w-full'}`}>
          {!isCollapsed && (
            <Link href="/" className="brand block w-[120px]">
              <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="brand block w-[32px] h-[32px] bg-[#008b45] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]">
              G
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-[28px] h-[28px] rounded-full hover:bg-[#eef3ef] flex items-center justify-center text-[#7a847f] transition-colors ${isCollapsed ? 'mt-[20px]' : ''}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <nav className={`flex flex-col gap-[10px] w-full ${isCollapsed ? 'px-[15px]' : ''}`}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center p-[12px] rounded-[14px]' : 'gap-[15px] px-[18px] py-[14px] rounded-[14px]'} text-[15px] font-bold transition-all ${isActive ? 'bg-[#008b45] text-white shadow-[0_8px_20px_rgba(0,139,69,0.2)]' : 'text-[#68736d] hover:bg-[#eef3ef] hover:text-[#18201c]'}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className={`mt-auto w-full ${isCollapsed ? 'px-[15px]' : ''}`}>
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
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-[100px] lg:pb-0 min-w-0">
        <header className="lg:hidden flex items-center justify-between px-[22px] h-[70px] bg-white border-b border-black/5 sticky top-0 z-40">
          <Link href="/" className="brand block w-[110px]">
            <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
          </Link>
          <div className="flex items-center gap-[15px]">
            <button className="relative text-[#68736d]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute 0 right-0 w-2 h-2 bg-[#e53935] rounded-full"></span>
            </button>
            <Link href="/dashboard/settings" className="w-[32px] h-[32px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#18201c] text-[12px] font-bold hover:bg-[#008b45] hover:text-white transition-colors">
              EA
            </Link>
          </div>
        </header>
        
        <div className="px-[22px] lg:px-[60px] py-[30px] lg:py-[50px] max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
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
      </nav>
    </div>
  );
}
