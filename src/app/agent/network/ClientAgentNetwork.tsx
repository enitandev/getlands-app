"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/mockData';
import { createProspectAction } from '@/app/actions/agent-crm';

export default function ClientAgentNetwork({ clients, initialProspects, referralCode }: any) {
  const [activeTab, setActiveTab] = useState<'clients' | 'prospects'>('clients');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCount = clients.filter((c: any) => c.holdings?.length > 0).length;

  const handleCreateProspect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createProspectAction(fd);
      setIsAdding(false);
      setActiveTab('prospects');
    } catch (err: any) {
      alert("Error adding prospect: " + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      
      <header className="mb-[30px] shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-[15px]">
        <div>
          <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">CRM & Network</h1>
          <p className="text-[14px] text-[#68736d]">{clients.length} signed up · {activeCount} with acquisitions</p>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={() => setIsAdding(true)} className="h-[42px] px-[20px] bg-white border border-[#008b45] text-[#008b45] text-[13px] font-bold rounded-full flex items-center justify-center hover:bg-[#f7f9f7] transition-colors w-fit">
            + Log Prospect
          </button>
          <Link href="/agent/draft" className="h-[42px] px-[20px] bg-[#008b45] text-white text-[13px] font-bold rounded-full flex items-center justify-center hover:bg-[#007339] transition-colors w-fit shadow-lg">
            Draft Portfolio
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-[30px] border-b border-black/5 mb-[20px] shrink-0">
        <button onClick={() => setActiveTab('clients')} className={`whitespace-nowrap pb-[15px] text-[14px] font-bold relative flex items-center gap-[8px] ${activeTab === 'clients' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Registered Clients
          <span className="bg-[#eef3ef] text-[#008b45] text-[10px] px-[6px] py-[2px] rounded-full">{clients.length}</span>
          {activeTab === 'clients' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('prospects')} className={`whitespace-nowrap pb-[15px] text-[14px] font-bold relative flex items-center gap-[8px] ${activeTab === 'prospects' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Pipeline (Prospects)
          <span className="bg-[#f7f9f7] text-[#68736d] text-[10px] px-[6px] py-[2px] rounded-full">{initialProspects.length}</span>
          {activeTab === 'prospects' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
      </div>

      <div className="flex-1 bg-white border border-black/5 rounded-[24px] overflow-hidden flex flex-col min-h-[400px]">
        {activeTab === 'clients' && (
          <div className="divide-y divide-black/5 flex-1 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="p-[60px] text-center">
                <h3 className="text-[16px] font-bold text-ink mb-[5px]">No registered clients</h3>
                <p className="text-[13px] text-[#68736d]">Share your link to get your first client.</p>
              </div>
            ) : (
              clients.map((c: any) => (
                <div key={c.id} className="p-[20px] flex items-center justify-between gap-[15px] hover:bg-[#fcfdfc] transition-colors">
                  <div className="flex items-center gap-[12px] min-w-0">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#008b45] font-bold text-[13px] shrink-0">
                      {c.firstName[0]}{c.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[14px] text-ink truncate">
                        {c.firstName} {c.lastName}
                        {c.role === 'sales' && <span className="ml-[8px] text-[10px] bg-amber-100 text-amber-700 px-[7px] py-[2px] rounded-full uppercase tracking-wider">Sub-agent</span>}
                      </div>
                      <div className="text-[12px] text-[#68736d] truncate">{c.email}</div>
                      <div className="text-[11px] text-[#7a847f] mt-[2px]">Joined {new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider mb-[4px] ${c.totalAcquired > 0 ? 'bg-green-100 text-green-700' : 'bg-[#f7f9f7] text-[#68736d]'}`}>
                      {c.status}
                    </span>
                    <div className="text-[13px] font-bold text-ink">{c.totalAcquired > 0 ? formatCurrency(c.totalAcquired) : '—'}</div>
                    {c.earned > 0 && <div className="text-[11px] text-[#008b45] font-bold">You earned {formatCurrency(c.earned)}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prospects' && (
          <div className="divide-y divide-black/5 flex-1 overflow-y-auto bg-[#fcfdfc]">
            {initialProspects.length === 0 ? (
              <div className="p-[60px] text-center">
                <h3 className="text-[16px] font-bold text-ink mb-[5px]">Your pipeline is empty</h3>
                <p className="text-[13px] text-[#68736d] mb-[15px]">Log people you meet offline so you don't forget to follow up.</p>
                <button onClick={() => setIsAdding(true)} className="px-[20px] py-[10px] bg-[#008b45] text-white text-[13px] font-bold rounded-full">
                  + Add Prospect
                </button>
              </div>
            ) : (
              initialProspects.map((p: any) => (
                <div key={p.id} className="p-[20px] flex items-center justify-between gap-[15px]">
                  <div>
                    <div className="font-bold text-[14px] text-ink flex items-center gap-[10px]">
                      {p.name}
                      <span className={`text-[10px] px-[6px] py-[2px] rounded-full font-bold tracking-wider ${
                        p.interestLevel === 'HOT' ? 'bg-red-100 text-red-700' :
                        p.interestLevel === 'WARM' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {p.interestLevel}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#68736d] mt-[4px]">
                      {p.phone || p.email || 'No contact info'}
                    </div>
                    {p.notes && <div className="text-[12px] text-ink/70 mt-[4px] italic">"{p.notes}"</div>}
                  </div>
                  <div className="text-right text-[12px]">
                    {p.nextFollowUp && (
                      <div className="text-amber-600 font-bold bg-amber-50 px-[8px] py-[4px] rounded-md border border-amber-100">
                        Follow up: {new Date(p.nextFollowUp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-[20px]">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] p-[30px]">
            <h2 className="text-[24px] font-manrope font-bold text-ink mb-[20px]">Log Prospect</h2>
            <form onSubmit={handleCreateProspect} className="space-y-[15px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[5px]">Name *</label>
                <input type="text" name="name" required className="w-full h-[45px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] outline-none text-[14px]" />
              </div>
              <div className="grid grid-cols-2 gap-[15px]">
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[5px]">Phone</label>
                  <input type="text" name="phone" className="w-full h-[45px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] outline-none text-[14px]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[5px]">Interest</label>
                  <select name="interestLevel" className="w-full h-[45px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] outline-none text-[14px]">
                    <option value="COLD">Cold</option>
                    <option value="WARM">Warm</option>
                    <option value="HOT">Hot</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[5px]">Next Follow-up Date</label>
                <input type="date" name="nextFollowUp" className="w-full h-[45px] px-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] outline-none text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[5px]">Notes</label>
                <textarea name="notes" rows={3} className="w-full p-[15px] rounded-[12px] border border-black/10 focus:border-[#008b45] outline-none text-[14px] resize-none"></textarea>
              </div>
              <div className="flex gap-[10px] mt-[20px]">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 h-[45px] rounded-full border border-black/10 font-bold text-[#68736d] hover:bg-[#f7f9f7]">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 h-[45px] rounded-full bg-[#008b45] text-white font-bold hover:bg-[#007339] disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Prospect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
