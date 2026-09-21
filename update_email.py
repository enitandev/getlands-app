import re

with open('src/lib/email.ts', 'r') as f:
    content = f.read()

old_func = """export async function sendNewInvestmentEmail(email: string, firstName: string, opportunityName: string, units: number) {"""
new_func = """export async function sendNewInvestmentEmail(email: string, firstName: string, opportunityName: string, units: number, resetToken?: string | null) {"""
content = content.replace(old_func, new_func)

old_body = """      <div style="text-align: center; margin: 32px 0;">
        <a href="https://getlands.shop/dashboard/holdings" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          View Your Portfolio
        </a>
      </div>"""

new_body = """      <div style="text-align: center; margin: 32px 0;">
        <a href={resetToken ? `https://getlands.shop/reset-password?token=${resetToken}` : "https://getlands.shop/dashboard/holdings"} style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          {resetToken ? "Set Password & View Portfolio" : "View Your Portfolio"}
        </a>
      </div>"""
content = content.replace(old_body, new_body)

with open('src/lib/email.ts', 'w') as f:
    f.write(content)

with open('src/app/actions/admin-customers.ts', 'r') as f:
    content = f.read()

old_assign = """  // 3. Send email notification
  await sendNewInvestmentEmail(user.email, user.firstName, opportunity.title, units);"""

new_assign = """  // 3. Send email notification
  // If user has an active reset token (e.g. they are a new legacy customer who hasn't claimed their account)
  // we pass it so the email button says "Set Password & View Portfolio" instead of just "View Portfolio"
  let token = null;
  if (user.resetPasswordToken && user.resetPasswordExpires && user.resetPasswordExpires > new Date()) {
    token = user.resetPasswordToken;
  }
  await sendNewInvestmentEmail(user.email, user.firstName, opportunity.title, units, token);"""
content = content.replace(old_assign, new_assign)

with open('src/app/actions/admin-customers.ts', 'w') as f:
    f.write(content)

print("Updated email template and action logic")
