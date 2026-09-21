import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# I will find the EXACT block starting from {featuredOpps.map((opp, i) => { and ending with </Link>
# and replace it.

start_str = "{featuredOpps.map((opp, i) => {"
# The end of that map function is something like </Link>\n               );\n             })}"

pattern = r"\{featuredOpps\.map\(\(opp, i\) => \{.*?</Link>\s*\);\s*\}\)\}"

content = re.sub(pattern, "{featuredOpps.map(opp => <MiniFeaturedCard key={opp.id} opp={opp} />)}", content, flags=re.DOTALL)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
