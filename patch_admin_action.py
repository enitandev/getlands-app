with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

# Update createOpportunity
content = content.replace(
    "projectedReturn: formData.get('projectedReturn') as string,",
    "projectedReturn: formData.get('projectedReturn') as string,\n    returnsFrequency: formData.get('returnsFrequency') as string,"
)

# Update editOpportunity
content = content.replace(
    "data.projectedReturn = formData.get('projectedReturn') as string;",
    "data.projectedReturn = formData.get('projectedReturn') as string;\n    data.returnsFrequency = formData.get('returnsFrequency') as string;"
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
