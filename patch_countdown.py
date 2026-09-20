with open('src/components/ui/CountdownTimer.tsx', 'r') as f:
    content = f.read()

replacement = """
export function CountdownTimer({ targetDate, label, variant = 'dark' }: { targetDate: string | Date, label: string, variant?: 'light' | 'dark' }) {
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
    const interval = setInterval(calculateTime, 60000); 
    
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  if (variant === 'light') {
    return (
      <div className="mt-[10px] mb-[5px] bg-[#f7f9f7] rounded-[10px] p-[10px] border border-black/5">
        <div className="text-[9px] text-[#008b45] font-extrabold uppercase tracking-wider mb-[4px]">{label}</div>
        <div className="flex gap-[10px] text-ink font-manrope font-bold text-[14px]">
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
        </div>
      </div>
    );
  }

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
"""

import re
content = re.sub(
    r'export function CountdownTimer\([\s\S]*?\}\)',
    replacement.strip(),
    content
)

with open('src/components/ui/CountdownTimer.tsx', 'w') as f:
    f.write(content)
