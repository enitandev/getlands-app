import os

login_code = """"use client";
import React, { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-manrope">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="h-10 w-auto" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-[24px] border border-black/5">
          <h2 className="text-center text-[28px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Welcome back</h2>
          <p className="text-center text-[14px] text-[#68736d] mb-8">
            Enter your details to access your portfolio.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-[13px] font-medium flex gap-2 items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none block w-full h-[52px] px-4 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="emeka@example.com" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-[13px] font-bold text-[#1a1a1a]">Password</label>
                <Link href="/forgot-password" className="text-[12px] font-bold text-[#008b45] hover:text-[#007339]">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="appearance-none block w-full h-[52px] pl-4 pr-12 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#68736d] hover:text-[#1a1a1a]">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center h-[52px] px-4 border border-transparent rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.2)] text-[15px] font-bold text-white bg-[#008b45] hover:bg-[#007339] focus:outline-none focus:ring-4 focus:ring-[#008b45]/20 disabled:opacity-50 transition-all">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#68736d]">
              Don't have an account? <Link href="/register" className="font-bold text-[#1a1a1a] hover:text-[#008b45] transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}"""

register_code = """"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await registerAction(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-manrope">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="h-10 w-auto" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-[24px] border border-black/5">
          <h2 className="text-center text-[28px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Create your account</h2>
          <p className="text-center text-[14px] text-[#68736d] mb-8">
            Start building your land portfolio today.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-[13px] font-medium flex gap-2 items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Full Name</label>
              <input id="name" name="name" type="text" required className="appearance-none block w-full h-[52px] px-4 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="Emeka Abraham" />
            </div>

            <div>
              <label htmlFor="email" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Email Address</label>
              <input id="email" name="email" type="email" required className="appearance-none block w-full h-[52px] px-4 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="emeka@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required className="appearance-none block w-full h-[52px] pl-4 pr-12 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#68736d] hover:text-[#1a1a1a]">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center h-[52px] px-4 border border-transparent rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.2)] text-[15px] font-bold text-white bg-[#008b45] hover:bg-[#007339] focus:outline-none focus:ring-4 focus:ring-[#008b45]/20 disabled:opacity-50 transition-all">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#68736d]">
              Already have an account? <Link href="/login" className="font-bold text-[#1a1a1a] hover:text-[#008b45] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}"""

with open('src/app/login/page.tsx', 'w') as f:
    f.write(login_code)

with open('src/app/register/page.tsx', 'w') as f:
    f.write(register_code)

