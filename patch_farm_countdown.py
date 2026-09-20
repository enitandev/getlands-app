import re

with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { CountdownTimer } from './CountdownTimer';" not in content:
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport { CountdownTimer } from './CountdownTimer';"
    )

# Update Props
content = content.replace(
    'cohortLabel?: string;\n}',
    'cohortLabel?: string;\n  cohortOpensAt?: Date | null;\n  cohortClosesAt?: Date | null;\n}'
)

content = content.replace(
    'cohortProgress, cohortLabel }: FarmCardProps)',
    'cohortProgress, cohortLabel, cohortOpensAt, cohortClosesAt }: FarmCardProps)'
)

# Insert Countdown Logic
progress_and_countdown_ui = """
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
        
        {cohortStatus === 'OPEN' && cohortClosesAt && (
          <CountdownTimer targetDate={cohortClosesAt} label="CLOSES IN" />
        )}
        {(cohortStatus === 'PRE_ORDER' || cohortStatus === 'COMING_SOON') && cohortOpensAt && (
          <CountdownTimer targetDate={cohortOpensAt} label="OPENS IN" />
        )}
"""

# Replace the old progress block with the new combined one
content = re.sub(
    r'\{cohortStatus === \'OPEN\' && typeof cohortProgress === \'number\' && \([\s\S]*?\}\)',
    progress_and_countdown_ui,
    content
)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)
