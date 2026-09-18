export default function MessagesPage() {
  return (
    <div className="space-y-[30px] h-full flex flex-col">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Messages</h1>
        <p className="text-[13px] lg:text-[14px] text-[#68736d]">Secure communication with your account manager.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="w-[80px] h-[80px] bg-[#eef3ef] rounded-full flex items-center justify-center mb-6">
          <svg className="text-[#008b45]" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h2 className="text-[20px] font-bold text-ink mb-2">No Messages Yet</h2>
        <p className="text-[#68736d] text-[14px] max-w-[300px] text-center">
          When you have an active investment, your dedicated account manager will reach out to you here with updates.
        </p>
      </div>
    </div>
  );
}
