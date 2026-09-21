"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatCurrency } from '@/lib/mockData';
import { addLegacyCustomerAction, assignOpportunityAction, deleteCustomerAction, sendInviteAction } from '@/app/actions/admin-customers';

export default function ClientCustomers({ users, opportunities }: { users: any[], opportunities: any[] }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, title: string, message: string, action: (() => void) | null, isDestructive?: boolean}>({
    isOpen: false, title: '', message: '', action: null
  });

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addLegacyCustomerAction(formData);
    setLoading(false);
    
    if (res.error) {
      toast(res.error || "An error occurred.");
    } else {
      const wasEmailSent = formData.get('sendEmail') === 'on';
      if (wasEmailSent) {
        toast("Customer successfully created! A welcome email with an account claim link has been sent to them.");
      } else {
        toast("Customer successfully created! You can now assign them an opportunity.");
      }
      setIsAddModalOpen(false);
    }
  }

  async function handleAssignOpportunity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await assignOpportunityAction(formData);
    setLoading(false);

    if (res.error) {
      toast(res.error || "An error occurred.");
    } else {
      toast("Opportunity successfully assigned and documents generated!");
      setIsAssignModalOpen(false);
    }
  }

  return (
    <div className="space-y-[30px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[20px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Customers</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage registered users, view portfolios, and manually assign opportunities.</p>
        </div>
        <div className="flex gap-[15px] w-full lg:w-auto">
          <button onClick={() => setIsAddModalOpen(true)} className="flex-1 lg:flex-none px-[20px] py-[12px] bg-white border border-black/10 text-ink text-[13px] font-bold rounded-full hover:bg-[#f7f9f7] transition-colors">
            Add Customer
          </button>
          <button onClick={() => setIsAssignModalOpen(true)} className="flex-1 lg:flex-none px-[20px] py-[12px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
            Assign Opportunity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Customer Details</div>
          <div>Joined</div>
          <div>Holdings Count</div>
          <div>Portfolio Value</div>
          <div className="text-right">Action</div>
        </div>
        
        <div className="divide-y divide-black/5">
          {users.map(c => (
            <div key={c.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_80px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[16px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
              <div className="flex gap-[15px] items-center">
                <div className="w-[40px] h-[40px] rounded-full bg-[#eef3ef] flex items-center justify-center text-[#008b45] font-bold text-[14px]">
                  {c.firstName.charAt(0) + c.lastName.charAt(0)}
                </div>
                <div>
                  <strong className="block text-[14px] text-ink">{c.firstName + ' ' + c.lastName}</strong>
                  <span className="text-[12px] text-[#68736d] truncate">{c.email}</span>
                </div>
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-[#68736d]">
                <span className="lg:hidden text-[12px] text-[#7a847f]">Joined</span>
                {c.joined}
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-ink">
                <span className="lg:hidden text-[12px] text-[#7a847f]">Holdings Count</span>
                <strong className="font-manrope">{c.holdings}</strong>
              </div>
              
              <div className="flex justify-between lg:block text-[13px]">
                <span className="lg:hidden text-[12px] text-[#7a847f]">Portfolio Value</span>
                <strong className="text-[14px] text-[#008b45]">{formatCurrency(c.totalValue)}</strong>
              </div>
              
              <div className="mt-[10px] lg:mt-0 text-right">
                <div className="flex justify-end items-center gap-[15px]">
                  <button 
                    className="text-[13px] font-bold text-ink hover:text-[#008b45] transition-colors disabled:opacity-50" 
                    disabled={loading}
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: 'Send Invite',
                        message: `This will send a 'Claim Account' email to ${c.firstName} with a secure link to set their password. Proceed?`,
                        isDestructive: false,
                        action: async () => {
                          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                          setLoading(true);
                          const res = await sendInviteAction(c.id);
                          setLoading(false);
                          if(res.error) toast(res.error, 'error');
                          else toast("Invite sent successfully!", 'success');
                        }
                      });
                    }}>
                    Send Invite
                  </button>
                  <Link href={`/admin/customers/${c.id}`} className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">
                    Profile
                  </Link>
                  <button 
                    className="text-[13px] font-bold text-[#e53935] hover:underline transition-colors disabled:opacity-50" 
                    disabled={loading}
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: 'Delete Customer',
                        message: 'Are you sure you want to delete this customer? This will also permanently delete their transactions and holdings.',
                        isDestructive: true,
                        action: async () => {
                          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                          setLoading(true);
                          await deleteCustomerAction(c.id);
                          setLoading(false);
                          toast('Customer deleted successfully', 'success');
                        }
                      });
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-white z-10 shrink-0">
              <h2 className="font-manrope text-[20px] font-bold text-ink tracking-[-0.03em]">Add Legacy Customer</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-[20px] lg:p-[30px]">
              <form id="add-customer-form" onSubmit={handleAddCustomer} className="space-y-[20px]">
                <div className="grid grid-cols-2 gap-[15px]">
                  <div>
                    <label className="block text-[13px] font-bold text-ink mb-[8px]">First Name</label>
                    <input name="firstName" type="text" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-ink mb-[8px]">Last Name</label>
                    <input name="lastName" type="text" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                  <input name="email" type="email" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                  <input name="phone" type="tel" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" />
                </div>
                <div className="flex items-center gap-[10px] mt-[10px]">
                  <input type="checkbox" name="sendEmail" id="sendEmail" defaultChecked className="w-[18px] h-[18px] accent-[#008b45]" />
                  <label htmlFor="sendEmail" className="text-[13px] text-ink cursor-pointer">Send 'Claim Account' Email instantly</label>
                </div>
              </form>
            </div>

            <div className="p-[20px] lg:p-[30px] border-t border-black/5 bg-white shrink-0">
              <button form="add-customer-form" type="submit" disabled={loading} className="w-full py-[14px] bg-[#008b45] text-white font-bold text-[14px] rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)] disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-white z-10 shrink-0">
              <h2 className="font-manrope text-[20px] font-bold text-ink tracking-[-0.03em]">Assign Opportunity</h2>
              <button type="button" onClick={() => setIsAssignModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-[20px] lg:p-[30px]">
              <form id="assign-opportunity-form" onSubmit={handleAssignOpportunity} className="space-y-[20px]">
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Select Customer</label>
                  <select name="userId" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required>
                    <option value="">-- Choose a customer --</option>
                    {users.map(c => <option key={c.id} value={c.id}>{c.firstName + ' ' + c.lastName} ({c.email})</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Select Opportunity</label>
                  <select name="opportunityId" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required>
                    <option value="">-- Choose an opportunity --</option>
                    {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-[15px]">
                  <div>
                    <label className="block text-[13px] font-bold text-ink mb-[8px]">Amount Paid (₦)</label>
                    <input name="amountPaid" type="number" step="0.01" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-ink mb-[8px]">Units</label>
                    <input name="units" type="number" step="0.01" defaultValue="1" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Date Acquired (Important for backdating)</label>
                  <input name="dateAcquired" type="date" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" required />
                  <p className="text-[11px] text-[#68736d] mt-[5px]">Maturity calculations will be based on this date.</p>
                </div>

                <div className="bg-[#eef3ef]/50 border border-[#008b45]/20 rounded-[12px] p-[15px] flex gap-[10px] items-start">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <p className="text-[11px] text-[#4a554f] leading-[1.5]">
                    <strong>Note on Documentation:</strong> Completing this assignment will automatically generate the required Receipt, Investment Certificate, and MOU for the customer based on the amount and date specified above.
                  </p>
                </div>
              </form>
            </div>
            
            <div className="p-[20px] lg:p-[30px] border-t border-black/5 bg-white shrink-0">
              <button form="assign-opportunity-form" type="submit" disabled={loading} className="w-full py-[14px] bg-[#008b45] text-white font-bold text-[14px] rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)] disabled:opacity-50">
                {loading ? 'Assigning...' : 'Assign & Generate Documents'}
              </button>
            </div>
          </div>
        </div>
      )}
    
      
    
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
        confirmText={confirmConfig.isDestructive ? "Delete" : "Send Email"}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action();
        }}
      />
    </div>  );
}
