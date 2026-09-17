"use server";
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password required' };

  // For POC: Just check if user exists by email, ignore password validation since we didn't add it to schema
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid credentials. Hint: use admin@getlands.com or emeka@example.com' };

  await createSession(user.id, user.role);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}
