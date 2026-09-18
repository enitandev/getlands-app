with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("Welcome back, Emeka.", "Welcome back, {user.firstName}.")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
