with open('src/lib/email.ts', 'r') as f:
    content = f.read()

bad_jsx = """      <div style="text-align: center; margin: 32px 0;">
        <a href={resetToken ? `https://getlands.shop/reset-password?token=${resetToken}` : "https://getlands.shop/dashboard/holdings"} style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          {resetToken ? "Set Password & View Portfolio" : "View Your Portfolio"}
        </a>
      </div>"""

good_template = """      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetToken ? `https://getlands.shop/reset-password?token=${resetToken}` : `https://getlands.shop/dashboard/holdings`}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          ${resetToken ? "Set Password & View Portfolio" : "View Your Portfolio"}
        </a>
      </div>"""

content = content.replace(bad_jsx, good_template)

with open('src/lib/email.ts', 'w') as f:
    f.write(content)
