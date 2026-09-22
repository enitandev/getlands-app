import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="space-y-[30px] animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-[15px]">
        <div className="h-[12px] w-[100px] bg-black/5 rounded-full"></div>
        <div className="h-[40px] w-[250px] bg-black/5 rounded-full md:w-[400px]"></div>
        <div className="h-[16px] w-[200px] bg-black/5 rounded-full hidden md:block"></div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
        {/* Large Block Skeleton */}
        <div className="lg:col-span-2 h-[200px] md:h-[250px] bg-black/5 rounded-[24px]"></div>
        {/* Small Block Skeleton */}
        <div className="h-[150px] md:h-[250px] bg-black/5 rounded-[24px]"></div>
      </div>

      {/* List/Banner Skeleton */}
      <div className="h-[80px] w-full bg-black/5 rounded-[20px]"></div>

      <div className="h-[200px] w-full bg-black/5 rounded-[24px]"></div>
    </div>
  );
}
