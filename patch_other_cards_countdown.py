import re

for filename in ['src/components/ui/LandBankingCard.tsx', 'src/components/ui/MarketCard.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    if "import { CountdownTimer }" not in content:
        content = content.replace(
            "import React from 'react';",
            "import React from 'react';\nimport { CountdownTimer } from './CountdownTimer';"
        )
    
    # LandBankingCard uses border-black/5 for the bottom section
    if 'LandBanking' in filename:
        countdown_ui = """
        {cohortStatus === 'OPEN' && cohortClosesAt && (
          <CountdownTimer targetDate={cohortClosesAt} label="CLOSES IN" />
        )}
        {(cohortStatus === 'PRE_ORDER' || cohortStatus === 'COMING_SOON') && cohortOpensAt && (
          <CountdownTimer targetDate={cohortOpensAt} label="OPENS IN" />
        )}
        
        <div className="grid grid-cols-2 gap-[10px] mt-auto border-t border-black/5 pt-[10px]">
"""
        content = content.replace('<div className="grid grid-cols-2 gap-[10px] mt-auto border-t border-black/5 pt-[10px]">', countdown_ui.strip())
    
    if 'MarketCard' in filename:
        countdown_ui = """
        {cohortStatus === 'OPEN' && cohortClosesAt && (
          <CountdownTimer targetDate={cohortClosesAt} label="CLOSES IN" />
        )}
        {(cohortStatus === 'PRE_ORDER' || cohortStatus === 'COMING_SOON') && cohortOpensAt && (
          <CountdownTimer targetDate={cohortOpensAt} label="OPENS IN" />
        )}
        
        <div className="flex justify-between items-end mt-auto pt-[15px] border-t border-black/5">
"""
        content = content.replace('<div className="flex justify-between items-end mt-auto pt-[15px] border-t border-black/5">', countdown_ui.strip())

    with open(filename, 'w') as f:
        f.write(content)

