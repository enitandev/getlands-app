with open('src/app/actions/auth.ts', 'r') as f:
    content = f.read()

new_action = """
export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) return { error: 'All fields required' };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email already exists' };

  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ') || 'User';

  const role = email.toLowerCase() === 'getlands.shop@gmail.com' ? 'admin' : 'customer';

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      role
    }
  });

  await createSession(user.id, user.role);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}
"""

if "registerAction" not in content:
    content += new_action

with open('src/app/actions/auth.ts', 'w') as f:
    f.write(content)


with open('src/app/register/page.tsx', 'r') as f:
    reg_content = f.read()

import re

# We need to change register page to use the server action
reg_new = """import React from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f9f7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="h-10 w-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-manrope">Create an account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="font-medium text-[#008b45] hover:text-[#007339]">Sign in</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-black/5">
          <form className="space-y-6" action={registerAction}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#008b45] focus:border-[#008b45] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#008b45] focus:border-[#008b45] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#008b45] focus:border-[#008b45] sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#008b45] hover:bg-[#007339] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008b45]">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}"""

with open('src/app/register/page.tsx', 'w') as f:
    f.write(reg_new)

# Also let's patch the hardcoded login error hint in src/app/login/page.tsx
with open('src/app/login/page.tsx', 'r') as f:
    login_content = f.read()
login_content = login_content.replace('Invalid credentials. Hint: use admin@getlands.com or emeka@example.com', 'Invalid credentials.')
with open('src/app/login/page.tsx', 'w') as f:
    f.write(login_content)

