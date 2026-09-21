"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'; 
import { LayoutDashboard } from 'lucide-react';

export const Header = () => {
    const { user, loading, fetchUser } = useAuthStore();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    return (
        <header className="w-full h-18 bg-[var(--color-sage-main)] flex justify-between items-center px-6 md:px-10 shadow-sm">
            <div>
                <Link href="/" className="flex flex-row items-center justify-center ">
                    <Image
                        src="/krapook_icon.png"
                        width={50}
                        height={50}
                        alt="krapook_moo_icon"
                        className='mr-3' 
                        />
                    <p className='text-black! text-2xl tracking-wide font-bold hidden md:block'>Krapook Moo</p>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {loading && !user ? (
                <div className="text-gray-400 text-sm">กำลังโหลด...</div>
                ) : user ? (
                <div className="flex items-center gap-6">
                    {!pathname.startsWith('/dashboard') && (
                        <Link 
                        href="/dashboard" 
                        className="flex gap-2 bg-emerald-700 text-white px-2 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600/70 transition"
                        >
                            <LayoutDashboard size={20} className=''/>
                            <p className='text-white! hidden md:block'>Dashboard</p>
                        </Link>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="font-medium text-sm text-gray-700!">{user.firstname} {user.lastname}</p>
                            <p className="text-xs text-gray-700!">{user.email}</p>
                        </div>
                        <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                            {user.firstname ? user.firstname.charAt(0).toUpperCase() : "U"}
                        </div>
                    </div>
                </div>
                ) : (
                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-gray-700 hover:text-black font-medium text-sm px-3 py-2">
                    เข้าสู่ระบบ
                    </Link>
                    <Link href="/register" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                    สมัครสมาชิก
                    </Link>
                </div>
                )}
            </div>
        </header>
    );
};