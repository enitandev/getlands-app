import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Insert into empty state
empty_state_pattern = r"(             \}\)\n          </div>\n        </section>\n      </div>)"
empty_state_replacement = r"             })\n          </div>\n        </section>\n\n        <ReferralBanner />\n      </div>"
content = re.sub(empty_state_pattern, empty_state_replacement, content)

# Insert into active state
active_state_pattern = r"(      </section>\n\n      \{\/\* Hot Right Now Banner \*\/})"
active_state_replacement = r"      </section>\n\n      <ReferralBanner />\n\n      {/* Hot Right Now Banner */}"
content = re.sub(active_state_pattern, active_state_replacement, content)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
