import re

with open('src/app/admin/customers/ClientCustomers.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { toast } from '@/components/ui/Toast';\nimport { ConfirmModal } from '@/components/ui/ConfirmModal';")

# Remove inline toast state and function
state_search = """const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  };"""
state_replace = """const [loading, setLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, title: string, message: string, action: (() => void) | null, isDestructive?: boolean}>({
    isOpen: false, title: '', message: '', action: null
  });"""
content = content.replace(state_search, state_replace)

# Replace showToast with toast()
content = content.replace("showToast(", "toast(")

# Replace window.confirm for Delete Customer
old_delete = """onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this customer? This will also delete their transactions and holdings.')) {
                        setLoading(true);
                        await deleteCustomerAction(c.id);
                        setLoading(false);
                      }
                    }}>"""
new_delete = """onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: 'Delete Customer',
                        message: 'Are you sure you want to delete this customer? This will also permanently delete their transactions and holdings.',
                        isDestructive: true,
                        action: async () => {
                          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                          setLoading(true);
                          await deleteCustomerAction(c.id);
                          setLoading(false);
                          toast('Customer deleted successfully', 'success');
                        }
                      });
                    }}>"""
content = content.replace(old_delete, new_delete)

# Replace window.confirm for Send Invite
old_invite = """onClick={async () => {
                      if (window.confirm(`Send a 'Claim Account' email to ${c.firstName}?`)) {
                        setLoading(true);
                        const res = await sendInviteAction(c.id);
                        setLoading(false);
                        if(res.error) toast(res.error || "An error occurred.");
                        else toast("Invite sent successfully!");
                      }
                    }}>"""
new_invite = """onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: 'Send Invite',
                        message: `This will send a 'Claim Account' email to ${c.firstName} with a secure link to set their password. Proceed?`,
                        isDestructive: false,
                        action: async () => {
                          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                          setLoading(true);
                          const res = await sendInviteAction(c.id);
                          setLoading(false);
                          if(res.error) toast(res.error, 'error');
                          else toast("Invite sent successfully!", 'success');
                        }
                      });
                    }}>"""
content = content.replace(old_invite, new_invite)

# Remove the inline toast UI block at the bottom
# It starts with {toastMessage && ( ... )}
# Find and remove it.
import textwrap

toast_ui_pattern = r"\{toastMessage && \(\s*<div className=\"fixed bottom-\[30px\].*?</div>\s*\)\}"
content = re.sub(toast_ui_pattern, "", content, flags=re.DOTALL)

# Inject the ConfirmModal right before the last closing div
confirm_modal_ui = """
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
        confirmText={confirmConfig.isDestructive ? "Delete" : "Send Email"}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action();
        }}
      />
    </div>"""
content = content[:content.rfind('</div>')] + confirm_modal_ui

with open('src/app/admin/customers/ClientCustomers.tsx', 'w') as f:
    f.write(content)

print("Updated ClientCustomers to use ConfirmModal and Global Toast")
