"use client";
import React, { useState } from 'react';
import { mockAnnouncements } from '@/lib/mockData';

import { createAnnouncement } from '@/app/actions/admin';
export default function ClientAnnouncements({ initialAnnouncements }: { initialAnnouncements: any[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-[30px] p-[20px] lg:p-[40px] max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[15px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Announcements</h1>
          <p className="text-[13px] text-[#68736d]">Manage platform-wide banners and alerts.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-[20px] py-[10px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
          Create Announcement
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[100px_2fr_1fr_100px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Status</div>
          <div>Message</div>
          <div>Type</div>
          <div className="text-right">Action</div>
        </div>
        
        <div className="divide-y divide-black/5">
          {announcements.map(ann => (
            <div key={ann.id} className="grid grid-cols-1 lg:grid-cols-[100px_2fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={ann.isActive} onChange={() => {
                    setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, isActive: !a.isActive } : a));
                  }} />
                  <div className="w-[36px] h-[20px] bg-[#eef3ef] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#008b45]"></div>
                </label>
              </div>
              
              <div>
                <strong className="block text-[14px] text-ink mb-[4px]">{ann.title}</strong>
                <p className="text-[12px] text-[#68736d] line-clamp-1">{ann.message}</p>
              </div>
              
              <div className="flex justify-between lg:block text-[13px]">
                <span className="lg:hidden text-[#7a847f] text-[12px]">Type:</span>
                <span className={`inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] ${
                  ann.type === 'promo' ? 'bg-[#f4f4f5] text-[#18201c]' : 'bg-[#fffbeb] text-[#d97706]'
                }`}>
                  {ann.type}
                </span>
              </div>
              
              <div className="mt-[10px] lg:mt-0 text-right">
                <button className="text-[13px] font-bold text-[#e53935] hover:underline" onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))}>Delete</button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="p-[40px] text-center text-[13px] text-[#68736d]">No announcements created yet.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">New Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={async (formData) => {
              await createAnnouncement(formData);
            }}>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Title</label>
                <input type="text" name="title" placeholder="e.g. System Maintenance" required className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Message</label>
                <textarea name="message" placeholder="Write the announcement..." required rows={3} className="w-full p-[15px] bg-[#f7f9f7] rounded-[12px] outline-none focus:border-[#008b45] border border-transparent transition-colors resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Type</label>
                <select name="type" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors">
                  <option value="promo">Promo</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              
              <div className="pt-[10px]">
                <button type="submit" className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)]">
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
