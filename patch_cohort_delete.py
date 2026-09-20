import re

with open('src/app/actions/cohorts.ts', 'r') as f:
    content = f.read()

delete_action = """
export async function deleteCohort(cohortId: string) {
  await checkAdmin();
  await prisma.cohort.delete({
    where: { id: cohortId }
  });
  revalidatePath('/admin/marketplace');
}
"""

if 'deleteCohort' not in content:
    content += delete_action
    
with open('src/app/actions/cohorts.ts', 'w') as f:
    f.write(content)
