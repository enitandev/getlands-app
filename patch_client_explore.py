import re

with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    content = f.read()

replacement = """
          {filtered.map(opp => {
            const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
            const cohortStatus = cohort ? cohort.status : opp.status;
            let cohortProgress = 0;
            if (cohort && cohort.capacityAmount > 0) {
               cohortProgress = Math.min(100, Math.round((cohort.committedAmount / cohort.capacityAmount) * 100));
            }

            if (opp.category === 'land') {
"""

content = content.replace(
    '          {filtered.map(opp => {\n            if (opp.category === \'land\') {',
    replacement
)

content = content.replace(
    '                    className="w-full h-full"\n                  />',
    '                    className="w-full h-full"\n                    cohortStatus={cohortStatus}\n                    cohortProgress={cohortProgress}\n                  />'
)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(content)
