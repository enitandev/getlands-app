"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationAction, clearReadNotificationsAction } from '@/app/actions/notifications';
import { toast } from '@/components/ui/Toast';

type NotificationItem = {
  id: string;
  userId: string | null;
  type: string;
  title: string;
  message: string;
  linkUrl: string | null;
  actionText: string | null;
  unread: boolean;
  createdAt: Date | string;
};

export default function ClientNotificationsPage({
  initialNotifications,
  portalType = 'customer'
}: {
  initialNotifications: NotificationItem[];
  portalType?: 'customer' | 'agent';
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filterTab, setFilterTab] = useState<'all' | 'transactions' | 'updates' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    await markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setIsProcessing(true);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    await markAllNotificationsAsRead();
    toast('All notifications marked as read', 'success');
    setIsProcessing(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    await deleteNotificationAction(id);
    toast('Notification removed', 'info');
  };

  const handleClearRead = async () => {
    if (!confirm('Are you sure you want to remove all read notifications?')) return;
    setIsProcessing(true);
    setNotifications(prev => prev.filter(n => n.unread));
    await clearReadNotificationsAction();
    toast('Read notifications cleared', 'success');
    setIsProcessing(false);
  };

  const handleCardClick = async (notif: NotificationItem) => {
    if (notif.unread) {
      await handleMarkAsRead(notif.id);
    }
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
  };

  const formatRelativeTime = (dateStr: Date | string) => {
    try {
      const past = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return past.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return (
          <div className="w-10 h-10 rounded-full bg-[#008b45]/10 text-[#008b45] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        );
      case 'UPDATE':
      case 'MARKETING':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
        );
    }
  };

  const filteredNotifications = notifications.filter(n => {
    // Tab filter
    if (filterTab === 'unread' && !n.unread) return false;
    if (filterTab === 'transactions' && n.type !== 'TRANSACTION') return false;
    if (filterTab === 'updates' && n.type === 'TRANSACTION') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-[900px] mx-auto space-y-6 font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 bg-[#008b45] text-white text-[12px] font-bold rounded-full shadow-sm">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-[14px] text-[#68736d] mt-1">
            Stay updated with your portfolio allocations, transaction receipts, and official Getlands announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isProcessing}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-black/10 rounded-full text-[13px] font-bold text-ink transition-colors shadow-sm disabled:opacity-50"
            >
              Mark all read
            </button>
          )}
          {notifications.some(n => !n.unread) && (
            <button
              type="button"
              onClick={handleClearRead}
              disabled={isProcessing}
              className="px-4 py-2 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-black/10 rounded-full text-[13px] font-bold text-[#68736d] transition-colors shadow-sm disabled:opacity-50"
            >
              Clear read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-2 rounded-[20px] border border-black/5 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              filterTab === 'all' 
                ? 'bg-[#008b45] text-white shadow-sm' 
                : 'text-[#68736d] hover:text-ink hover:bg-gray-100'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('unread')}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              filterTab === 'unread' 
                ? 'bg-[#008b45] text-white shadow-sm' 
                : 'text-[#68736d] hover:text-ink hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('transactions')}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              filterTab === 'transactions' 
                ? 'bg-[#008b45] text-white shadow-sm' 
                : 'text-[#68736d] hover:text-ink hover:bg-gray-100'
            }`}
          >
            Financial & Wallet
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('updates')}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              filterTab === 'updates' 
                ? 'bg-[#008b45] text-white shadow-sm' 
                : 'text-[#68736d] hover:text-ink hover:bg-gray-100'
            }`}
          >
            Announcements & Updates
          </button>
        </div>

        <div className="relative md:w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts..."
            className="w-full h-[38px] pl-9 pr-3 text-[13px] bg-[#f7f9f7] rounded-full border border-black/5 outline-none focus:border-[#008b45] transition-colors"
          />
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden divide-y divide-black/5">
        {filteredNotifications.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-[#f7f9f7] text-[#8a948e] mx-auto flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <h3 className="font-bold text-[18px] text-ink mb-1">No notifications found</h3>
            <p className="text-[#8a948e] text-[14px] max-w-sm mx-auto">
              {searchQuery ? 'No notifications match your search query.' : 'You have no notifications in this category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleCardClick(notif)}
              className={`p-5 sm:p-6 flex items-start gap-4 transition-colors cursor-pointer group ${
                notif.unread ? 'bg-white hover:bg-[#f7faf8]' : 'bg-[#fafbfa]/60 hover:bg-[#f2f5f3]'
              }`}
            >
              {getIcon(notif.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[15px] sm:text-[16px] leading-snug ${
                      notif.unread ? 'font-bold text-ink' : 'font-semibold text-ink/85'
                    }`}>
                      {notif.title}
                    </h3>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#008b45] shrink-0" />
                    )}
                  </div>
                  <span className="text-[12px] text-[#8a948e] shrink-0">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>

                <p className="text-[13px] sm:text-[14px] text-[#556059] leading-relaxed mb-3">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    {notif.linkUrl && (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#008b45] group-hover:underline">
                        <span>{notif.actionText || 'View Details'}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </span>
                    )}
                    {notif.unread && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="text-[12px] font-bold text-[#7a847f] hover:text-ink transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(notif.id, e)}
                    title="Remove notification"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#9aa49e] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
