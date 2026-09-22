import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

old_str = """             )}
          </div>
        </section>
      </div>"""
new_str = """             )}
          </div>
        </section>

        <ReferralBanner />
      </div>"""

content = content.replace(old_str, new_str)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
