import re

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

# 1. Add parsing in JS
content = content.replace(
    'const pub = (document.getElementById("cohortPublic") as HTMLInputElement).value;',
    'const pub = (document.getElementById("cohortPublic") as HTMLInputElement).value;\n    const closes = (document.getElementById("cohortCloses") as HTMLInputElement).value;'
)

content = content.replace(
    'fd.append("publicOpensAt", pub);',
    'fd.append("publicOpensAt", pub);\n    fd.append("closesAt", closes);'
)

# 2. Add input field to UI
input_ui = """
              <input type="datetime-local" id="cohortPublic" title="Public Opens At" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              <input type="datetime-local" id="cohortCloses" title="Closes At" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
"""

content = content.replace(
    '<input type="datetime-local" id="cohortPublic" title="Public Opens At" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />',
    input_ui.strip()
)

# Adjust grid columns for the form to fit the extra field nicely
content = content.replace(
    'className="grid grid-cols-1 md:grid-cols-3 gap-[15px]"',
    'className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-[15px]"'
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
