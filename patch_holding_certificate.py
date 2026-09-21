import re

with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

certificate_ui = """
              <div className="py-[15px] flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <svg className="text-[#d4af37]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  <div>
                    <strong className="block text-[13px] text-ink">Certificate of Subscription</strong>
                  </div>
                </div>
                <a href={`/api/documents/certificate/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>
              </div>
"""

# Insert it before the Signed Memorandum of Understanding block
content = content.replace(
    '              <div className="py-[15px] flex justify-between items-center">\n                <div className="flex items-center gap-[10px]">\n                  <svg className="text-[#52525b]" width="16" height="16" viewBox="0 0 24 24"',
    certificate_ui.strip() + '\n              <div className="py-[15px] flex justify-between items-center">\n                <div className="flex items-center gap-[10px]">\n                  <svg className="text-[#52525b]" width="16" height="16" viewBox="0 0 24 24"'
)

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
