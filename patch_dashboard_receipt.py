import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

download_ui = """
                <div className="flex flex-col items-end gap-[5px]">
                  <strong className="block text-[16px] text-ink">{formatCurrency(holding.totalAmount || 0)}</strong>
                  <a href={`/api/documents/receipt/${holding.id}`} target="_blank" className="text-[10px] font-bold text-[#008b45] hover:underline uppercase tracking-wider flex items-center gap-[4px]" onClick={(e) => e.stopPropagation()}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Receipt
                  </a>
                </div>
"""

content = re.sub(
    r'<div className="text-right">\s*<strong className="block text-\[16px\] text-ink">\{formatCurrency\(holding\.total_amount\)\}</strong>\s*</div>',
    download_ui.strip(),
    content
)

# Also fix total_amount to totalAmount for JS camelCase model
content = content.replace('holding.total_amount', 'holding.totalAmount')

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
