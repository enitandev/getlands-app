with open('src/app/admin/settings/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { logoutAction } from '@/app/actions/auth';"
)

end_content = """        </div>
      </div>
    </div>
  );
}"""

new_end_content = """          {/* Logout Box */}
          <div className="bg-white rounded-[24px] p-[30px] border border-[#e53935]/10 shadow-sm mt-[30px]">
            <h2 className="font-manrope text-[18px] font-bold text-[#e53935] mb-[15px]">Security & Access</h2>
            <p className="text-[13px] text-[#68736d] mb-[20px]">End your active administrative session on this device.</p>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-[10px] px-[24px] py-[14px] bg-white border border-[#e53935]/20 text-[#e53935] font-bold rounded-[16px] hover:bg-[#e53935]/5 transition-colors shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log Out of Admin Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}"""

content = content.replace(end_content, new_end_content)

with open('src/app/admin/settings/page.tsx', 'w') as f:
    f.write(content)
