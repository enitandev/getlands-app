"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordResetAction(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
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
          <h2 className="text-center text-[28px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Reset Password</h2>
          
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#eef3ef] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-[#008b45]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <p className="text-[14px] text-[#68736d] mb-6">
                If an account exists with that email, we have sent a reset link to your inbox.
              </p>
              <Link href="/login" className="block w-full text-center h-[52px] leading-[52px] rounded-full text-[15px] font-bold text-white bg-[#008b45] hover:bg-[#007339] transition-all">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-[14px] text-[#68736d] mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-[13px] font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-[13px] font-bold text-[#1a1a1a] mb-2">Email Address</label>
                  <input id="email" name="email" type="email" required className="appearance-none block w-full h-[52px] px-4 bg-[#f9faf9] border border-transparent rounded-[14px] focus:bg-white focus:outline-none focus:border-[#008b45] focus:ring-4 focus:ring-[#008b45]/10 transition-all sm:text-[15px]" placeholder="emeka@example.com" />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading} className="w-full flex justify-center items-center h-[52px] px-4 border border-transparent rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.2)] text-[15px] font-bold text-white bg-[#008b45] hover:bg-[#007339] disabled:opacity-50 transition-all">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-[14px] font-bold text-[#68736d] hover:text-[#1a1a1a] transition-colors">Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
