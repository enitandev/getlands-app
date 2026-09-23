import re

with open('src/components/ui/NotificationDropdown.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import Link from \'next/link\';',
    'import Link from \'next/link\';\nimport { markNotificationAsRead, markAllNotificationsAsRead } from \'@/app/actions/notifications\';'
)

action_code = """
  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };
  
  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };
"""

content = content.replace(
    '  const markAsRead = async (id: string) => {\n    // We will implement the server action call here\n  };',
    action_code
)

content = content.replace(
    '{unreadCount > 0 && <span className="text-[12px] text-[#68736d]">{unreadCount} unread</span>}',
    '{unreadCount > 0 && <button onClick={markAllAsRead} className="text-[12px] font-bold text-[#008b45] hover:underline">Mark all read</button>}'
)

with open('src/components/ui/NotificationDropdown.tsx', 'w') as f:
    f.write(content)
