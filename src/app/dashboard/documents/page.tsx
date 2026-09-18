export default function DocumentsPage() {
  return (
    <div className="space-y-[30px] h-full flex flex-col">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Documents</h1>
        <p className="text-[13px] lg:text-[14px] text-[#68736d]">Access your deeds, receipts, and allocation letters securely.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="w-[80px] h-[80px] bg-[#eef3ef] rounded-full flex items-center justify-center mb-6">
          <svg className="text-[#008b45]" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h2 className="text-[20px] font-bold text-ink mb-2">No Documents Available</h2>
        <p className="text-[#68736d] text-[14px] max-w-[320px] text-center">
          Legal documents, receipts, and MOUs will automatically appear here once your investments are fully verified and processed.
        </p>
      </div>
    </div>
  );
}
