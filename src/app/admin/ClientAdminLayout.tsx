"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { usePathname } from 'next/navigation';

const AdminIcons = {
  Dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>,
  Marketplace: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>,
  Customers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Documents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Finance: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Messages: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  Sales: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
};

export default function ClientAdminLayout({ children, initials, fullName }: { children: React.ReactNode; initials: string; fullName: string; }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: AdminIcons.Dashboard },
    { name: 'Marketplace', path: '/admin/marketplace', icon: AdminIcons.Marketplace },
    { name: 'Announcements', path: '/admin/announcements', icon: AdminIcons.Documents },
    { name: 'Finance', path: '/admin/finance', icon: AdminIcons.Finance },
    { name: 'Documents', path: '/admin/documents', icon: AdminIcons.Documents },
    { name: 'Customers', path: '/admin/customers', icon: AdminIcons.Customers },
    { name: 'Messages', path: '/admin/messages', icon: AdminIcons.Messages },
    { name: 'Sales', path: '/admin/sales', icon: AdminIcons.Sales },
    { name: 'Settings', path: '/admin/settings', icon: AdminIcons.Settings }
  ];

  // Mobile main nav items (bottom bar)
  const mobileNavItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-manrope">
      {/* Desktop Sidebar (Dark) */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#102218] text-white h-screen sticky top-0 transition-all duration-300 ease-custom ${isCollapsed ? 'w-[80px] items-center px-0' : 'w-[260px] px-[20px]'} py-[30px] z-50`}
      >
        <div className={`flex items-center mb-[40px] ${isCollapsed ? 'justify-center w-full' : 'justify-between px-[10px] w-full'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] bg-[#008b45] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]">G</div>
              <span className="font-extrabold tracking-[-0.03em] text-[18px]">Getlands Ops</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-[32px] h-[32px] bg-[#008b45] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]">
              G
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-[28px] h-[28px] rounded-full hover:bg-white/10 flex items-center justify-center text-[#8ea096] transition-colors ${isCollapsed ? 'mt-[20px]' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <nav className={`flex flex-col gap-[6px] w-full ${isCollapsed ? 'px-[15px]' : ''}`}>
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.path) && (item.path !== '/admin' || pathname === '/admin');
            return (
              <Link 
                key={item.name} 
                href={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center p-[12px] rounded-[10px]' : 'gap-[12px] px-[14px] py-[10px] rounded-[10px]'} text-[14px] font-bold transition-all ${isActive ? 'bg-[#008b45] text-white shadow-[0_4px_12px_rgba(0,139,69,0.3)]' : 'text-[#8ea096] hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
                {item.name === 'Messages' && !isCollapsed && (
                  <span className="ml-auto w-[18px] h-[18px] bg-[#f5a623] text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className={`mt-auto w-full ${isCollapsed ? 'px-[15px]' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-[10px]' : 'gap-[12px] px-[14px]'} w-full border-t border-white/10 pt-[20px]`}>
            <div className="w-[32px] h-[32px] rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 text-[12px] font-bold">{initials}</div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white">{fullName}</span>
                <span className="text-[11px] text-[#8ea096]">operations@getlands</span>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-[80px] lg:pb-0 h-screen overflow-y-auto flex flex-col">
        <header className="h-[70px] bg-white border-b border-black/5 flex items-center px-[20px] lg:px-[30px] justify-between sticky top-0 z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-[15px]">
            <div className="lg:hidden w-[28px] h-[28px] bg-[#008b45] rounded-[6px] flex items-center justify-center text-white font-bold text-[12px]">G</div>
            <h2 className="font-manrope text-[16px] lg:text-[18px] font-bold tracking-[-0.03em] text-ink capitalize">
              {pathname === '/admin' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-[15px] lg:gap-[20px]">
            <button className="text-[#68736d] hover:text-ink relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-[0] right-[2px] w-[8px] h-[8px] bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link href="/" className="hidden lg:block text-[13px] font-bold text-[#008b45] hover:underline">View Live Site ↗</Link>
            {/* Mobile Menu Toggle for extra items */}
            <button className="lg:hidden w-[32px] h-[32px] flex items-center justify-center text-ink" onClick={() => setMobileMenuOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>
        
        {/* Dynamic content area that can fill height if needed (like for messaging) */}
        <div className={`p-[20px] lg:p-[40px] max-w-[1400px] mx-auto w-full ${pathname === '/admin/messages' ? 'flex-1 h-full !p-0' : ''}`}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-white border-t border-black/5 px-[10px] flex items-center justify-around z-50">
        {mobileNavItems.map(item => {
          const isActive = pathname.startsWith(item.path) && (item.path !== '/admin' || pathname === '/admin');
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center gap-[4px] w-[60px] h-[60px] transition-colors ${isActive ? 'text-[#008b45]' : 'text-[#a1aba6] hover:text-[#68736d]'}`}
            >
              <div className="scale-90 relative">
                {item.icon}
                {item.name === 'Customers' && (
                  <span className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] bg-[#f5a623] rounded-full border border-white"></span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-[0.02em]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#102218] z-50 p-[30px] flex flex-col animate-fade-in text-white">
          <div className="flex justify-between items-center mb-[40px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] bg-[#008b45] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]">G</div>
              <span className="font-extrabold tracking-[-0.03em] text-[18px]">Getlands Ops</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="w-[32px] h-[32px] bg-white/10 rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-[15px]">
            {navItems.map(item => {
              const isActive = pathname.startsWith(item.path) && (item.path !== '/admin' || pathname === '/admin');
              return (
                <Link 
                  key={item.name} 
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-[15px] px-[20px] py-[16px] rounded-[16px] text-[16px] font-bold transition-colors ${isActive ? 'bg-[#008b45] text-white' : 'text-[#8ea096] hover:bg-white/10'}`}
                >
                  {item.icon}
                  {item.name}
                  {item.name === 'Messages' && (
                    <span className="ml-auto w-[20px] h-[20px] bg-[#f5a623] text-white rounded-full flex items-center justify-center text-[11px] font-bold">2</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
