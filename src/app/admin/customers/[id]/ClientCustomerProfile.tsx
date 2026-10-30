"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';
import { toCustomerSlug, getCustomerProfileUrl } from '@/lib/customerSlug';
import { toast } from '@/components/ui/Toast';
import {
  updateCustomerProfileAction,
  upsertCustomerBankAccountAction,
  assignOpportunityAction,
  editCustomerHoldingAction,
  adjustCustomerWalletAction,
  generateClaimLinkAction,
  impersonateUserAction,
  deleteCustomerAction,
  createCustomPayoutAction,
  deleteScheduledPayoutAction
} from '@/app/actions/admin-customers';
import { deleteHoldingAction, approveDraftHoldingAction } from '@/app/actions/admin-ops';
import { approveTransaction, rejectTransaction } from '@/app/actions/admin';
import AgentRoleToggle from './AgentRoleToggle';
import { RecordReferralModal } from '../LegacyReferralModal';
import ClientPayoutRow from '../../finance/ClientPayoutRow';
import ClientCommissionRow from '../../finance/ClientCommissionRow';

type ProfileTab = 'overview' | 'holdings' | 'payouts' | 'referrals' | 'transactions' | 'details';

export default function ClientCustomerProfile({
  user,
  ledger,
  referrer,
  referredUsers = [],
  opportunities = [],
  returnPlans = [],
  allUsers = []
}: {
  user: any;
  ledger: any;
  referrer?: any;
  referredUsers?: any[];
  opportunities?: any[];
  returnPlans?: any[];
  allUsers?: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isAssignHoldingOpen, setIsAssignHoldingOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAddPayoutOpen, setIsAddPayoutOpen] = useState(false);

  // Assign holding form state
  const [selectedOppId, setSelectedOppId] = useState(opportunities[0]?.id || '');
  const [walletMode, setWalletMode] = useState<'credit' | 'deduct'>('credit');

  const cleanSlug = toCustomerSlug(user);

  // Replace ugly UUID in browser address bar with clean human-readable slug
  useEffect(() => {
    if (typeof window !== 'undefined' && cleanSlug) {
      const targetPath = `/admin/customers/${cleanSlug}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, '', targetPath);
      }
    }
  }, [cleanSlug]);

  const activeBank = user.bankAccounts?.find((b: any) => b.status === 'active');
  const displayBankName = activeBank?.bankName || user.bankName || '';
  const displayAccountNumber = activeBank?.accountNumber || user.accountNumber || '';
  const displayAccountName =
    activeBank?.accountName || user.accountName || `${user.firstName} ${user.lastName}`.trim();

  const totalPortfolioValue = (user.holdings || [])
    .filter((h: any) => h.status === 'active')
    .reduce((sum: number, h: any) => sum + (h.totalAmount || 0), 0);
  const activeHoldingsCount = (user.holdings || []).filter((h: any) => h.status === 'active').length;

  const pendingPayoutsCount = (ledger?.payouts || []).filter((p: any) => p.status === 'PENDING').length;
  const pendingCommissionsCount = (ledger?.commissions || []).filter(
    (c: any) => c.status === 'PENDING'
  ).length;

  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard`, 'success');
  };

  const handleCopyClaimLink = async (sendEmail: boolean) => {
    setLoading(true);
    const res = await generateClaimLinkAction(user.id, sendEmail);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else if (res?.claimUrl) {
      navigator.clipboard.writeText(res.claimUrl);
      toast(
        sendEmail
          ? 'Claim email sent and link copied to clipboard!'
          : 'Account setup link copied! You can paste it into WhatsApp.',
        'success'
      );
    }
  };

  const handleImpersonate = async () => {
    if (
      !confirm(
        `Log in as ${user.firstName} ${user.lastName}? You can return to Admin at any time from the top banner.`
      )
    )
      return;
    setLoading(true);
    try {
      const res = await impersonateUserAction(user.id);
      if (res.success) {
        window.location.href = res.targetRole === 'sales' ? '/agent' : '/dashboard';
      }
    } catch (e: any) {
      toast(e.message || 'Failed to impersonate user', 'error');
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (
      !confirm(
        `Are you sure you want to permanently delete ${user.firstName} ${user.lastName} and all their holdings and transactions? This cannot be undone.`
      )
    )
      return;
    setLoading(true);
    const res = await deleteCustomerAction(user.id);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Customer deleted', 'info');
      router.push('/admin/customers');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('userId', user.id);
    const res = await updateCustomerProfileAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Customer profile updated!', 'success');
      setIsEditProfileOpen(false);
      router.refresh();
    }
  };

  const handleSaveBank = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('userId', user.id);
    const res = await upsertCustomerBankAccountAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Bank account saved for customer!', 'success');
      setIsBankModalOpen(false);
      router.refresh();
    }
  };

  const handleAssignHolding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('userId', user.id);
    const res = await assignOpportunityAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Investment assigned, payout schedule generated, and customer notified!', 'success');
      setIsAssignHoldingOpen(false);
      router.refresh();
    }
  };

  const handleEditHolding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingHolding) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('holdingId', editingHolding.id);
    const res = await editCustomerHoldingAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Holding updated successfully!', 'success');
      setEditingHolding(null);
      router.refresh();
    }
  };

  const handleDeleteHolding = async (holdingId: string, title: string) => {
    if (
      !confirm(
        `Delete holding "${title}"? This will also delete its scheduled payouts and linked commissions.`
      )
    )
      return;
    setLoading(true);
    try {
      await deleteHoldingAction(holdingId);
      toast('Holding deleted', 'info');
      router.refresh();
    } catch (e: any) {
      toast(e.message || 'Failed to delete holding', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDraftHolding = async (holdingId: string) => {
    if (!confirm('Approve and activate this pending holding?')) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set('holdingId', holdingId);
      await approveDraftHoldingAction(fd);
      toast('Holding activated and payout schedule created!', 'success');
      router.refresh();
    } catch (e: any) {
      toast(e.message || 'Failed to approve holding', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('userId', user.id);
    fd.set('mode', walletMode);
    const res = await adjustCustomerWalletAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Wallet balance updated!', 'success');
      setIsWalletModalOpen(false);
      router.refresh();
    }
  };

  const handleAddCustomPayout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set('userId', user.id);
    const res = await createCustomPayoutAction(fd);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Custom payout scheduled!', 'success');
      setIsAddPayoutOpen(false);
      router.refresh();
    }
  };

  const handleDeletePayout = async (payoutId: string) => {
    if (!confirm('Remove this scheduled payout installment?')) return;
    setLoading(true);
    const res = await deleteScheduledPayoutAction(payoutId);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Scheduled payout removed', 'info');
      router.refresh();
    }
  };

  const handleApproveTx = async (txId: string) => {
    setLoading(true);
    const res = await approveTransaction(txId);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Transaction approved!', 'success');
      router.refresh();
    }
  };

  const handleRejectTx = async (txId: string) => {
    if (!confirm('Reject this pending transaction?')) return;
    setLoading(true);
    const res = await rejectTransaction(txId);
    setLoading(false);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Transaction rejected', 'info');
      router.refresh();
    }
  };

  return (
    <div className="space-y-[30px] max-w-[1150px] mx-auto pb-[80px]">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[15px]">
          <Link
            href="/admin/customers"
            className="w-[40px] h-[40px] bg-white border border-black/10 rounded-full flex items-center justify-center text-ink hover:bg-[#f7f9f7] transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-[10px] flex-wrap">
              <h1 className="font-manrope text-[24px] lg:text-[30px] tracking-[-0.03em] font-bold text-ink leading-none">
                {user.firstName} {user.lastName}
              </h1>
              {user.role === 'sales' ? (
                <span className="px-[10px] py-[4px] bg-[#f5a623]/15 text-[#b26a00] text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Sales Agent {user.referralCode ? `• ${user.referralCode}` : ''}
                </span>
              ) : (
                <span className="px-[10px] py-[4px] bg-black/5 text-[#68736d] text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Customer
                </span>
              )}
              <span
                className={`px-[10px] py-[4px] text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  user.kycStatus === 'verified'
                    ? 'bg-[#eef3ef] text-[#008b45]'
                    : user.kycStatus === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                KYC: {user.kycStatus || 'unverified'}
              </span>
            </div>
            <p className="text-[13px] text-[#68736d] mt-[6px]">
              {user.email}
              {user.phoneNumber ? ` • ${user.phoneNumber}` : ''}
              {' • Joined '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-[8px]">
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="px-[14px] py-[9px] bg-white border border-black/10 hover:border-[#008b45] text-ink hover:text-[#008b45] text-[12px] font-bold rounded-full transition-colors"
          >
            Edit Profile &amp; KYC
          </button>
          <button
            type="button"
            onClick={() => setIsAssignHoldingOpen(true)}
            className="px-[16px] py-[9px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-colors shadow-sm"
          >
            + Assign Investment
          </button>
          <button
            type="button"
            onClick={() => handleCopyClaimLink(false)}
            disabled={loading}
            className="px-[14px] py-[9px] bg-white border border-black/10 hover:bg-[#f7f9f7] text-ink text-[12px] font-bold rounded-full transition-colors"
            title="Copy password setup link to share on WhatsApp"
          >
            Copy Claim Link
          </button>
          <button
            type="button"
            onClick={handleImpersonate}
            disabled={loading}
            className="px-[14px] py-[9px] bg-[#182a20] hover:bg-black text-white text-[12px] font-bold rounded-full transition-colors"
          >
            Login As {user.firstName}
          </button>
          <AgentRoleToggle
            userId={user.id}
            initialRole={user.role}
            userName={`${user.firstName} ${user.lastName}`}
            referralCode={user.referralCode}
          />
          <RecordReferralModal referrerUserId={user.id} />
        </div>
      </div>

      {/* Key Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[14px]">
        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm">
          <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
            Active Portfolio
          </span>
          <strong className="font-manrope text-[20px] font-bold text-[#008b45] block leading-tight">
            {formatCurrency(totalPortfolioValue)}
          </strong>
          <span className="text-[11px] text-[#68736d] mt-[4px] block">
            {activeHoldingsCount} active holding{activeHoldingsCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
              Wallet Balance
            </span>
            <strong className="font-manrope text-[20px] font-bold text-ink block leading-tight">
              {formatCurrency(user.walletBalance || 0)}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => setIsWalletModalOpen(true)}
            className="text-[11px] font-bold text-[#008b45] hover:underline text-left mt-[6px]"
          >
            + Adjust Balance &rarr;
          </button>
        </div>

        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm">
          <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
            Total Invested
          </span>
          <strong className="font-manrope text-[20px] font-bold text-ink block leading-tight">
            {formatCurrency(ledger?.totalDeposited || totalPortfolioValue)}
          </strong>
          <span className="text-[11px] text-[#68736d] mt-[4px] block">
            All-time capital inflow
          </span>
        </div>

        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm">
          <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
            Scheduled ROI
          </span>
          <strong className="font-manrope text-[20px] font-bold text-[#008b45] block leading-tight">
            {formatCurrency(ledger?.totalExpectedROI || 0)}
          </strong>
          <span className="text-[11px] text-[#68736d] mt-[4px] block">
            {pendingPayoutsCount} pending payout{pendingPayoutsCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm">
          <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
            Bank Account
          </span>
          {displayBankName && displayAccountNumber ? (
            <>
              <strong className="font-mono text-[15px] font-bold text-ink block leading-tight">
                {displayAccountNumber}
              </strong>
              <span className="text-[11px] text-[#68736d] truncate block mt-[2px]">
                {displayBankName}
              </span>
            </>
          ) : (
            <span className="text-[12px] text-amber-600 font-bold block">No bank saved</span>
          )}
          <button
            type="button"
            onClick={() => setIsBankModalOpen(true)}
            className="text-[11px] font-bold text-[#008b45] hover:underline text-left mt-[4px]"
          >
            {displayAccountNumber ? 'Edit Bank →' : '+ Add Bank →'}
          </button>
        </div>

        <div className="bg-white p-[18px] rounded-[20px] border border-black/5 shadow-sm">
          <span className="block text-[10px] text-[#7a847f] font-bold uppercase tracking-wider mb-[4px]">
            Referral Network
          </span>
          <strong className="font-manrope text-[20px] font-bold text-ink block leading-tight">
            {referredUsers.length} Client{referredUsers.length === 1 ? '' : 's'}
          </strong>
          <span className="text-[11px] text-[#68736d] mt-[4px] block">
            {pendingCommissionsCount > 0
              ? `${pendingCommissionsCount} commission due`
              : referrer
                ? `Ref by ${referrer.firstName}`
                : 'Direct signup'}
          </span>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex gap-[24px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        {([
          { id: 'overview', label: 'Full Overview' },
          { id: 'holdings', label: `Holdings & Docs (${user.holdings?.length || 0})` },
          { id: 'payouts', label: `Scheduled Payouts (${ledger?.payouts?.length || 0})` },
          {
            id: 'referrals',
            label: `Referrals & Commissions (${(ledger?.commissions?.length || 0) + referredUsers.length})`
          },
          { id: 'transactions', label: `Transactions (${user.transactions?.length || 0})` },
          { id: 'details', label: 'Personal, KYC & Bank' }
        ] as const).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`whitespace-nowrap pb-[14px] text-[13px] font-bold relative transition-colors ${
              activeTab === t.id ? 'text-ink' : 'text-[#68736d] hover:text-ink'
            }`}
          >
            {t.label}
            {activeTab === t.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>
            )}
          </button>
        ))}
      </div>

      {/* HOLDINGS & DOCUMENTS SECTION */}
      {(activeTab === 'overview' || activeTab === 'holdings') && (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
            <div>
              <h3 className="font-manrope text-[16px] font-bold text-ink">
                Investment Holdings &amp; Legal Documents
              </h3>
              <p className="text-[12px] text-[#68736d]">
                View, edit, or assign holdings and download official receipts, agreements, and certificates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAssignHoldingOpen(true)}
              className="px-[16px] py-[8px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-colors w-fit"
            >
              + Assign New Investment
            </button>
          </div>

          <div className="divide-y divide-black/5">
            {(!user.holdings || user.holdings.length === 0) ? (
              <div className="p-[40px] text-center text-[13px] text-[#68736d]">
                No holdings found for this customer yet. Click &ldquo;+ Assign New Investment&rdquo; above to add one.
              </div>
            ) : (
              user.holdings.map((h: any) => (
                <div
                  key={h.id}
                  className="p-[20px_24px] flex flex-col lg:flex-row justify-between lg:items-center gap-[20px] hover:bg-[#fcfdfc] transition-colors"
                >
                  <div className="space-y-[6px]">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <strong className="text-[16px] text-ink">
                        {h.opportunity?.title || 'Investment Holding'}
                      </strong>
                      <span
                        className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          h.status === 'active'
                            ? 'bg-[#eef3ef] text-[#008b45]'
                            : h.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {h.status}
                      </span>
                      {h.planName && (
                        <span className="px-[8px] py-[2px] bg-black/5 text-ink text-[10px] font-bold rounded-full">
                          {h.planName}
                        </span>
                      )}
                      {h.ratePercent && (
                        <span className="px-[8px] py-[2px] bg-[#eef3ef] text-[#008b45] text-[10px] font-bold rounded-full">
                          {h.ratePercent}% ROI
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] text-[#68736d]">
                      Acquired: <strong>{new Date(h.dateAcquired).toLocaleDateString()}</strong> •{' '}
                      <strong>{h.units}</strong> Unit{h.units === 1 ? '' : 's'}
                      {h.maturityDate && (
                        <span>
                          {' '}
                          • Maturity: <strong>{new Date(h.maturityDate).toLocaleDateString()}</strong>
                        </span>
                      )}
                      {h.referenceCode && (
                        <span className="font-mono text-[12px] ml-[6px] text-[#7a847f]">
                          ({h.referenceCode})
                        </span>
                      )}
                    </div>

                    <div className="text-[18px] font-manrope font-bold text-[#008b45]">
                      {formatCurrency(h.totalAmount)}
                    </div>

                    <div className="flex items-center gap-[12px] pt-[4px] flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditingHolding(h)}
                        className="text-[12px] font-bold text-[#182a20] hover:text-[#008b45] underline"
                      >
                        Edit Holding / Terms
                      </button>
                      {h.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleApproveDraftHolding(h.id)}
                          className="text-[12px] font-bold text-[#008b45] hover:underline"
                        >
                          Approve &amp; Activate
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteHolding(h.id, h.opportunity?.title || 'Holding')
                        }
                        className="text-[12px] font-bold text-[#e53935] hover:underline"
                      >
                        Delete Holding
                      </button>
                    </div>
                  </div>

                  {/* Document Links */}
                  <div className="flex flex-wrap lg:flex-col gap-[10px] lg:items-end">
                    <a
                      href={`/api/documents/receipt/${h.id}?t=${Date.now()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-[12px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] rounded-full flex items-center gap-[8px] text-[12px] font-bold text-[#008b45] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      Official Receipt
                    </a>

                    <a
                      href={`/api/documents/agreement/${h.id}?t=${Date.now()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-[12px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] rounded-full flex items-center gap-[8px] text-[12px] font-bold text-[#008b45] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      Subscription Agreement
                    </a>

                    {h.opportunity?.category !== 'land-banking' && (
                      <a
                        href={`/api/documents/certificate/${h.id}?t=${Date.now()}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-[12px] py-[6px] bg-[#f7f9f7] hover:bg-[#eef3ef] rounded-full flex items-center gap-[8px] text-[12px] font-bold text-[#008b45] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Investment Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SCHEDULED PAYOUTS SECTION */}
      {(activeTab === 'overview' || activeTab === 'payouts') && (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
            <div>
              <h3 className="font-manrope text-[16px] font-bold text-ink">
                Scheduled Payouts Breakdown
              </h3>
              <p className="text-[12px] text-[#68736d]">
                Pay any installment directly to {user.firstName}&apos;s bank account or credit their Getlands wallet.
              </p>
            </div>
            {user.holdings?.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddPayoutOpen(true)}
                className="px-[14px] py-[8px] bg-white border border-black/10 hover:border-[#008b45] text-ink hover:text-[#008b45] text-[12px] font-bold rounded-full transition-colors w-fit"
              >
                + Schedule Custom Payout
              </button>
            )}
          </div>

          <div className="p-[20px]">
            {(!ledger?.payouts || ledger.payouts.length === 0) ? (
              <div className="text-center p-[30px] text-[#68736d] text-[13px] bg-[#f7f9f7] rounded-[16px]">
                No scheduled payouts found for this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                      <th className="p-[10px_0] font-bold w-[120px]">Due Date</th>
                      <th className="p-[10px] font-bold">Customer &amp; Bank</th>
                      <th className="p-[10px] font-bold">Investment</th>
                      <th className="p-[10px] font-bold">Amount</th>
                      <th className="p-[10px] font-bold text-right">Action / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ledger.payouts.map((payout: any) => (
                      <ClientPayoutRow
                        key={payout.id}
                        payout={payout}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SALES AGENT COMMISSIONS & REFERRALS SECTION */}
      {(activeTab === 'overview' || activeTab === 'referrals') && (
        <div className="space-y-[24px]">
          {ledger?.commissions && ledger.commissions.length > 0 && (
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
              <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
                <div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink">
                    Sales Agent Commission Ledger
                  </h3>
                  <p className="text-[12px] text-[#68736d]">
                    Pay pending referral commissions directly to bank or credit to wallet.
                  </p>
                </div>
                <span className="text-[12px] font-bold text-amber-600">
                  {pendingCommissionsCount} Pending
                </span>
              </div>

              <div className="p-[20px] overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                      <th className="p-[10px_0] font-bold w-[130px]">Date &amp; Escrow</th>
                      <th className="p-[10px] font-bold">Agent &amp; Bank</th>
                      <th className="p-[10px] font-bold">Client &amp; Deal</th>
                      <th className="p-[10px] font-bold">Commission</th>
                      <th className="p-[10px] font-bold text-right">Action / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ledger.commissions.map((comm: any) => (
                      <ClientCommissionRow
                        key={comm.id}
                        commission={comm}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Referred Clients List */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">
                  Referral Network &amp; Attribution
                </h3>
                <p className="text-[12px] text-[#68736d]">
                  {referrer ? (
                    <>
                      Referred by{' '}
                      <Link
                        href={getCustomerProfileUrl(referrer)}
                        className="font-bold text-[#008b45] hover:underline"
                      >
                        {referrer.firstName} {referrer.lastName} ({referrer.email})
                      </Link>
                    </>
                  ) : (
                    'Not linked to an upstream referrer. You can assign a referrer in Edit Profile.'
                  )}
                </p>
              </div>
              <RecordReferralModal referrerUserId={user.id} />
            </div>

            <div className="p-[20px]">
              {referredUsers.length === 0 ? (
                <div className="text-center p-[24px] text-[13px] text-[#68736d] bg-[#f7f9f7] rounded-[16px]">
                  This user has not referred any clients yet.
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {referredUsers.map((ru: any) => {
                    const ruTotal = (ru.holdings || []).reduce(
                      (s: number, h: any) => s + (h.totalAmount || 0),
                      0
                    );
                    return (
                      <div
                        key={ru.id}
                        className="py-[12px] flex items-center justify-between gap-[15px]"
                      >
                        <div>
                          <Link
                            href={getCustomerProfileUrl(ru)}
                            className="font-bold text-[14px] text-ink hover:text-[#008b45] hover:underline block"
                          >
                            {ru.firstName} {ru.lastName}
                          </Link>
                          <span className="text-[12px] text-[#68736d]">
                            {ru.email} • Joined {new Date(ru.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <strong className="text-[14px] text-[#008b45] block">
                            {formatCurrency(ruTotal)}
                          </strong>
                          <span className="text-[11px] text-[#68736d]">
                            {ru.holdings?.length || 0} holding{ru.holdings?.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PERSONAL, KYC & BANK DETAILS SECTION */}
      {(activeTab === 'overview' || activeTab === 'details') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          {/* Bank Details Card */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
              <h3 className="font-manrope text-[16px] font-bold text-ink">
                Bank Account &amp; Payout Details
              </h3>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className="px-[14px] py-[6px] bg-[#eef3ef] hover:bg-[#008b45] text-[#008b45] hover:text-white text-[12px] font-bold rounded-full transition-colors"
              >
                {displayAccountNumber ? 'Update Bank Account' : '+ Add Bank Account'}
              </button>
            </div>
            <div className="p-[24px] space-y-[15px]">
              {!displayBankName && !displayAccountNumber ? (
                <div className="p-[24px] text-center bg-[#f7f9f7] rounded-[16px] text-[13px] text-[#68736d]">
                  No bank account saved yet. Click &ldquo;+ Add Bank Account&rdquo; above to add the customer&apos;s bank details.
                </div>
              ) : (
                <div className="border-2 border-[#008b45] bg-[#eef3ef]/40 rounded-[16px] p-[18px] flex items-center justify-between relative">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#008b45] block mb-[2px]">
                      Active Payout Account
                    </span>
                    <div className="font-bold text-ink text-[15px]">{displayBankName}</div>
                    <div className="text-[18px] text-ink font-mono font-bold tracking-widest my-[2px]">
                      {displayAccountNumber}
                    </div>
                    <div className="text-[12px] text-[#4a554f] font-medium">
                      {displayAccountName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(displayAccountNumber, 'Account number')}
                    className="px-[14px] py-[8px] bg-white border border-black/10 hover:bg-[#008b45] text-ink hover:text-white text-[12px] font-bold rounded-full transition-colors"
                  >
                    Copy Number
                  </button>
                </div>
              )}

              {user.bankAccounts?.filter((b: any) => b.status === 'retired').length > 0 && (
                <div className="pt-[10px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a847f] block mb-[8px]">
                    Previous / Retired Accounts
                  </span>
                  <div className="space-y-[8px]">
                    {user.bankAccounts
                      .filter((b: any) => b.status === 'retired')
                      .map((bank: any) => (
                        <div
                          key={bank.id}
                          className="border border-gray-200 bg-gray-50 rounded-[12px] p-[12px] text-[12px] text-gray-600"
                        >
                          <strong>{bank.bankName}</strong> • {bank.accountNumber} ({bank.accountName})
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal, KYC & Next of Kin Card */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
              <h3 className="font-manrope text-[16px] font-bold text-ink">
                Personal, KYC &amp; Next of Kin
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="px-[14px] py-[6px] bg-[#f4f7f5] hover:bg-ink text-ink hover:text-white text-[12px] font-bold rounded-full transition-colors"
              >
                Edit Details
              </button>
            </div>
            <div className="p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px] text-[13px]">
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Full Name
                </span>
                <strong className="text-ink">
                  {user.firstName} {user.lastName}
                </strong>
              </div>
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Email Address
                </span>
                <strong className="text-ink break-all">{user.email}</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Phone Number
                </span>
                <strong className="text-ink">{user.phoneNumber || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Home Address
                </span>
                <strong className="text-ink">{user.homeAddress || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Next of Kin
                </span>
                <strong className="text-ink">
                  {user.nextOfKinName || 'Not provided'}
                  {user.nextOfKinRelationship ? ` (${user.nextOfKinRelationship})` : ''}
                </strong>
                {user.nextOfKinPhone && (
                  <span className="block text-[12px] text-[#68736d]">{user.nextOfKinPhone}</span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase block">
                  Referral Code
                </span>
                <strong className="text-ink font-mono">{user.referralCode || 'None'}</strong>
              </div>

              {(user.nationalIdUrl || user.utilityBillUrl) && (
                <div className="sm:col-span-2 pt-[10px] border-t border-black/5 flex gap-[12px] flex-wrap">
                  {user.nationalIdUrl && (
                    <a
                      href={user.nationalIdUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-bold text-[#008b45] hover:underline"
                    >
                      View National ID &rarr;
                    </a>
                  )}
                  {user.utilityBillUrl && (
                    <a
                      href={user.utilityBillUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-bold text-[#008b45] hover:underline"
                    >
                      View Utility Bill &rarr;
                    </a>
                  )}
                </div>
              )}

              <div className="sm:col-span-2 pt-[12px] border-t border-black/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyClaimLink(true)}
                  disabled={loading}
                  className="text-[12px] font-bold text-[#008b45] hover:underline"
                >
                  Send &ldquo;Claim Account&rdquo; Email
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  disabled={loading}
                  className="text-[12px] font-bold text-[#e53935] hover:underline"
                >
                  Delete Customer Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS SECTION */}
      {(activeTab === 'overview' || activeTab === 'transactions') && (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
            <div>
              <h3 className="font-manrope text-[16px] font-bold text-ink">Transaction History</h3>
              <p className="text-[12px] text-[#68736d]">
                All deposits, investments, payouts, commissions, and withdrawals for this user.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWalletModalOpen(true)}
              className="px-[14px] py-[7px] bg-[#f4f7f5] hover:bg-[#008b45] text-ink hover:text-white text-[12px] font-bold rounded-full transition-colors"
            >
              + Adjust Wallet
            </button>
          </div>

          <div className="divide-y divide-black/5">
            {(!user.transactions || user.transactions.length === 0) ? (
              <div className="p-[30px] text-center text-[13px] text-[#68736d]">
                No transactions recorded for this customer yet.
              </div>
            ) : (
              user.transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="p-[16px_24px] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] hover:bg-[#fcfdfc]"
                >
                  <div>
                    <div className="flex items-center gap-[8px]">
                      <strong className="text-[14px] text-ink capitalize">
                        {(tx.type || '').replace(/_/g, ' ')}
                      </strong>
                      <span
                        className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'success'
                            ? 'bg-[#eef3ef] text-[#008b45]'
                            : tx.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-[#fdeeee] text-[#e53935]'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#68736d] font-mono mt-[2px]">
                      {tx.reference} • {new Date(tx.date).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-[12px]">
                    <strong className="text-[15px] font-manrope font-bold text-ink">
                      {formatCurrency(tx.amount)}
                    </strong>
                    {tx.status === 'pending' && (
                      <div className="flex items-center gap-[6px]">
                        <button
                          type="button"
                          onClick={() => handleApproveTx(tx.id)}
                          disabled={loading}
                          className="px-[12px] py-[5px] bg-[#008b45] text-white text-[11px] font-bold rounded-full hover:bg-[#007339]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectTx(tx.id)}
                          disabled={loading}
                          className="px-[10px] py-[5px] bg-[#fdeeee] text-[#e53935] text-[11px] font-bold rounded-full hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT CUSTOMER PROFILE, KYC & NEXT OF KIN */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[600px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Edit Customer Profile &amp; KYC
              </h2>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef]"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="overflow-y-auto p-[25px] space-y-[16px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">First Name</label>
                  <input
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Last Name</label>
                  <input
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    defaultValue={user.phoneNumber || ''}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Home Address
                  </label>
                  <input
                    name="homeAddress"
                    defaultValue={user.homeAddress || ''}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">KYC Status</label>
                  <select
                    name="kycStatus"
                    defaultValue={user.kycStatus || 'unverified'}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="unverified">Unverified</option>
                    <option value="pending">Pending Review</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Referral Code
                  </label>
                  <input
                    name="referralCode"
                    defaultValue={user.referralCode || ''}
                    placeholder="Optional referral code"
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Referred By (Sales Agent / Referrer)
                  </label>
                  <select
                    name="referredById"
                    defaultValue={user.referredById || ''}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="">-- Direct Signup (No Referrer) --</option>
                    {allUsers
                      .filter((u: any) => u.id !== user.id)
                      .map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} ({u.email}){' '}
                          {u.role === 'sales' ? '[Sales Agent]' : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="pt-[12px] border-t border-black/5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#7a847f] mb-[10px]">
                  Next of Kin Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                  <div>
                    <label className="block text-[12px] font-bold text-ink mb-[5px]">
                      Next of Kin Name
                    </label>
                    <input
                      name="nextOfKinName"
                      defaultValue={user.nextOfKinName || ''}
                      className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-ink mb-[5px]">
                      Relationship
                    </label>
                    <input
                      name="nextOfKinRelationship"
                      defaultValue={user.nextOfKinRelationship || ''}
                      className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-ink mb-[5px]">
                      Next of Kin Phone
                    </label>
                    <input
                      name="nextOfKinPhone"
                      defaultValue={user.nextOfKinPhone || ''}
                      className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-ink mb-[5px]">
                      Next of Kin Email
                    </label>
                    <input
                      name="nextOfKinEmail"
                      defaultValue={user.nextOfKinEmail || ''}
                      className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-[10px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full text-[13px] hover:bg-[#007339] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / UPDATE BANK ACCOUNT */}
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[460px] shadow-2xl overflow-hidden">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Save Customer Bank Account
              </h2>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveBank} className="p-[25px] space-y-[16px]">
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">Bank Name</label>
                <input
                  name="bankName"
                  defaultValue={displayBankName}
                  placeholder="e.g. GTBank, Zenith Bank, Moniepoint, OPay"
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">
                  10-Digit Account Number
                </label>
                <input
                  name="accountNumber"
                  defaultValue={displayAccountNumber}
                  placeholder="e.g. 0123456789"
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[14px] font-mono border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">
                  Account Name
                </label>
                <input
                  name="accountName"
                  defaultValue={displayAccountName}
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>
              <div className="pt-[8px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full text-[13px] hover:bg-[#007339]"
                >
                  {loading ? 'Saving...' : 'Save Bank Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN NEW INVESTMENT */}
      {isAssignHoldingOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Assign Investment to {user.firstName}
              </h2>
              <button
                type="button"
                onClick={() => setIsAssignHoldingOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAssignHolding} className="p-[25px] space-y-[16px]">
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">
                  Select Opportunity
                </label>
                <select
                  name="opportunityId"
                  value={selectedOppId}
                  onChange={e => setSelectedOppId(e.target.value)}
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                >
                  <option value="">-- Choose an opportunity --</option>
                  {opportunities.map((o: any) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
              </div>

              {returnPlans.length > 0 && (
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Return Plan (For Commodities)
                  </label>
                  <select
                    name="planId"
                    className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="">-- Default / Standard --</option>
                    {returnPlans.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.ratePercent}%)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Amount Paid (₦)
                  </label>
                  <input
                    name="amountPaid"
                    type="number"
                    step="0.01"
                    required
                    placeholder="100000"
                    className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Units</label>
                  <input
                    name="units"
                    type="number"
                    step="0.01"
                    defaultValue="1"
                    required
                    className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">
                  Date Acquired
                </label>
                <input
                  name="dateAcquired"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>

              <div className="pt-[8px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsAssignHoldingOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full text-[13px] hover:bg-[#007339]"
                >
                  {loading ? 'Assigning...' : 'Assign & Generate Docs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT EXISTING HOLDING */}
      {editingHolding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Edit Holding Details
              </h2>
              <button
                type="button"
                onClick={() => setEditingHolding(null)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditHolding} className="p-[25px] space-y-[15px]">
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">Opportunity</label>
                <select
                  name="opportunityId"
                  defaultValue={editingHolding.opportunityId}
                  className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                >
                  {opportunities.map((o: any) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Total Amount (₦)
                  </label>
                  <input
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    defaultValue={editingHolding.totalAmount}
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Units</label>
                  <input
                    name="units"
                    type="number"
                    step="0.01"
                    defaultValue={editingHolding.units}
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Date Acquired
                  </label>
                  <input
                    name="dateAcquired"
                    type="date"
                    defaultValue={
                      editingHolding.dateAcquired
                        ? new Date(editingHolding.dateAcquired).toISOString().split('T')[0]
                        : ''
                    }
                    required
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Status</label>
                  <select
                    name="status"
                    defaultValue={editingHolding.status}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="matured">Matured</option>
                  </select>
                </div>
              </div>

              {returnPlans.length > 0 && (
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Return Plan
                  </label>
                  <select
                    name="planId"
                    defaultValue={editingHolding.planId || ''}
                    className="w-full h-[44px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="">-- Keep Existing Plan --</option>
                    {returnPlans.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.ratePercent}%)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-start gap-[10px] p-[12px] bg-[#f7f9f7] rounded-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  name="recalculatePayouts"
                  className="mt-[3px] accent-[#008b45]"
                />
                <span className="text-[12px] text-[#4a554f]">
                  <strong>Regenerate pending payout schedule</strong> based on the updated amount, date, and return plan. (Paid payouts will not be touched.)
                </span>
              </label>

              <div className="pt-[8px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setEditingHolding(null)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full text-[13px] hover:bg-[#007339]"
                >
                  {loading ? 'Updating...' : 'Save Holding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADJUST WALLET BALANCE */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl overflow-hidden">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Adjust Wallet Balance
              </h2>
              <button
                type="button"
                onClick={() => setIsWalletModalOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAdjustWallet} className="p-[25px] space-y-[15px]">
              <div className="flex bg-[#f4f7f5] p-[4px] rounded-full">
                <button
                  type="button"
                  onClick={() => setWalletMode('credit')}
                  className={`flex-1 py-[8px] rounded-full text-[12px] font-bold transition-colors ${
                    walletMode === 'credit' ? 'bg-[#008b45] text-white' : 'text-[#68736d]'
                  }`}
                >
                  + Credit Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setWalletMode('deduct')}
                  className={`flex-1 py-[8px] rounded-full text-[12px] font-bold transition-colors ${
                    walletMode === 'deduct' ? 'bg-red-600 text-white' : 'text-[#68736d]'
                  }`}
                >
                  - Deduct / Reconcile
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">Amount (₦)</label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  placeholder="50000"
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[14px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">
                  Reason / Note
                </label>
                <input
                  name="reason"
                  defaultValue={
                    walletMode === 'credit'
                      ? 'Manual wallet credit'
                      : 'Settled directly via bank transfer'
                  }
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>

              <label className="flex items-center gap-[10px] text-[12px] text-ink cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyUser"
                  defaultChecked
                  className="accent-[#008b45]"
                />
                Send in-app &amp; email notification to {user.firstName}
              </label>

              <div className="pt-[8px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-[12px] text-white font-bold rounded-full text-[13px] ${
                    walletMode === 'credit'
                      ? 'bg-[#008b45] hover:bg-[#007339]'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD CUSTOM PAYOUT */}
      {isAddPayoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl overflow-hidden">
            <div className="p-[20px_25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">
                Schedule Custom Payout
              </h2>
              <button
                type="button"
                onClick={() => setIsAddPayoutOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCustomPayout} className="p-[25px] space-y-[15px]">
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">Holding</label>
                <select
                  name="holdingId"
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                >
                  {(user.holdings || []).map((h: any) => (
                    <option key={h.id} value={h.id}>
                      {h.opportunity?.title} ({formatCurrency(h.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">
                    Amount (₦)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    placeholder="10000"
                    className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-ink mb-[5px]">Type</label>
                  <select
                    name="type"
                    className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                  >
                    <option value="ROI">ROI</option>
                    <option value="DIVIDEND">DIVIDEND</option>
                    <option value="PRINCIPAL_RETURN">PRINCIPAL RETURN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[5px]">Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[10px] px-[14px] text-[13px] border border-black/10 outline-none focus:border-[#008b45]"
                />
              </div>
              <div className="pt-[8px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsAddPayoutOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full text-[13px] hover:bg-[#007339]"
                >
                  {loading ? 'Saving...' : 'Schedule Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
