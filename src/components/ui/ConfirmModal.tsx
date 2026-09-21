"use client";
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isDestructive = false,
  onConfirm, 
  onCancel 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-[20px] animate-fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col scale-in-center">
        <div className="p-[30px] text-center">
          <div className={`w-[60px] h-[60px] rounded-full mx-auto flex items-center justify-center mb-[20px] ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-[#eef3ef] text-[#008b45]'}`}>
            {isDestructive ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            )}
          </div>
          <h2 className="font-manrope text-[20px] font-bold text-ink mb-[10px]">{title}</h2>
          <p className="text-[14px] text-[#68736d] leading-[1.5]">{message}</p>
        </div>
        
        <div className="p-[20px] bg-[#fcfdfc] border-t border-black/5 flex gap-[10px]">
          <button 
            onClick={onCancel} 
            className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold text-[14px] rounded-full hover:bg-[#f7f9f7] transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-[12px] text-white font-bold text-[14px] rounded-full transition-colors ${
              isDestructive 
                ? 'bg-[#e53935] hover:bg-[#c62828] shadow-[0_8px_20px_rgba(229,57,53,0.25)]' 
                : 'bg-[#008b45] hover:bg-[#007339] shadow-[0_8px_20px_rgba(0,139,69,0.25)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
