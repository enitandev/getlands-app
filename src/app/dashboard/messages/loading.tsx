import React from 'react';
export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-black/10 border-t-[#008b45] rounded-full animate-spin mb-4"></div>
      <p className="text-[#68736d] text-[14px] font-bold tracking-wide animate-pulse">Loading...</p>
    </div>
  );
}
