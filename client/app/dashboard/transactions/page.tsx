"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/component/header";
import { Sidebar } from "@/component/sidebar";
import MobileNavBar from '@/component/mobilenavbar'
import AddTransactionModal from '@/component/modal/addTransactionModal';
import TransactionTable from '@/component/dashboard/transactionsTable';
import { FunnelPlus } from 'lucide-react';

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAddModalOpen =
        searchParams.get("modal") === "open";

    const openAddTransactionModal = () => {
        router.push("/dashboard/transactions?modal=open");
    };

    const closeAddPocketModal = () => {
        router.push("/dashboard/transactions");
    };

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 pb-10 md:pb-0">
                <Header />
                <div className='hidden md:block'>
                    <Sidebar />
                </div>
                <div className='block md:hidden'>
                    <MobileNavBar />
                </div>
                <div className="flex w-full">
                    <div className='bg-[var(--color-bg-main)] w-full min-h-screen'>
                        <div className="bg-gray-70 w-full p-6 md:p-10">
                            <div className='mb-10 transition-table'>
                                <h2 className='text-3xl font-bold uppercase mb-8'>Transactions</h2>
                            </div>
                            <div className='w-full flex justify-end mb-6 gap-2'>
                                <button
                                    type='button'
                                    className="px-4 py-2 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                    <FunnelPlus />
                                </button>
                                <button
                                    onClick={openAddTransactionModal} 
                                    type='button'
                                    className="px-4 py-2 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                    เพิ่มธุรกรรมใหม่
                                </button>
                                <button
                                    type='button'
                                    className="px-4 py-2 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                    export CSV
                                </button>
                            </div>

                            <AddTransactionModal 
                                isOpen={isAddModalOpen} 
                                onClose={closeAddPocketModal} />
                            <TransactionTable />
                        </div>
                    </div>
                    
                </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}