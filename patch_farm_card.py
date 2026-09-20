import re

with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

# Update Props
content = content.replace(
    'className?: string;\n}',
    'className?: string;\n  cohortStatus?: string;\n  cohortProgress?: number;\n  cohortLabel?: string;\n}'
)

content = content.replace(
    'imageUrl, className = \'\' }: FarmCardProps)',
    'imageUrl, className = \'\', cohortStatus, cohortProgress, cohortLabel }: FarmCardProps)'
)

# Render badge
badge_ui = """
      <div className="absolute top-[18px] left-[18px] flex gap-[8px] z-10">
        <div className="bg-white/90 text-[#213029] px-[10px] py-[7px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">
          {formatDuration(cycle)}
        </div>
        {cohortStatus && (
          <div className={`px-[10px] py-[7px] rounded-full text-[9px] font-extrabold uppercase shadow-sm ${
            cohortStatus === 'OPEN' ? 'bg-[#008b45] text-white' :
            cohortStatus === 'PRE_ORDER' ? 'bg-[#f5a623] text-white' :
            cohortStatus === 'FULL' || cohortStatus === 'SOLD_OUT' ? 'bg-[#e53935] text-white' :
            'bg-[#f7f9f7] text-[#68736d]'
          }`}>
            {cohortStatus === 'PRE_ORDER' ? 'PRE-ORDER' : cohortStatus.replace('_', ' ')}
          </div>
        )}
      </div>
"""
content = content.replace(
    '<div className="absolute top-[18px] left-[18px] bg-white/90 text-[#213029] px-[10px] py-[7px] rounded-full text-[9px] font-extrabold uppercase z-10">\n        {formatDuration(cycle)}\n      </div>',
    badge_ui
)

# Render progress bar
progress_ui = """
        {cohortStatus === 'OPEN' && typeof cohortProgress === 'number' && (
          <div className="mt-[15px] mb-[5px]">
            <div className="flex justify-between text-[9px] text-[#98a69e] mb-[4px] font-bold">
              <span>{cohortLabel || 'Funding Progress'}</span>
              <span>{cohortProgress}%</span>
            </div>
            <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#a9e7bd] rounded-full" style={{ width: `${cohortProgress}%` }}></div>
            </div>
          </div>
        )}
"""

content = content.replace(
    '<p className="text-[11px] text-[#98a69e] m-0 mb-[20px]">{location}</p>',
    '<p className="text-[11px] text-[#98a69e] m-0 mb-[15px]">{location}</p>' + progress_ui
)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)
