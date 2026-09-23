"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications';

export function NotificationDropdown({ notifications = [] }: { notifications: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);


  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };
  
  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };


  const getIconForType = (type: string) => {
    switch (type) {
      case 'TRANSACTION': return <div className="w-[32px] h-[32px] rounded-full bg-[#eef3ef] text-[#008b45] flex items-center justify-center shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>;
      case 'UPDATE': return <div className="w-[32px] h-[32px] rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>;
      default: return <div className="w-[32px] h-[32px] rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg></div>;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-[#68736d] lg:text-ink hover:bg-gray-50 transition-colors ${isOpen ? 'ring-2 ring-[#008b45]' : ''}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {unreadCount > 0 && <span className="absolute top-[8px] right-[10px] w-2 h-2 bg-[#e53935] rounded-full border border-white"></span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[10px] w-[320px] lg:w-[380px] bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-[20px] border-b border-black/5 flex justify-between items-center bg-[#f7f9f7]">
            <h3 className="font-bold text-ink">Notifications</h3>
            {unreadCount > 0 && <button onClick={markAllAsRead} className="text-[12px] font-bold text-[#008b45] hover:underline">Mark all read</button>}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-[40px] text-center text-[#68736d] text-[13px]">
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {notifications.map((notif: any) => (
                  <div key={notif.id} className={`p-[15px] flex gap-[15px] transition-colors ${notif.unread ? 'bg-white' : 'bg-gray-50/50'}`}>
                    {getIconForType(notif.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-[5px]">
                        <h4 className={`text-[14px] leading-tight ${notif.unread ? 'font-bold text-ink' : 'font-semibold text-ink/80'}`}>{notif.title}</h4>
                        {notif.unread && <span className="w-[8px] h-[8px] bg-[#008b45] rounded-full shrink-0 ml-[10px] mt-[4px]"></span>}
                      </div>
                      <p className="text-[13px] text-[#68736d] leading-relaxed mb-[10px]">{notif.message}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#a1aba6]">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        {notif.linkUrl && (
                          <Link href={notif.linkUrl} onClick={() => markAsRead(notif.id)} className="text-[12px] font-bold text-[#008b45] hover:underline">
                            {notif.actionText || 'View details'}
                          </Link>
                        )}
                        {!notif.linkUrl && notif.unread && (
                          <button onClick={() => markAsRead(notif.id)} className="text-[11px] font-bold text-[#68736d] hover:text-ink">
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
