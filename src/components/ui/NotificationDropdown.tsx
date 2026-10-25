"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications';
import { toast } from '@/components/ui/Toast';

export function NotificationDropdown({ notifications = [], userId }: { notifications: any[], userId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const knownIdsRef = useRef<Set<string>>(new Set(notifications.map((n: any) => n.id)));

  useEffect(() => {
    setLocalNotifications(notifications);
    notifications.forEach((n: any) => knownIdsRef.current.add(n.id));
  }, [notifications]);

  useEffect(() => {
    if (!userId) return;

    // Real-time polling mechanism for notifications (every 10s)
    const fetchNotifs = async () => {
      try {
        const { getLatestNotifications } = await import('@/app/actions/polling');
        const latest = await getLatestNotifications(userId);
        if (latest && Array.isArray(latest)) {
          // Check for brand new incoming notifications to trigger live toast
          latest.forEach((n: any) => {
            if (!knownIdsRef.current.has(n.id)) {
              knownIdsRef.current.add(n.id);
              if (n.unread) {
                toast(`${n.title} — ${n.message.length > 60 ? n.message.substring(0, 60) + '...' : n.message}`, 'info');
              }
            }
          });
          setLocalNotifications(latest);
        }
      } catch (err) {
        console.error("Polling notifications error:", err);
      }
    };

    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = localNotifications.filter((n: any) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocalNotifications((prev: any[]) => prev.map((n: any) => n.id === id ? { ...n, unread: false } : n));
    await markNotificationAsRead(id);
  };
  
  const markAllAsRead = async () => {
    setLocalNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, unread: false })));
    await markAllNotificationsAsRead();
  };

  const handleCardClick = async (notif: any) => {
    if (notif.unread) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return past.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return (
          <div className="w-[34px] h-[34px] rounded-full bg-[#008b45]/10 text-[#008b45] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        );
      case 'UPDATE':
      case 'MARKETING':
        return (
          <div className="w-[34px] h-[34px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        );
      default:
        return (
          <div className="w-[34px] h-[34px] rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
        );
    }
  };

  const allNotificationsUrl = pathname.startsWith('/admin') 
    ? '/admin/notifications' 
    : pathname.startsWith('/agent') 
      ? '/agent/notifications' 
      : '/dashboard/notifications';

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-[#4d5752] hover:text-ink hover:bg-[#f7f9f7] transition-all ${isOpen ? 'ring-2 ring-[#008b45] bg-[#f7f9f7]' : ''}`}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {unreadCount > 0 && (
          <span className="absolute -top-[2px] -right-[2px] min-w-[18px] h-[18px] px-1 bg-[#e53935] text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-2 sm:right-0 mt-[12px] w-[calc(100vw-32px)] sm:w-[380px] max-w-[390px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="p-[18px_20px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
            <div className="flex items-center gap-2">
              <h3 className="font-manrope font-bold text-[16px] text-ink">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#008b45]/10 text-[#008b45] text-[11px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                type="button" 
                onClick={markAllAsRead} 
                className="text-[12px] font-bold text-[#008b45] hover:text-[#007339] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[420px] overflow-y-auto divide-y divide-black/5">
            {localNotifications.length === 0 ? (
              <div className="py-[50px] px-[20px] text-center">
                <div className="w-12 h-12 rounded-full bg-[#f7f9f7] text-[#8a948e] mx-auto flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <h4 className="font-manrope font-bold text-[14px] text-ink mb-1">All caught up!</h4>
                <p className="text-[#8a948e] text-[12px]">You have no unread alerts at this time.</p>
              </div>
            ) : (
              localNotifications.map((notif: any) => (
                <div 
                  key={notif.id}
                  onClick={() => handleCardClick(notif)}
                  className={`p-[16px_18px] flex gap-[14px] cursor-pointer transition-colors ${
                    notif.unread ? 'bg-white hover:bg-[#f7faf8]' : 'bg-[#fafbfa]/70 hover:bg-[#f2f5f3]'
                  }`}
                >
                  {getIconForType(notif.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className={`text-[13px] leading-tight truncate ${notif.unread ? 'font-bold text-ink' : 'font-medium text-[#4d5752]'}`}>
                        {notif.title}
                      </h4>
                      {notif.unread && (
                        <span className="w-2 h-2 bg-[#008b45] rounded-full shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#68736d] leading-relaxed line-clamp-2 mb-2">
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8a948e]">{formatTimeAgo(notif.createdAt)}</span>
                      {notif.linkUrl && (
                        <span className="text-[#008b45] font-bold flex items-center gap-1 group-hover:underline">
                          {notif.actionText || 'View'} &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-[#fcfdfc] border-t border-black/5 text-center">
            <Link 
              href={allNotificationsUrl}
              onClick={() => setIsOpen(false)}
              className="text-[12px] font-bold text-[#008b45] hover:text-[#007339] transition-colors"
            >
              Open Notification Center &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
