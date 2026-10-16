"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appointSalesAgentAction, removeSalesAgentAction } from '@/app/actions/admin-customers';
import { toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface AgentRoleToggleProps {
  userId: string;
  initialRole: string;
  userName: string;
  referralCode?: string | null;
}

export default function AgentRoleToggle({ userId, initialRole, userName, referralCode }: AgentRoleToggleProps) {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: (() => void) | null;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  const handleAppoint = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Appoint as Sales Agent',
      message: `Are you sure you want to upgrade ${userName} to a Sales Agent? They will immediately receive access to the Agent Portal, a unique referral code, and a welcome notification email.`,
      isDestructive: false,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          const res = await appointSalesAgentAction(userId);
          if (res?.success) {
            setRole('sales');
            toast(`${userName} is now a Sales Agent!`, 'success');
            router.refresh();
          }
        } catch (err: any) {
          toast(err?.message || 'Failed to appoint sales agent', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDemote = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Sales Agent Status',
      message: `Are you sure you want to revert ${userName} back to a regular customer? Their personal investments will remain intact, but they will lose access to the Agent Portal.`,
      isDestructive: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          const res = await removeSalesAgentAction(userId);
          if (res?.success) {
            setRole('customer');
            toast('User role reverted to regular customer', 'success');
            router.refresh();
          }
        } catch (err: any) {
          toast(err?.message || 'Failed to remove sales agent role', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <>
      {role === 'sales' ? (
        <div className="flex items-center gap-[10px]">
          <div className="hidden sm:flex items-center gap-[6px] px-[12px] py-[8px] bg-[#eef3ef] border border-[#008b45]/20 text-[#008b45] text-[12px] font-bold rounded-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            <span>Sales Agent {referralCode ? `• ${referralCode}` : ''}</span>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleDemote}
            className="px-[16px] py-[10px] bg-white border border-black/10 text-[#68736d] hover:text-[#e53935] hover:border-[#e53935]/30 text-[13px] font-bold rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Demote to Customer'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={handleAppoint}
          className="flex items-center gap-[8px] px-[18px] py-[10px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)] disabled:opacity-50"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          {loading ? 'Promoting...' : 'Promote to Sales Agent'}
        </button>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.action || (() => {})}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        isDestructive={confirmConfig.isDestructive}
      />
    </>
  );
}
