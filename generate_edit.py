with open('src/app/admin/marketplace/create/page.tsx', 'r') as f:
    create_content = f.read()

# Make it a Client component
edit_content = create_content.replace('export default function CreateOpportunity() {', 'export default function ClientEditOpportunity({ initialData }: { initialData: any }) {')
edit_content = edit_content.replace('const [category, setCategory] = useState', 'const [category, setCategory] = useState(initialData.category)')
edit_content = edit_content.replace("import { createOpportunity } from '@/app/actions/admin';", "import { editOpportunity } from '@/app/actions/admin';")
edit_content = edit_content.replace("action={createOpportunity}", "action={editOpportunity.bind(null, initialData.id)}")
edit_content = edit_content.replace("Create New Opportunity", "Edit Opportunity")
edit_content = edit_content.replace("List a new property, farm, or land banking opportunity.", "Update the details for this opportunity.")
edit_content = edit_content.replace("Create Opportunity", "Update Opportunity")

# Add defaultValues to all inputs
import re
def add_default_value(match):
    name = match.group(1)
    return f'name="{name}" defaultValue={{initialData.{name} || ""}}'

edit_content = re.sub(r'name="([^"]+)"', add_default_value, edit_content)

# Fix checked states for radio buttons
edit_content = edit_content.replace('defaultChecked={category === \'land\'}', 'checked={category === \'land\'}')
edit_content = edit_content.replace('defaultChecked={category === \'farm\'}', 'checked={category === \'farm\'}')
edit_content = edit_content.replace('defaultChecked={category === \'land_banking\'}', 'checked={category === \'land_banking\'}')

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(edit_content)
