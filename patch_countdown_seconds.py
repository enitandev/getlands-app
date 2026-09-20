import re

with open('src/components/ui/CountdownTimer.tsx', 'r') as f:
    content = f.read()

# Update state type to include seconds
content = content.replace(
    'useState<{ days: number, hours: number, minutes: number } | null>',
    'useState<{ days: number, hours: number, minutes: number, seconds: number } | null>'
)

# Update the calculation logic to include seconds
calc_replacement = """
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
"""
content = re.sub(
    r'if \(difference <= 0\) \{[\s\S]*?minutes: Math\.floor\(\(difference % \(1000 \* 60 \* 60\)\) / \(1000 \* 60\)\)\n      \}\);',
    calc_replacement.strip(),
    content
)

# Change interval to 1 second
content = content.replace(
    'const interval = setInterval(calculateTime, 60000);',
    'const interval = setInterval(calculateTime, 1000);'
)

# Add seconds to the UI render for both light and dark variants
ui_light_replacement = """
        <div className="flex gap-[10px] text-ink font-manrope font-bold text-[14px]">
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
          <span className="text-[#008b45]">{timeLeft.seconds}s</span>
        </div>
"""
content = re.sub(
    r'<div className="flex gap-\[10px\] text-ink font-manrope font-bold text-\[14px\]">[\s\S]*?</div>',
    ui_light_replacement.strip(),
    content,
    count=1
)

ui_dark_replacement = """
      <div className="flex gap-[10px] text-white font-manrope font-bold text-[14px]">
        {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
        <span className="text-[#a9e7bd]">{timeLeft.seconds}s</span>
      </div>
"""
content = re.sub(
    r'<div className="flex gap-\[10px\] text-white font-manrope font-bold text-\[14px\]">[\s\S]*?</div>',
    ui_dark_replacement.strip(),
    content
)

with open('src/components/ui/CountdownTimer.tsx', 'w') as f:
    f.write(content)
