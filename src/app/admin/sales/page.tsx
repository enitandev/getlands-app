"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';

export default function AdminSales() {
  const [activeTab, setActiveTab] = useState<'leads' | 'agents' | 'commissions'>('leads');

  const mockLeads = [
    { id: '1', name: 'Ngozi Okoro', email: 'ngozi@example.com', interest: 'Abeokuta Land Banking', status: 'new', date: '2 hrs ago' },
    { id: '2', name: 'David Smith', email: 'david@example.com', interest: 'Pepper Cycle Farm', status: 'contacted', date: 'Yesterday' },
    { id: '3', name: 'Chioma Adebayo', email: 'chioma@example.com', interest: '60x120 Plot', status: 'converted', date: '3 days ago' },
  ];

  const mockAgents = [
    { id: '1', name: 'Samuel Peters', activeLeads: 12, converted: 45, volume: 22500000 },
    { id: '2', name: 'Joy Essien', activeLeads: 8, converted: 31, volume: 15000000 },
  ];

  return (
    <div className="space-y-[30px]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Sales & Operations</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage leads, sales agents, and referral commissions.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('leads')}
          className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'leads' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}
        >
          Lead Pipeline
          {activeTab === 'leads' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('agents')}
          className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'agents' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}
        >
          Sales Agents
          {activeTab === 'agents' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('commissions')}
          className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'commissions' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}
        >
          Commissions
          {activeTab === 'commissions' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
            <div>Lead Details</div>
            <div>Expressed Interest</div>
            <div>Date</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          
          <div className="divide-y divide-black/5">
            {mockLeads.map(lead => (
              <div key={lead.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_80px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{lead.name}</strong>
                  <span className="text-[12px] text-[#68736d]">{lead.email}</span>
                </div>
                
                <div className="flex justify-between lg:block">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Interest</span>
                  <strong className="text-[13px] text-ink">{lead.interest}</strong>
                </div>
                
                <div className="flex justify-between lg:block text-[13px] text-[#68736d]">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Date</span>
                  {lead.date}
                </div>
                
                <div className="flex justify-between lg:block text-[13px]">
                  <span className="lg:hidden text-[12px] text-[#7a847f]">Status</span>
                  <span className={`inline-flex items-center px-[8px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] ${
                    lead.status === 'new' ? 'bg-[#eef3ef] text-[#008b45]' : 
                    lead.status === 'contacted' ? 'bg-[#fff8eb] text-[#f5a623]' : 
                    'bg-[#f3f4f6] text-[#68736d]'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="mt-[10px] lg:mt-0 text-right">
                  <div className="flex justify-end items-center gap-[15px]">
                    <button className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors" onClick={() => alert('Assign modal coming soon')}>
                      Assign
                    </button>
                    <button className="text-[13px] font-bold text-[#e53935] hover:underline transition-colors" onClick={() => window.confirm('Are you sure you want to delete this lead?')}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {mockAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-[20px] p-[24px] shadow-sm border border-black/5 flex flex-col justify-between">
              <div className="flex items-center gap-[15px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#008b45] flex items-center justify-center text-white font-bold text-[16px]">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <strong className="block text-[16px] text-ink">{agent.name}</strong>
                  <span className="text-[12px] text-[#68736d]">Sales Agent</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-[15px] mb-[20px] border-t border-b border-black/5 py-[15px]">
                <div>
                  <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Active Leads</div>
                  <strong className="text-[18px] font-manrope text-ink">{agent.activeLeads}</strong>
                </div>
                <div>
                  <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Converted</div>
                  <strong className="text-[18px] font-manrope text-ink">{agent.converted}</strong>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Total Volume</div>
                  <strong className="text-[16px] text-[#008b45]">{formatCurrency(agent.volume)}</strong>
                </div>
                <div className="flex gap-[15px]">
                  <button className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">Profile</button>
                  <button className="text-[13px] font-bold text-[#e53935] hover:underline transition-colors" onClick={() => window.confirm('Are you sure you want to remove this agent?')}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="bg-[#f7f9f7] rounded-[20px] p-[24px] border-2 border-dashed border-[#008b45]/30 flex flex-col items-center justify-center text-[#008b45] hover:bg-[#eef3ef]/50 transition-colors h-[220px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-[10px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="font-bold text-[14px]">Onboard New Agent</span>
          </button>
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="bg-white rounded-[20px] p-[40px] text-center border border-black/5 shadow-sm">
          <div className="w-[60px] h-[60px] bg-[#f7f9f7] rounded-full flex items-center justify-center mx-auto mb-[20px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#68736d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <h3 className="font-manrope text-[18px] font-bold text-ink mb-[10px]">No Pending Commissions</h3>
          <p className="text-[14px] text-[#68736d] max-w-[400px] mx-auto mb-[20px]">All referral payouts and agent commissions have been settled for this period.</p>
          <button className="px-[20px] py-[10px] bg-white border border-black/10 rounded-full text-[13px] font-bold text-ink hover:bg-[#f7f9f7]">
            View Commission History
          </button>
        </div>
      )}
    </div>
  );
}
