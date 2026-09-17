with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

new_edit = """export async function editOpportunity(id: string, formData: FormData) {
  await checkAdmin();
  
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const state = formData.get('state') as string;
  const status = formData.get('status') as string;
  const coverImage = formData.get('coverImage') as string;
  
  const opp = await prisma.opportunity.findUnique({ where: { id } });
  if (!opp) return;

  const data: any = { title, location, state, status };
  if (coverImage) data.coverImage = coverImage;

  if (opp.category === 'land') {
    data.price = Number(formData.get('price'));
    data.landSize = formData.get('landSize') as string;
    data.documentationStatus = formData.get('documentationStatus') as string;
  } else if (opp.category === 'farm') {
    data.slotPrice = Number(formData.get('slotPrice'));
    data.projectedReturn = formData.get('projectedReturn') as string;
    data.duration = formData.get('duration') as string;
  } else if (opp.category === 'land_banking') {
    data.acquisitionPrice = Number(formData.get('acquisitionPrice'));
    data.statedExitValue = Number(formData.get('statedExitValue'));
    data.duration = formData.get('duration') as string;
  }

  await prisma.opportunity.update({
    where: { id },
    data
  });

  redirect('/admin/marketplace');
}"""

# Replace the old editOpportunity
content = re.sub(
    r"export async function editOpportunity\(id: string, formData: FormData\) \{.*?redirect\('/admin/marketplace'\);\n\}",
    new_edit,
    content,
    flags=re.DOTALL
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
