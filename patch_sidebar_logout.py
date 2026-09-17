with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

import re

# Add form with logoutAction
content = content.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport { logoutAction } from '@/app/actions/auth';"
)

logout_button = """        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-[20px] lg:p-[30px]">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-[15px] w-full text-left text-[#68736d] hover:text-[#e53935] transition-colors group">
              <svg className="shrink-0 group-hover:stroke-[#e53935]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {!isCollapsed && <span className="font-bold text-[14px]">Log Out</span>}
            </button>
          </form>
        </div>
      </aside>"""

content = content.replace("        </div>\n      </aside>", logout_button)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)

# Admin Layout
with open('src/app/admin/ClientAdminLayout.tsx', 'r') as f:
    admin_content = f.read()

admin_content = admin_content.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport { logoutAction } from '@/app/actions/auth';"
)

admin_logout_button = """        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-[20px] lg:p-[30px]">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-[15px] w-full text-left text-[#68736d] hover:text-[#e53935] transition-colors group">
              <svg className="shrink-0 group-hover:stroke-[#e53935]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span className="font-bold text-[14px]">Log Out</span>
            </button>
          </form>
        </div>
      </aside>"""

admin_content = admin_content.replace("        </div>\n      </aside>", admin_logout_button)

with open('src/app/admin/ClientAdminLayout.tsx', 'w') as f:
    f.write(admin_content)

