"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Wallet, History, Plus  } from "lucide-react";
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useState } from "react";

export default function MobileNavBar() {
    const menus = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Pocket', icon: Wallet, path: '/dashboard/pockets' },
        { name: 'Add', icon: Plus,  path: '/dashboard/transactions?modal=open'},
        { name: 'Transactions', icon: History, path: '/dashboard/transactions' },
    ];
    return (
        <div className='fixed bottom-0 left-0 w-full md:hidden z-60'>
            <div className='flex h-18 bg-[var(--color-sage-dark)]'>
                {
                    menus.map((menu)=> {
                        const Icon = menu.icon;

                        return (
                            <Link
                                key={menu.name}
                                href={menu.path}
                                className="flex flex-1 flex-col items-center justify-center gap-1 text-white"
                            >
                                <Icon className="w-8 h-8" />

                                {/* <span className="text-xs">
                                    {menu.name}
                                </span> */}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    )
}
