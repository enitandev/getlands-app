with open('src/app/actions/auth.ts', 'r') as f:
    content = f.read()

# Add imports
if 'import { sendWelcomeEmail, sendPasswordResetEmail } from' not in content:
    content = content.replace('"use server";', '"use server";\nimport { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";')

# Add welcome email
if 'await sendWelcomeEmail(user.email, user.firstName);' not in content:
    content = content.replace(
        'await createSession(user.id, user.role);',
        'await createSession(user.id, user.role);\n  await sendWelcomeEmail(user.email, user.firstName);'
    )

# Add password reset email
if 'await sendPasswordResetEmail(user.email, resetToken);' not in content:
    content = content.replace(
        'console.log(`[PASSWORD RESET LINK]: http://localhost:3000/reset-password?token=${resetToken}`);',
        'console.log(`[PASSWORD RESET LINK]: http://localhost:3000/reset-password?token=${resetToken}`);\n  await sendPasswordResetEmail(user.email, resetToken);'
    )

with open('src/app/actions/auth.ts', 'w') as f:
    f.write(content)
