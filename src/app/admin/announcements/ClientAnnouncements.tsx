"use client";

import React, { useState } from 'react';
import { 
  createAnnouncementAction, 
  updateAnnouncementAction, 
  toggleAnnouncementStatusAction, 
  deleteAnnouncementAction 
} from '@/app/actions/announcements';

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: string;
  placement: string;
  targetAudience: string;
  actionText: string | null;
  actionUrl: string | null;
  isDismissible: boolean;
  isActive: boolean;
  priority: number;
  startsAt: Date | string | null;
  expiresAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ClientAnnouncements({ initialAnnouncements }: { initialAnnouncements: AnnouncementItem[] }) {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'top_banner' | 'dashboard_card'>('all');

  // Form State for Live Preview
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState('info');
  const [formPlacement, setFormPlacement] = useState('top_banner');
  const [formAudience, setFormAudience] = useState('all');
  const [formActionText, setFormActionText] = useState('');
  const [formActionUrl, setFormActionUrl] = useState('');
  const [formIsDismissible, setFormIsDismissible] = useState(true);
  const [formPriority, setFormPriority] = useState(0);
  const [formStartsAt, setFormStartsAt] = useState('');
  const [formExpiresAt, setFormExpiresAt] = useState('');
  const [formBroadcast, setFormBroadcast] = useState(false);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setFormTitle('');
    setFormMessage('');
    setFormType('info');
    setFormPlacement('top_banner');
    setFormAudience('all');
    setFormActionText('');
    setFormActionUrl('');
    setFormIsDismissible(true);
    setFormPriority(0);
    setFormStartsAt('');
    setFormExpiresAt('');
    setFormBroadcast(false);
    setIsModalOpen(true);
  };

  const openEditModal = (ann: AnnouncementItem) => {
    setEditingAnnouncement(ann);
    setFormTitle(ann.title);
    setFormMessage(ann.message);
    setFormType(ann.type);
    setFormPlacement(ann.placement);
    setFormAudience(ann.targetAudience);
    setFormActionText(ann.actionText || '');
    setFormActionUrl(ann.actionUrl || '');
    setFormIsDismissible(ann.isDismissible);
    setFormPriority(ann.priority || 0);
    setFormStartsAt(ann.startsAt ? new Date(ann.startsAt).toISOString().slice(0, 16) : '');
    setFormExpiresAt(ann.expiresAt ? new Date(ann.expiresAt).toISOString().slice(0, 16) : '');
    setFormBroadcast(false);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic update
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: nextStatus } : a));
    try {
      await toggleAnnouncementStatusAction(id, nextStatus);
    } catch {
      // Revert if failed
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: currentStatus } : a));
      alert("Failed to update announcement status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    // Optimistic delete
    const previous = [...announcements];
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await deleteAnnouncementAction(id);
    } catch {
      setAnnouncements(previous);
      alert("Failed to delete announcement");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('isDismissible', formIsDismissible ? 'true' : 'false');
    formData.set('broadcastNotification', formBroadcast ? 'true' : 'false');

    try {
      if (editingAnnouncement) {
        await updateAnnouncementAction(editingAnnouncement.id, formData);
        setAnnouncements(prev => prev.map(a => {
          if (a.id === editingAnnouncement.id) {
            return {
              ...a,
              title: formTitle,
              message: formMessage,
              type: formType,
              placement: formPlacement,
              targetAudience: formAudience,
              actionText: formActionText || null,
              actionUrl: formActionUrl || null,
              isDismissible: formIsDismissible,
              priority: formPriority,
              startsAt: formStartsAt ? new Date(formStartsAt) : null,
              expiresAt: formExpiresAt ? new Date(formExpiresAt) : null,
            };
          }
          return a;
        }));
      } else {
        const res = await createAnnouncementAction(formData);
        if (res.announcement) {
          setAnnouncements(prev => [res.announcement as AnnouncementItem, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered view
  const filtered = announcements.filter(a => {
    if (activeTab === 'active') return a.isActive;
    if (activeTab === 'top_banner') return a.placement === 'top_banner';
    if (activeTab === 'dashboard_card') return a.placement === 'dashboard_card';
    return true;
  });

  const activeCount = announcements.filter(a => a.isActive).length;
  const bannerCount = announcements.filter(a => a.placement === 'top_banner' && a.isActive).length;
  const cardCount = announcements.filter(a => a.placement === 'dashboard_card' && a.isActive).length;

  return (
    <div className="space-y-[30px] p-[20px] lg:p-[40px] max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[20px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[8px]">
            Platform Announcements
          </h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">
            Publish targeted banners, spotlight cards, and modal broadcasts across Getlands.
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="px-[24px] py-[12px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)] flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Announcement
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
        <div className="bg-white rounded-[20px] p-[20px] border border-black/5 shadow-sm">
          <div className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider mb-[4px]">Total Created</div>
          <div className="font-manrope text-[28px] font-bold text-ink">{announcements.length}</div>
        </div>
        <div className="bg-white rounded-[20px] p-[20px] border border-black/5 shadow-sm">
          <div className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider mb-[4px]">Currently Active</div>
          <div className="font-manrope text-[28px] font-bold text-[#008b45]">{activeCount}</div>
        </div>
        <div className="bg-white rounded-[20px] p-[20px] border border-black/5 shadow-sm">
          <div className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider mb-[4px]">Active Top Banners</div>
          <div className="font-manrope text-[28px] font-bold text-ink">{bannerCount}</div>
        </div>
        <div className="bg-white rounded-[20px] p-[20px] border border-black/5 shadow-sm">
          <div className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider mb-[4px]">Active Spotlight Cards</div>
          <div className="font-manrope text-[28px] font-bold text-ink">{cardCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[8px] border-b border-black/5 pb-[12px] overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-[16px] py-[8px] rounded-full text-[13px] font-bold transition-colors ${
            activeTab === 'all' ? 'bg-[#182a20] text-white' : 'bg-white text-[#68736d] hover:bg-black/5'
          }`}
        >
          All ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-[16px] py-[8px] rounded-full text-[13px] font-bold transition-colors ${
            activeTab === 'active' ? 'bg-[#008b45] text-white' : 'bg-white text-[#68736d] hover:bg-black/5'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setActiveTab('top_banner')}
          className={`px-[16px] py-[8px] rounded-full text-[13px] font-bold transition-colors ${
            activeTab === 'top_banner' ? 'bg-[#182a20] text-white' : 'bg-white text-[#68736d] hover:bg-black/5'
          }`}
        >
          Top Banners
        </button>
        <button
          onClick={() => setActiveTab('dashboard_card')}
          className={`px-[16px] py-[8px] rounded-full text-[13px] font-bold transition-colors ${
            activeTab === 'dashboard_card' ? 'bg-[#182a20] text-white' : 'bg-white text-[#68736d] hover:bg-black/5'
          }`}
        >
          Spotlight Cards
        </button>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[80px_2.5fr_1.2fr_1.2fr_100px_140px] gap-[15px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Status</div>
          <div>Announcement & Message</div>
          <div>Placement & Audience</div>
          <div>Action / Link</div>
          <div>Priority</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-black/5">
          {filtered.map(ann => {
            const isExpired = ann.expiresAt && new Date(ann.expiresAt) < new Date();
            const isScheduled = ann.startsAt && new Date(ann.startsAt) > new Date();

            return (
              <div 
                key={ann.id} 
                className="grid grid-cols-1 lg:grid-cols-[80px_2.5fr_1.2fr_1.2fr_100px_140px] gap-[15px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors"
              >
                {/* Active Switch */}
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={ann.isActive} 
                      onChange={() => handleToggle(ann.id, ann.isActive)} 
                    />
                    <div className="w-[38px] h-[22px] bg-[#eef3ef] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#008b45]"></div>
                  </label>
                  <span className="block text-[10px] font-bold text-[#7a847f] uppercase mt-1">
                    {ann.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* Title & Message */}
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] ${
                      ann.type === 'promo' ? 'bg-[#eef3ef] text-[#008b45]' :
                      ann.type === 'warning' ? 'bg-[#fffbeb] text-[#d97706]' :
                      ann.type === 'critical' ? 'bg-red-50 text-red-600' :
                      'bg-[#f4f7f5] text-[#18201c]'
                    }`}>
                      {ann.type}
                    </span>
                    {isExpired && (
                      <span className="inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500">
                        Expired
                      </span>
                    )}
                    {isScheduled && (
                      <span className="inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600">
                        Scheduled
                      </span>
                    )}
                    <strong className="text-[14px] text-ink font-manrope">{ann.title}</strong>
                  </div>
                  <p className="text-[12px] text-[#68736d] line-clamp-2 leading-relaxed">{ann.message}</p>
                  {(ann.startsAt || ann.expiresAt) && (
                    <div className="text-[11px] text-[#7a847f] mt-1 flex gap-2">
                      {ann.startsAt && <span>Starts: {new Date(ann.startsAt).toLocaleDateString()}</span>}
                      {ann.expiresAt && <span>Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  )}
                </div>

                {/* Placement & Target */}
                <div className="space-y-1">
                  <div className="text-[12px] text-ink font-medium capitalize">
                    {ann.placement.replace('_', ' ')}
                  </div>
                  <span className="inline-flex px-[8px] py-[2px] bg-black/5 text-[#555] rounded text-[11px] font-mono">
                    Audience: {ann.targetAudience}
                  </span>
                </div>

                {/* Action CTA */}
                <div>
                  {ann.actionText ? (
                    <div>
                      <span className="block text-[12px] font-bold text-[#008b45]">{ann.actionText}</span>
                      <span className="text-[11px] text-[#7a847f] font-mono truncate block max-w-[140px]">{ann.actionUrl}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-[#a6baa9]">None</span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <span className="text-[13px] font-mono font-bold text-ink">P{ann.priority || 0}</span>
                  <span className="block text-[10px] text-[#7a847f]">{ann.isDismissible ? 'Dismissible' : 'Permanent'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => openEditModal(ann)} 
                    className="px-[12px] py-[6px] rounded-full bg-[#f4f7f5] text-ink text-[12px] font-bold hover:bg-black/5 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(ann.id, ann.title)} 
                    className="px-[12px] py-[6px] rounded-full bg-red-50 text-red-600 text-[12px] font-bold hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-[50px] text-center text-[13px] text-[#68736d]">
              <div className="w-[44px] h-[44px] rounded-full bg-[#f4f7f5] text-[#68736d] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <strong className="block text-ink text-[15px] mb-1">No Announcements Found</strong>
              <span>Create an announcement or adjust your filter tab above.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[800px] shadow-2xl overflow-hidden my-8">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h2 className="font-manrope text-[20px] font-bold text-ink">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Platform Announcement'}
                </h2>
                <p className="text-[12px] text-[#68736d]">Fill out the details below and view the live preview.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-[20px] lg:p-[30px] space-y-[25px]">
              {/* Live Preview Box */}
              <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5">
                <div className="flex items-center justify-between mb-[12px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a847f]">Live End-User Preview</span>
                  <span className="text-[11px] font-mono text-[#008b45] font-bold uppercase">{formPlacement.replace('_', ' ')}</span>
                </div>

                {formPlacement === 'top_banner' && (
                  <div className={`rounded-[12px] p-[12px_18px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] ${
                    formType === 'promo' ? 'bg-[#102218] text-white border-[#008b45]/30' :
                    formType === 'warning' ? 'bg-[#fffbeb] text-[#92400e] border-[#fcd34d]' :
                    formType === 'critical' ? 'bg-red-50 text-red-900 border-red-200' :
                    'bg-[#f4f7f5] text-ink border-black/10'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        formType === 'promo' ? 'bg-[#008b45] text-white' :
                        formType === 'warning' ? 'bg-[#d97706] text-white' :
                        formType === 'critical' ? 'bg-red-600 text-white' :
                        'bg-black/10 text-ink'
                      }`}>
                        {formType}
                      </span>
                      <span className="font-bold">{formTitle || 'Announcement Title'}</span>
                      <span className="opacity-80 hidden md:inline">— {formMessage || 'Your message preview will appear right here.'}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {formActionText && (
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold underline ${
                          formType === 'promo' ? 'text-[#a9e7bd]' : 'text-[#008b45]'
                        }`}>
                          {formActionText} →
                        </span>
                      )}
                      {formIsDismissible && (
                        <span className="opacity-60 cursor-pointer">✕</span>
                      )}
                    </div>
                  </div>
                )}

                {formPlacement === 'dashboard_card' && (
                  <div className={`rounded-[20px] p-[20px] border shadow-sm ${
                    formType === 'promo' ? 'bg-[#102218] text-white border-[#008b45]/30' :
                    formType === 'warning' ? 'bg-[#fffbeb] text-ink border-[#fcd34d]' :
                    formType === 'critical' ? 'bg-red-50 text-ink border-red-200' :
                    'bg-white text-ink border-black/5'
                  }`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          formType === 'promo' ? 'bg-[#008b45] text-white' :
                          formType === 'warning' ? 'bg-[#d97706] text-white' :
                          formType === 'critical' ? 'bg-red-600 text-white' :
                          'bg-[#eef3ef] text-[#008b45]'
                        }`}>
                          {formType}
                        </span>
                        <h4 className="font-manrope font-bold text-[16px]">{formTitle || 'Spotlight Title'}</h4>
                      </div>
                      {formIsDismissible && <span className="text-[#7a847f] text-sm">✕</span>}
                    </div>
                    <p className={`text-[13px] leading-relaxed mb-4 ${formType === 'promo' ? 'text-[#a6baa9]' : 'text-[#68736d]'}`}>
                      {formMessage || 'Spotlight cards appear directly on the customer overview or sales agent dashboard.'}
                    </p>
                    {formActionText && (
                      <span className={`inline-flex px-4 py-2 rounded-full text-[12px] font-bold ${
                        formType === 'promo' ? 'bg-[#008b45] text-white' : 'bg-[#182a20] text-white'
                      }`}>
                        {formActionText}
                      </span>
                    )}
                  </div>
                )}

                {formPlacement === 'modal_popup' && (
                  <div className="bg-white rounded-[20px] p-[25px] border border-black/10 shadow-lg max-w-[450px] mx-auto text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase mb-2 ${
                      formType === 'promo' ? 'bg-[#eef3ef] text-[#008b45]' :
                      formType === 'warning' ? 'bg-[#fffbeb] text-[#d97706]' :
                      formType === 'critical' ? 'bg-red-50 text-red-600' :
                      'bg-black/5 text-ink'
                    }`}>
                      {formType} Modal Notice
                    </span>
                    <h3 className="font-manrope font-bold text-[18px] text-ink mb-2">{formTitle || 'Important Platform Update'}</h3>
                    <p className="text-[13px] text-[#68736d] leading-relaxed mb-4">
                      {formMessage || 'Pop-up modals appear focused upon visiting the platform and ensure maximum user visibility.'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {formActionText && (
                        <span className="px-4 py-2 bg-[#008b45] text-white text-[12px] font-bold rounded-full">
                          {formActionText}
                        </span>
                      )}
                      <span className="px-4 py-2 bg-[#f4f7f5] text-ink text-[12px] font-bold rounded-full">
                        Dismiss
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Announcement Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Tomato Trading Cohort 4 is Now Open" 
                    required 
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors font-medium text-[14px]" 
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Message Body *</label>
                  <textarea 
                    name="message" 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Write your announcement details clearly..." 
                    required 
                    rows={3} 
                    className="w-full p-[15px] bg-[#f7f9f7] rounded-[12px] outline-none focus:border-[#008b45] border border-transparent transition-colors resize-none text-[13px]"
                  ></textarea>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Visual Severity Type</label>
                  <select 
                    name="type" 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium"
                  >
                    <option value="promo">Promo (Emerald Accent)</option>
                    <option value="info">System Info (Clean Ink)</option>
                    <option value="warning">Warning / Operational (Amber)</option>
                    <option value="critical">Critical / Urgent (Crimson)</option>
                  </select>
                </div>

                {/* Placement */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Display Placement</label>
                  <select 
                    name="placement" 
                    value={formPlacement}
                    onChange={(e) => setFormPlacement(e.target.value)}
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium"
                  >
                    <option value="top_banner">Top Global Banner (Pinned)</option>
                    <option value="dashboard_card">Dashboard Spotlight Card</option>
                    <option value="modal_popup">Focused Pop-up Modal</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Target Audience</label>
                  <select 
                    name="targetAudience" 
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium"
                  >
                    <option value="all">All Visitors (Public + Logged-in)</option>
                    <option value="customers">Customers / Investors Only</option>
                    <option value="agents">Sales Agents Only</option>
                    <option value="unverified_kyc">Unverified KYC Users Only</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Priority Level (Higher shows first)</label>
                  <input 
                    type="number" 
                    name="priority" 
                    value={formPriority}
                    onChange={(e) => setFormPriority(parseInt(e.target.value, 10) || 0)}
                    min="0" 
                    max="100" 
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium" 
                  />
                </div>

                {/* Action CTA Text */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Action Button Label (Optional)</label>
                  <input 
                    type="text" 
                    name="actionText" 
                    value={formActionText}
                    onChange={(e) => setFormActionText(e.target.value)}
                    placeholder="e.g. Invest Now, View Marketplace" 
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium" 
                  />
                </div>

                {/* Action CTA URL */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Action Link URL (Optional)</label>
                  <input 
                    type="text" 
                    name="actionUrl" 
                    value={formActionUrl}
                    onChange={(e) => setFormActionUrl(e.target.value)}
                    placeholder="e.g. /dashboard/marketplace or https://..." 
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium" 
                  />
                </div>

                {/* Scheduling StartsAt */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Publish Date / Time (Optional)</label>
                  <input 
                    type="datetime-local" 
                    name="startsAt" 
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium" 
                  />
                  <p className="text-[11px] text-[#7a847f] mt-1">Leave empty to publish immediately.</p>
                </div>

                {/* Scheduling ExpiresAt */}
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[6px]">Expiration Date / Time (Optional)</label>
                  <input 
                    type="datetime-local" 
                    name="expiresAt" 
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px] font-medium" 
                  />
                  <p className="text-[11px] text-[#7a847f] mt-1">Leave empty for no automatic expiration.</p>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="pt-2 border-t border-black/5 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsDismissible} 
                    onChange={(e) => setFormIsDismissible(e.target.checked)} 
                    className="w-4 h-4 rounded accent-[#008b45]" 
                  />
                  <div>
                    <strong className="block text-[13px] text-ink font-manrope">Allow user to dismiss</strong>
                    <span className="text-[11px] text-[#68736d]">When enabled, users can click close and it will not reappear on their device.</span>
                  </div>
                </label>

                {!editingAnnouncement && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formBroadcast} 
                      onChange={(e) => setFormBroadcast(e.target.checked)} 
                      className="w-4 h-4 rounded accent-[#008b45]" 
                    />
                    <div>
                      <strong className="block text-[13px] text-ink font-manrope">Broadcast as In-App Notification</strong>
                      <span className="text-[11px] text-[#68736d]">Also drops an alert in the target audience's notification bell inbox.</span>
                    </div>
                  </label>
                )}
              </div>

              <div className="pt-[10px]">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-[18px] h-[18px] border-[2px] border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Announcement...
                    </>
                  ) : (
                    editingAnnouncement ? "Update Announcement" : "Publish Announcement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
