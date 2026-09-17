"use client";
import React from 'react';

export default function AdminDocuments() {
  const documents = [
    { id: 1, type: 'Receipt', title: 'Payment Receipt - Land Banking', customer: 'Emeka Abraham', ref: 'REC-2025-098', date: 'Today, 10:45 AM' },
    { id: 2, type: 'MOU', title: 'Memorandum of Understanding', customer: 'Emeka Abraham', ref: 'MOU-2025-044', date: 'Today, 10:45 AM' },
    { id: 3, type: 'Certificate', title: 'Investment Certificate', customer: 'David Smith', ref: 'CERT-2024-812', date: 'Yesterday' },
  ];

  return (
    <div className="space-y-[30px]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Document Ledger</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">System-generated receipts, certificates, and MOUs across all customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2.5fr_1.5fr_1fr_1fr_100px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Document</div>
          <div>Customer</div>
          <div>Reference</div>
          <div>Date Generated</div>
          <div className="text-right">Action</div>
        </div>
        
        <div className="divide-y divide-black/5">
          {documents.map(doc => (
            <div key={doc.id} className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[16px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
              <div className="flex gap-[15px] items-center">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f7f9f7] flex items-center justify-center border border-black/5 shrink-0 text-[#008b45]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                </div>
                <div>
                  <strong className="block text-[14px] text-ink">{doc.title}</strong>
                  <span className={`inline-flex mt-[4px] px-[6px] py-[2px] rounded-[4px] text-[10px] font-bold uppercase tracking-[0.05em] ${
                    doc.type === 'Receipt' ? 'bg-[#eef3ef] text-[#008b45]' : 
                    doc.type === 'MOU' ? 'bg-[#f4f4f5] text-[#52525b]' : 'bg-[#fffbeb] text-[#d97706]'
                  }`}>
                    {doc.type}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-ink">
                <span className="lg:hidden text-[12px] text-[#7a847f]">Customer</span>
                {doc.customer}
              </div>
              
              <div className="flex justify-between lg:block text-[13px] font-mono text-[#68736d]">
                <span className="lg:hidden text-[12px] text-[#7a847f] font-sans">Reference</span>
                {doc.ref}
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-[#68736d]">
                <span className="lg:hidden text-[12px] text-[#7a847f]">Date</span>
                {doc.date}
              </div>
              
              <div className="mt-[10px] lg:mt-0 text-right">
                <div className="flex justify-end items-center gap-[15px]">
                  <button className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">View</button>
                  <button className="text-[13px] font-bold text-[#68736d] hover:text-ink transition-colors">Print</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
