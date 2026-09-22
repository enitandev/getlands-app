import re
with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# Fix the dangling closing tags left behind by the bad regex
# Find the exact string `        )}\n          </div>\n        )}` or similar around line 229

dangling = """        )}
          </div>
        )}"""
content = content.replace(dangling, "        )}")

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)
