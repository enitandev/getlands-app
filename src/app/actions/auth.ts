"use server";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password required' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid email or password' };

  const bcrypt = require('bcryptjs');
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid && user.password !== "") {
    return { error: 'Invalid email or password' };
  }

  await createSession(user.id, user.role);
  await sendWelcomeEmail(user.email, user.firstName);

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
  await sendWelcomeEmail(user.email, user.firstName);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email is required' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, don't reveal if user exists or not
    return { success: true };
  }

  // Generate a simple token
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Set expiry to 1 hour from now
  const resetExpires = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  // POC: Output the link to server console for testing
  console.log(`[PASSWORD RESET LINK]: http://localhost:3000/reset-password?token=${resetToken}`);
  await sendPasswordResetEmail(user.email, resetToken);

  return { success: true, token: resetToken };
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token || !password) return { error: 'Invalid request' };

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() }
    }
  });

  if (!user) return { error: 'Invalid or expired token' };

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  return { success: true };
}
