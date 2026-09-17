"use client";
import React from 'react';

export default function DocumentsPage() {
  const documents = [
    { id: '1', title: 'Deed of Assignment - Abeokuta Plot', date: 'Feb 16, 2025', type: 'deed', status: 'verified' },
    { id: '2', title: 'Payment Receipt - Pepper Cycle', date: 'Aug 01, 2025', type: 'receipt', status: 'verified' },
    { id: '3', title: 'Allocation Letter - Abeokuta', date: 'Feb 15, 2025', type: 'allocation', status: 'verified' },
    { id: '4', title: 'MOU - Abeokuta Land Banking', date: 'Sep 10, 2025', type: 'mou', status: 'pending' },
  ];

  return (
    <div className="space-y-[40px]">
      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
        <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
          Documents
        </h1>
        <p className="text-[15px] text-[#68736d] max-w-[500px]">
          Access your deeds, receipts, and allocation letters securely. Documents are generated after payment verification.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white border border-black/5 rounded-[20px] p-[24px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-[40px] h-[40px] rounded-full bg-[#f7f9f7] flex items-center justify-center mb-[20px]">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4.5C1 2.567 2.567 1 4.5 1H9L17 9V15.5C17 17.433 15.433 19 13.5 19H4.5C2.567 19 1 17.433 1 15.5V4.5Z" stroke="#008b45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 1V9H17" stroke="#008b45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <strong className="block text-[15px] text-ink mb-[6px]">{doc.title}</strong>
            <span className="block text-[12px] text-[#7a847f] mb-[20px]">Issued: {doc.date}</span>
            
            <div className="flex items-center justify-between border-t border-line pt-[15px]">
              <span className={`text-[11px] font-bold uppercase tracking-[0.05em] ${doc.status === 'verified' ? 'text-[#008b45]' : 'text-[#f5a623]'}`}>
                {doc.status}
              </span>
              <button className="text-[13px] font-bold text-ink hover:text-[#008b45] transition-colors" onClick={() => alert('Downloading document...')}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
