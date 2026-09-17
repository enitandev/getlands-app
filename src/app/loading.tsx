export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#f7f9f7] z-[999] flex flex-col items-center justify-center">
      <div className="w-[60px] h-[60px] relative">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-[#eef3ef] rounded-full"></div>
        {/* Animated Inner Ring */}
        <div className="absolute inset-0 border-4 border-[#008b45] rounded-full border-t-transparent animate-spin"></div>
        {/* Center Initial */}
        <div className="absolute inset-0 flex items-center justify-center font-manrope font-bold text-[#008b45] text-[20px]">
          G
        </div>
      </div>
      <div className="mt-[20px] text-[12px] font-bold tracking-[0.2em] uppercase text-[#68736d] animate-pulse">
        Loading...
      </div>
    </div>
  );
}
