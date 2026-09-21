import re

with open('src/app/admin/customers/ClientCustomers.tsx', 'r') as f:
    content = f.read()

# Update import
content = content.replace("addLegacyCustomerAction, assignOpportunityAction, deleteCustomerAction", "addLegacyCustomerAction, assignOpportunityAction, deleteCustomerAction, sendInviteAction")

# Update handleAddCustomer alert message
old_alert = 'alert("Customer successfully created! A welcome email with an account claim link has been sent to them.");'
new_alert = '''const wasEmailSent = formData.get('sendEmail') === 'on';
      if (wasEmailSent) {
        alert("Customer successfully created! A welcome email with an account claim link has been sent to them.");
      } else {
        alert("Customer successfully created! You can now assign them an opportunity and manually send their invite later.");
      }'''
content = content.replace(old_alert, new_alert)

# Add checkbox to Add Customer modal
old_phone = '''<div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                  <input name="phone" type="tel" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" />
                </div>'''

new_phone = '''<div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                  <input name="phone" type="tel" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-black/10 transition-colors" />
                </div>
                <div className="flex items-center gap-[10px] mt-[10px]">
                  <input type="checkbox" name="sendEmail" id="sendEmail" defaultChecked className="w-[18px] h-[18px] accent-[#008b45]" />
                  <label htmlFor="sendEmail" className="text-[13px] text-ink cursor-pointer">Send 'Claim Account' Email instantly</label>
                </div>'''
content = content.replace(old_phone, new_phone)

# Add Send Invite button
old_buttons = '''<Link href={`/admin/customers/${c.id}`} className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">
                    Profile
                  </Link>'''
new_buttons = '''<button 
                    className="text-[13px] font-bold text-ink hover:text-[#008b45] transition-colors disabled:opacity-50" 
                    disabled={loading}
                    onClick={async () => {
                      if (window.confirm(`Send a 'Claim Account' email to ${c.firstName}?`)) {
                        setLoading(true);
                        const res = await sendInviteAction(c.id);
                        setLoading(false);
                        if(res.error) alert(res.error);
                        else alert("Invite sent successfully!");
                      }
                    }}>
                    Send Invite
                  </button>
                  <Link href={`/admin/customers/${c.id}`} className="text-[13px] font-bold text-[#008b45] hover:underline transition-colors">
                    Profile
                  </Link>'''
content = content.replace(old_buttons, new_buttons)


# Also update the submit button text to be dynamic based on checkbox
old_submit_button = '''{loading ? 'Creating...' : 'Create Customer & Send Claim Email'}'''
new_submit_button = '''{loading ? 'Creating...' : 'Create Customer'}'''
content = content.replace(old_submit_button, new_submit_button)


with open('src/app/admin/customers/ClientCustomers.tsx', 'w') as f:
    f.write(content)

print("Updated ClientCustomers.tsx")
