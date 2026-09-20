with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

if "import { createCohort, updateCohortStatus } from '@/app/actions/cohorts';" not in content:
    content = "import { createCohort, updateCohortStatus } from '@/app/actions/cohorts';\n" + content

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
