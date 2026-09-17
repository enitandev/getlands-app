with open('src/app/explore/page.tsx', 'r') as f:
    content = f.read()

import re

# Update ExplorePage to check session
new_page = """import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientExplore from './ClientExplore';

export default async function ExplorePage() {
  const session = await getSession();
  
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: { not: 'draft' }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <ClientExplore opportunities={opportunities} isLoggedIn={!!session?.userId} role={session?.role as string | undefined} />;
}"""

content = re.sub(
    r"import React from 'react';\nimport { prisma } from '@\/lib\/prisma';\nimport ClientExplore from '\.\/ClientExplore';\n\nexport default async function ExplorePage\(\) \{.*\}",
    new_page,
    content,
    flags=re.DOTALL
)

with open('src/app/explore/page.tsx', 'w') as f:
    f.write(content)

with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    client_content = f.read()

client_content = client_content.replace(
    "export default function ClientExplore({ opportunities }: { opportunities: any[] }) {",
    "export default function ClientExplore({ opportunities, isLoggedIn, role }: { opportunities: any[], isLoggedIn?: boolean, role?: string }) {"
)

# Update the Sign In link
old_header = """        <div className="flex items-center gap-[10px]">
          <Link href="/dashboard" className="text-[#18201c] text-[14px] font-bold">Sign In</Link>
        </div>"""

new_header = """        <div className="flex items-center gap-[10px]">
          {isLoggedIn ? (
            <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="px-[20px] py-[10px] bg-[#008b45] text-white rounded-full text-[13px] font-bold shadow-[0_8px_20px_rgba(0,139,69,0.25)] hover:bg-[#007339] transition-colors">
              {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
          ) : (
            <Link href="/login" className="text-[#18201c] text-[14px] font-bold">Sign In</Link>
          )}
        </div>"""

client_content = client_content.replace(old_header, new_header)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(client_content)
