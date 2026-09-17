with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("notification.type.replace('_', ' ')", "'ALERT'")
content = content.replace("notification.date", "new Date(notification.createdAt).toLocaleDateString()")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
