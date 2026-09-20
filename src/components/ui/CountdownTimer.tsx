"use client";
import React, { useState, useEffect } from 'react';

export function CountdownTimer({ targetDate, label }: { targetDate: string | Date, label: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute is enough
    
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="mt-[15px] mb-[5px] bg-white/5 rounded-[12px] p-[10px] border border-white/10 backdrop-blur-sm">
      <div className="text-[9px] text-[#86e2a6] font-extrabold uppercase tracking-wider mb-[4px]">{label}</div>
      <div className="flex gap-[10px] text-white font-manrope font-bold text-[14px]">
        {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
      </div>
    </div>
  );
}
