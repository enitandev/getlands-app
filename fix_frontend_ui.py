import re

with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

logic = """
  const dateAcquired = new Date(holding.dateAcquired);
  let durationMonths = 0;
  if (holding.opportunity.duration) {
    const match = holding.opportunity.duration.match(/(\\d+)\\s*(MONTH|YEAR)/i);
    if (match) {
      durationMonths = parseInt(match[1]);
      if (match[2].toUpperCase().startsWith('YEAR')) durationMonths *= 12;
    }
  }
  
  // Default to 6 if no duration found
  durationMonths = durationMonths || 6;
  
  const maturityDate = new Date(dateAcquired);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
  
  const now = new Date();
  let monthsPassed = (now.getFullYear() - dateAcquired.getFullYear()) * 12 + (now.getMonth() - dateAcquired.getMonth());
  if (now.getDate() < dateAcquired.getDate()) monthsPassed--;
  monthsPassed = Math.max(0, Math.min(monthsPassed, durationMonths)); // cap between 0 and total duration
  
  const bars = Array.from({ length: durationMonths }).map((_, i) => {
    const isPast = i < monthsPassed;
    const isCurrent = i === monthsPassed;
    const height = 20 + ((i + 1) / durationMonths) * 80; // Scale from 20% to 100%
    return { isPast, isCurrent, height: `${height}%` };
  });
"""

content = content.replace(
    '  return (',
    logic.strip() + '\n\n  return ('
)

content = content.replace(
    '{holding.cohort?.closesAt ? new Date(holding.cohort.closesAt).toLocaleDateString() : "N/A"}',
    '{maturityDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}'
)

chart_regex = r'\{\/\* Growth Chart Placeholder \*\/\}.*?\{\/\* Legal Documents \*\/\}'
new_chart = """
            {/* Dynamic Lifecycle Chart */}
            <div className="h-[200px] w-full bg-[#f7f9f7] rounded-[16px] border border-black/5 flex items-end justify-between p-[20px] gap-[4px] sm:gap-[10px]">
              {bars.map((bar, i) => (
                <div key={i} className={`flex-1 rounded-t-[8px] relative transition-all duration-500 ${bar.isPast || bar.isCurrent ? 'bg-[#008b45]' : 'bg-[#008b45]/15'}`} style={{ height: bar.height, opacity: bar.isCurrent ? 1 : (bar.isPast ? 0.7 : 1) }}>
                  {bar.isCurrent && (
                    <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-bold py-[4px] px-[8px] rounded-[4px] whitespace-nowrap shadow-md z-10">
                      Today
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
"""

content = re.sub(chart_regex, new_chart.strip(), content, flags=re.DOTALL)

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
