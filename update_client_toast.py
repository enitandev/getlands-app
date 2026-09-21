import re

with open('src/app/admin/customers/ClientCustomers.tsx', 'r') as f:
    content = f.read()

# Add toast state
state_search = "const [loading, setLoading] = useState(false);"
state_replace = """const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  };"""
content = content.replace(state_search, state_replace)

# Replace alerts with showToast
content = content.replace('alert("Customer successfully created! A welcome email with an account claim link has been sent to them.");', 'showToast("Customer successfully created! A welcome email with an account claim link has been sent to them.");')
content = content.replace('alert("Customer successfully created! You can now assign them an opportunity and manually send their invite later.");', 'showToast("Customer successfully created! You can now assign them an opportunity.");')
content = content.replace('alert(res.error);', 'showToast(res.error || "An error occurred.");')
content = content.replace('alert("Opportunity successfully assigned!\\n\\nAutomated System Action:\\n- Transaction Created\\n- Holding Created\\n- Receipt & Agreement PDFs generated on-the-fly\\n- Notification Email Sent");', 'showToast("Opportunity successfully assigned and documents generated!");')
content = content.replace('alert("Invite sent successfully!");', 'showToast("Invite sent successfully!");')

# Add toast UI at the bottom of the main div
toast_ui = """
      {toastMessage && (
        <div className="fixed bottom-[30px] right-[30px] bg-[#1a1a1a] text-white px-[24px] py-[16px] rounded-[12px] shadow-2xl z-[100] animate-fade-in flex items-center gap-[12px] max-w-[400px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <p className="text-[14px] leading-[1.4] font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage("")} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>"""

# Replace the last </div> with the toast UI
content = content[:content.rfind('</div>')] + toast_ui

with open('src/app/admin/customers/ClientCustomers.tsx', 'w') as f:
    f.write(content)

print("Updated toast in ClientCustomers")
