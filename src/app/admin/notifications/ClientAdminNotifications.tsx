"use client";
import React, { useState } from 'react';
import { broadcastNotificationAction } from '@/app/actions/admin-notifications';

export default function ClientAdminNotifications({ users }: { users: any[] }) {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState('all');
  const [message, setMessage] = useState('');

  const handleBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await broadcastNotificationAction(formData);
    
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      alert('Broadcast sent successfully!');
      e.currentTarget.reset();
      setTarget('all');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[30px]">
        <div>
          <h1 className="font-manrope text-[24px] font-bold text-ink mb-[5px]">Broadcast Notifications</h1>
          <p className="text-[14px] text-[#68736d]">Send in-app notifications directly to users.</p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-[30px] border border-black/5 max-w-[800px]">
        <form onSubmit={handleBroadcast} className="space-y-[20px]">
          
          <div className="grid grid-cols-2 gap-[20px]">
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Notification Title</label>
              <input 
                type="text" 
                name="title" 
                required
                placeholder="e.g. New Farm Cycle Open!"
                className="w-full h-[50px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Type</label>
              <select 
                name="type" 
                className="w-full h-[50px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors appearance-none bg-white"
              >
                <option value="UPDATE">General Update (Blue)</option>
                <option value="MARKETING">Marketing / New Opp</option>
                <option value="SYSTEM">System Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-[8px]">Target Audience</label>
            <select 
              name="target" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-[50px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors appearance-none bg-white"
            >
              <option value="all">All Users ({users.length})</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink mb-[8px]">Message</label>
            <textarea 
              name="message" 
              required
              rows={4}
              placeholder="Write your notification message here..."
              className="w-full p-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-[20px]">
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Action Link (Optional)</label>
              <input 
                type="text" 
                name="linkUrl" 
                placeholder="/dashboard/marketplace"
                className="w-full h-[50px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Action Text (Optional)</label>
              <input 
                type="text" 
                name="actionText" 
                placeholder="e.g. Invest Now"
                className="w-full h-[50px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-[10px]">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-[50px] bg-[#182a20] hover:bg-black text-white font-bold rounded-[12px] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Broadcast...' : 'Send Notification'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
