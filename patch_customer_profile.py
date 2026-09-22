import re

with open('src/app/admin/customers/[id]/page.tsx', 'r') as f:
    content = f.read()

if "LegacyReferralModal" not in content:
    content = content.replace("import { notFound } from 'next/navigation';", "import { notFound } from 'next/navigation';\nimport { LegacyReferralModal } from '../LegacyReferralModal';")

pattern = r"(            <h1 className=\"font-manrope text-\[24px\] lg:text-\[32px\] tracking-\[-0\.03em\] font-bold text-ink leading-none mb-\[5px\]\">Customer Profile</h1>\n            <p className=\"text-\[13px\] text-\[\#68736d\]\">Detailed view of holdings and documents\.</p>\n          </div>\n        </div>\n      </div>)"

replacement = r"""            <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Customer Profile</h1>
            <p className="text-[13px] text-[#68736d]">Detailed view of holdings and documents.</p>
          </div>
        </div>
        
        <div className="flex gap-[10px]">
          {!user.referredById && <LegacyReferralModal referredUserId={user.id} />}
        </div>
      </div>"""

content = re.sub(pattern, replacement, content)

with open('src/app/admin/customers/[id]/page.tsx', 'w') as f:
    f.write(content)

