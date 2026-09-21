"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setLoginData = useAuthStore((state) => state.setLoginData);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        const { user, accessToken } = response.data;

        // บันทึกลง Zustand และ localStorage อัตโนมัติ
        setLoginData(user, accessToken);

        router.push('/dashboard');
        router.refresh(); 
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as { error?: string };
        setError(serverError?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-100">
        
        <div className="flex flex-col items-center mb-6">
          <h2 className="font-extrabold text-center text-xl xl:text-2xl text-gray-900 tracking-tight">
            เข้าสู่ระบบบัญชีของคุณ
          </h2>
          <p className="text-center text-xs text-gray-500 mt-1">
            ยินดีต้อนรับกลับ! กรุณากรอกข้อมูลเพื่อเข้าใช้งาน
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              อีเมล
            </label>
            <input 
              type="email" 
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              รหัสผ่าน
            </label>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center justify-center" role="status">
                <svg aria-hidden="true" className="w-5 h-5 text-emerald-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ยังไม่มีบัญชีใช่ไหม?{' '}
            <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}