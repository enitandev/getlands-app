with open('src/app/actions/auth.ts', 'r') as f:
    content = f.read()

import re

# Rewrite loginAction
new_login = """export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password required' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return { error: 'Invalid email or password' };

  const bcrypt = require('bcryptjs');
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid && user.password !== "") {
    return { error: 'Invalid email or password' };
  }

  await createSession(user.id, user.role);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}"""

# Rewrite registerAction
new_register = """export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) return { error: 'All fields required' };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email already exists' };

  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ') || 'User';

  const role = email.toLowerCase() === 'getlands.shop@gmail.com' ? 'admin' : 'customer';

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword
    }
  });

  await createSession(user.id, user.role);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}"""

# Replace in content using regex because we just wrote them in previous steps
content = re.sub(r'export async function loginAction.*?\n}', new_login, content, flags=re.DOTALL)
content = re.sub(r'export async function registerAction.*?\n}', new_register, content, flags=re.DOTALL)

# Also fix reset password
content = content.replace(
"""  await prisma.user.update({
    where: { id: user.id },
    data: {
      // In a real app we would hash this password
      // password: hash(password),
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });""",
"""  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });"""
)

with open('src/app/actions/auth.ts', 'w') as f:
    f.write(content)
