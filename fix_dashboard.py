import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    layout = f.read()

# Make layout strict 100dvh on mobile to prevent any body scrolling and cutoffs
layout = layout.replace(
    'className="min-h-screen lg:h-screen lg:overflow-hidden',
    'className="h-[100dvh] lg:h-screen overflow-hidden flex flex-col lg:flex-row bg-[#f7f9f7]"'
)
layout = layout.replace(
    '<main className="flex-1 pb-0 min-w-0">',
    '<main className="flex-1 min-w-0 h-full overflow-hidden">'
)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(layout)
