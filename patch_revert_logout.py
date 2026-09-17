import re

# Remove logout from Dashboard Layout
with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

logout_block = """        
        <div className="absolute bottom-0 left-0 w-full p-[20px] lg:p-[30px]">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-[15px] w-full text-left text-[#68736d] hover:text-[#e53935] transition-colors group">
              <svg className="shrink-0 group-hover:stroke-[#e53935]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {!isCollapsed && <span className="font-bold text-[14px]">Log Out</span>}
            </button>
          </form>
        </div>"""
content = content.replace(logout_block, "")

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)

# Remove logout from Admin Layout
with open('src/app/admin/ClientAdminLayout.tsx', 'r') as f:
    admin_content = f.read()

admin_logout_block = """        
        <div className="absolute bottom-0 left-0 w-full p-[20px] lg:p-[30px]">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-[15px] w-full text-left text-[#68736d] hover:text-[#e53935] transition-colors group">
              <svg className="shrink-0 group-hover:stroke-[#e53935]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span className="font-bold text-[14px]">Log Out</span>
            </button>
          </form>
        </div>"""
admin_content = admin_content.replace(admin_logout_block, "")

with open('src/app/admin/ClientAdminLayout.tsx', 'w') as f:
    f.write(admin_content)

# Add logout to Settings Page
with open('src/app/dashboard/settings/page.tsx', 'r') as f:
    settings_content = f.read()

settings_content = settings_content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { logoutAction } from '@/app/actions/auth';"
)

settings_logout_block = """      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px]">"""
settings_replacement = """      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px] mb-[30px]">"""

settings_content = settings_content.replace(settings_logout_block, settings_replacement)

end_of_content = """        )}
      </div>
    </div>
  );
}"""

new_end = """        )}
      </div>

      <div className="max-w-[800px]">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-[10px] px-[24px] py-[14px] bg-white border border-[#e53935]/20 text-[#e53935] font-bold rounded-[16px] hover:bg-[#e53935]/5 transition-colors shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out of Getlands
          </button>
        </form>
      </div>
    </div>
  );
}"""

settings_content = settings_content.replace(end_of_content, new_end)

with open('src/app/dashboard/settings/page.tsx', 'w') as f:
    f.write(settings_content)

