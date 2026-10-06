"use client";
import { useState } from 'react';
import { deleteHoldingAction } from '@/app/actions/admin-ops';

export function DeleteHoldingButton({ holdingId, title }: { holdingId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete the holding "${title}"? This will also remove associated payouts from the ledger. This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      await deleteHoldingAction(holdingId);
    } catch (e) {
      alert("Failed to delete holding");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-[11px] font-bold text-[#e53935] hover:underline flex items-center gap-[4px] mt-[10px]"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      {isDeleting ? "Deleting..." : "Delete Test Holding"}
    </button>
  );
}
