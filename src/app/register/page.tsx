"use client";
import React, { useState } from 'react';
import Link from 'next/link';

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
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Registration disabled in POC. Please use Login.'); }}>
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
}
