"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { createLeadAction, deleteLeadAction, updateLeadStatusAction } from '@/app/actions/admin-ops';

export default function ClientSales({ initialLeads, agents }: { initialLeads: any[], agents: any[] }) {
  const [activeTab, setActiveTab] = useState('leads');
  const [isAddingLead, setIsAddingLead] = useState(false);

  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createLeadAction(fd);
    setIsAddingLead(false);
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[20px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Sales & Operations</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage leads, sales agents, and referral commissions.</p>
        </div>
        {activeTab === 'leads' && (
          <button onClick={() => setIsAddingLead(true)} className="px-[24px] py-[12px] bg-[#008b45] text-white text-[14px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
            + New Lead
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-[30px] border-b border-black/5">
        <button onClick={() => setActiveTab('leads')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'leads' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Lead Pipeline
          {activeTab === 'leads' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('agents')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'agents' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Sales Agents
          {activeTab === 'agents' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          
          {isAddingLead && (
            <div className="p-[24px] bg-[#f7f9f7] border-b border-black/5">
              <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-4 gap-[15px]">
                <input type="text" name="name" placeholder="Lead Name" required className="h-[45px] px-[15px] rounded-[10px] border border-black/10 text-[13px] outline-none focus:border-[#008b45]" />
                <input type="email" name="email" placeholder="Lead Email" required className="h-[45px] px-[15px] rounded-[10px] border border-black/10 text-[13px] outline-none focus:border-[#008b45]" />
                <input type="text" name="expressedInterest" placeholder="Interest (e.g. Tomato Farm)" required className="h-[45px] px-[15px] rounded-[10px] border border-black/10 text-[13px] outline-none focus:border-[#008b45]" />
                <div className="flex gap-[10px]">
                  <button type="submit" className="flex-1 bg-[#008b45] text-white rounded-[10px] font-bold text-[13px]">Add</button>
                  <button type="button" onClick={() => setIsAddingLead(false)} className="px-[15px] bg-white border border-black/10 rounded-[10px] font-bold text-[13px] text-ink">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
            <div>Lead Details</div>
            <div>Expressed Interest</div>
            <div>Date Added</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          
          <div className="divide-y divide-black/5">
            {initialLeads.map(lead => (
              <div key={lead.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_80px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{lead.name}</strong>
                  <span className="text-[12px] text-[#68736d]">{lead.email}</span>
                </div>
                
                <div className="flex justify-between lg:block">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Interest</span>
                  <strong className="text-[13px] text-ink">{lead.expressedInterest}</strong>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#68736d]">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Date</span>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between lg:block text-[13px]">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Status</span>
                  <select 
                    value={lead.status} 
                    onChange={(e) => updateLeadStatusAction(lead.id, e.target.value)}
                    className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] outline-none cursor-pointer ${
                      lead.status === 'NEW' ? 'bg-[#eef3ef] text-[#008b45]' : 
                      lead.status === 'CONTACTED' ? 'bg-[#fff8eb] text-[#f5a623]' : 
                      'bg-[#f3f4f6] text-[#68736d]'
                    }`}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CONVERTED">Converted</option>
                  </select>
                </div>
                
                <div className="mt-[10px] lg:mt-0 text-right">
                  <button className="text-[13px] font-bold text-[#e53935] hover:underline transition-colors" onClick={() => { if(window.confirm('Delete lead?')) deleteLeadAction(lead.id) }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {initialLeads.length === 0 && (
              <div className="p-[40px] text-center text-[#68736d] text-[14px]">No leads found. Click "+ New Lead" to add one.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-[20px] p-[24px] shadow-sm border border-black/5 flex flex-col justify-between">
              <div className="flex items-center gap-[15px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#008b45] flex items-center justify-center text-white font-bold text-[16px]">
                  {agent.firstName.charAt(0)}
                </div>
                <div>
                  <strong className="block text-[16px] text-ink">{agent.firstName} {agent.lastName}</strong>
                  <span className="text-[12px] text-[#68736d]">{agent.email}</span>
                </div>
              </div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Commissions Earned</div>
              <strong className="text-[18px] font-manrope text-[#008b45]">{formatCurrency(agent.commissions?.reduce((acc: number, cur: any) => acc + cur.amount, 0) || 0)}</strong>
            </div>
          ))}
          {agents.length === 0 && (
            <div className="col-span-full p-[40px] text-center bg-white border border-black/5 rounded-[20px] text-[#68736d] text-[14px]">
              No users have the "sales" role yet. You can assign this role in the database.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
