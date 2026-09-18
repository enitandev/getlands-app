with open('src/app/explore/[slug]/page.tsx', 'r') as f:
    content = f.read()

format_func = """
  const formatDuration = (val: string | null) => {
    if (!val) return 'N/A';
    const isNumeric = /^\\d+$/.test(val.trim());
    return isNumeric ? `${val} MONTHS` : val;
  };
"""

content = content.replace(
    "const opp = await prisma.opportunity.findUnique({",
    format_func + "\n  const opp = await prisma.opportunity.findUnique({"
)

content = content.replace(
    "{opp.duration}",
    "{formatDuration(opp.duration)}"
)

with open('src/app/explore/[slug]/page.tsx', 'w') as f:
    f.write(content)
