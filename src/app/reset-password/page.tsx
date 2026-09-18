"use client";
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/app/actions/auth';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-[13px] font-medium mb-6">
          Invalid or missing reset token.
        </div>
        <Link href="/forgot-password" className="block w-full text-center h-[52px] leading-[52px] rounded-full text-[15px] font-bold text-white bg-[#1a1a1a] hover:bg-black transition-all">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm_password') as string;
    
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await resetPasswordAction(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <>
      <p className="text-center text-[14px] text-[#68736d] mb-8">
        Create a new, strong password for your account.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-[13px] font-medium">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">New Password</label>
          <div className="relative">
            <input id="password" name="password" type={showPassword ? "text" : "password"} required className="appearance-none block w-full h-[52px] pl-4 pr-12 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#68736d] hover:text-[#1a1a1a]">
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="confirm_password" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Confirm Password</label>
          <input id="confirm_password" name="confirm_password" type={showPassword ? "text" : "password"} required className="appearance-none block w-full h-[52px] px-4 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="••••••••" />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center h-[52px] px-4 border border-transparent rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.2)] text-[15px] font-bold text-white bg-[#008b45] hover:bg-[#007339] disabled:opacity-50 transition-all">
            {loading ? 'Resetting...' : 'Save New Password'}
          </button>
        </div>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-manrope">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="h-10 w-auto" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-[24px] border border-black/5">
          <h2 className="text-center text-[28px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Set New Password</h2>
          <Suspense fallback={<div className="text-center text-[#68736d]">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
