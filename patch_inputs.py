with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# Fix normal inputs
old_input_class = "w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors"
new_input_class = "w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm"
content = content.replace(old_input_class, new_input_class)

# Fix Account Name input
old_account_name = """<input type="text" defaultValue={`${user.firstName} ${user.lastName}`} disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />"""
new_account_name = f"""<input name="accountName" type="text" defaultValue={{user.accountName || `${{user.firstName}} ${{user.lastName}}`}} className="{new_input_class}" required />"""
content = content.replace(old_account_name, new_account_name)

# Fix Email disabled input to have border
old_email_input = """<input type="email" defaultValue={user.email} disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />"""
new_email_input = """<input type="email" defaultValue={user.email} disabled className="w-full h-[50px] bg-gray-50 border border-gray-200 text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />"""
content = content.replace(old_email_input, new_email_input)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)

# We also need to fix user.ts updateBankDetailsAction to actually save accountName since it wasn't saving it before (it was disabled)
with open('src/app/actions/user.ts', 'r') as f:
    user_ts = f.read()

if "accountName" not in user_ts.split('updateBankDetailsAction')[1].split('updateNextOfKinAction')[0]:
    user_ts = user_ts.replace(
        "const accountNumber = formData.get('accountNumber') as string;",
        "const accountNumber = formData.get('accountNumber') as string;\n  const accountName = formData.get('accountName') as string;"
    )
    user_ts = user_ts.replace(
        "data: { bankName, accountNumber }",
        "data: { bankName, accountNumber, accountName }"
    )
    with open('src/app/actions/user.ts', 'w') as f:
        f.write(user_ts)
