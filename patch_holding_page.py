import re

with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

# Make it a server component
new_top = """import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';

export default async function ManageHoldingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  if (!session || !session.userId) redirect('/login');

  const holding = await prisma.holding.findUnique({
    where: { id: resolvedParams.id },
    include: { opportunity: true, cohort: true, transactions: true }
  });

  if (!holding || holding.userId !== session.userId) redirect('/dashboard');
"""

content = re.sub(
    r'import React from \'react\';[\s\S]*?export default function ManageHoldingPage\(\) \{',
    new_top,
    content
)

# Replace hardcoded values
content = content.replace('>Abeokuta Land Banking<', '>{holding.opportunity.title}<')
content = content.replace('Acquired on Oct 25, 2024 • REF-GL-8X91M2', 'Acquired on {new Date(holding.createdAt).toLocaleDateString()} • REF-{holding.id.substring(0,8).toUpperCase()}')
content = content.replace('{formatCurrency(1000000)}', '{formatCurrency(holding.totalAmount)}')
content = content.replace('{formatCurrency(1150000)}', '{formatCurrency(holding.totalAmount)}')
content = content.replace('+15%', '{holding.opportunity.projectedReturn || "N/A"}')
content = content.replace('Oct 25, 2025', '{holding.cohort?.closesAt ? new Date(holding.cohort.closesAt).toLocaleDateString() : "N/A"}')

# Replace the receipt download button
content = content.replace(
    '<button className="text-[11px] font-bold text-[#008b45] hover:underline">Download</button>',
    '<a href={`/api/documents/receipt/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>',
    1 # only the first one (receipt)
)

# Second one is MoU. Replace with placeholder alert or href="#"
content = content.replace(
    '<button className="text-[11px] font-bold text-[#008b45] hover:underline">Download</button>',
    '<button className="text-[11px] font-bold text-[#68736d] cursor-not-allowed" title="Not available yet">Pending</button>'
)

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
