import re

with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

# Insert countdown right before the bottom stats border-t
countdown_ui = """
        {cohortStatus === 'OPEN' && cohortClosesAt && (
          <CountdownTimer targetDate={cohortClosesAt} label="CLOSES IN" />
        )}
        {(cohortStatus === 'PRE_ORDER' || cohortStatus === 'COMING_SOON') && cohortOpensAt && (
          <CountdownTimer targetDate={cohortOpensAt} label="OPENS IN" />
        )}

        <div className="border-t border-white/15 pt-[16px] grid grid-cols-[auto_1fr_auto] items-end gap-[10px]">
"""

content = content.replace(
    '<div className="border-t border-white/15 pt-[16px] grid grid-cols-[auto_1fr_auto] items-end gap-[10px]">',
    countdown_ui.strip()
)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)
