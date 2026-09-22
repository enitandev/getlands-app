with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    lines = f.readlines()

# We know the empty state closes around line 159
# Let's just find and replace the exact string in the empty state block.
# Actually, it's easier to just do a regex that matches the empty state.
import re
content = "".join(lines)

broken_empty = """        </section>
      </div>

      <ReferralBanner />
      </div>
    );"""

fixed_empty = """        </section>

        <ReferralBanner />
      </div>
    );"""

content = content.replace(broken_empty, fixed_empty)

# Now check the active state
# Active state should end with:
#       <ReferralBanner />
# 
#       {/* Hot Right Now Banner */}
# Let's see what it looks like currently:

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
