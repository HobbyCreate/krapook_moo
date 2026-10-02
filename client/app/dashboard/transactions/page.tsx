"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/component/header";
import { Sidebar } from "@/component/sidebar";
import MobileNavBar from '@/component/mobilenavbar'
import AddTransactionModal from '@/component/modal/addTransactionModal';
import TransactionTable from '@/component/dashboard/transactionsTable';
import { FunnelPlus } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { useTransactionsHook } from "@/customHooks/transactionHooks";
import * as XLSX from "xlsx";

function DashboardContent() {
    const { data: transactionData } = useTransactionsHook();
    const router = useRouter();
    const searchParams = useSearchParams();

    console.log('a', transactionData)

    const [onOpenExport, setOpenExport] = useState<boolean>(false);

    const isAddModalOpen =
        searchParams.get("modal") === "open";

    const openAddTransactionModal = () => {
        router.push("/dashboard/transactions?modal=open");
    };

    const closeAddPocketModal = () => {
        router.push("/dashboard/transactions");
    };

    const exportXLSX = () => {
        const data = transactionData ?? [];

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        XLSX.writeFile(workbook, "transactions.xlsx");
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
                <div className="flex w-full" onClick={() => {
                        if (onOpenExport) {
                            setOpenExport(false);
                        }
                    }}>
                    <div className='bg-[var(--color-bg-main)] w-full mmin-h-[calc(100vh-5rem)]'>
                        <div className="bg-gray-70 w-full p-6 md:p-10">
                            <div className='mb-10 transition-table'>
                                <h2 className='text-3xl font-bold uppercase mb-8'>Transactions</h2>
                            </div>
                            <div className='w-full flex justify-end mb-6 gap-2'>
                                {/* <button
                                    type='button'
                                    className="px-4 py-2 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                    <FunnelPlus />
                                </button> */}
                                <button
                                    onClick={openAddTransactionModal} 
                                    type='button'
                                    className="px-4 py-2 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                    เพิ่มธุรกรรมใหม่
                                </button>
                                <div className='relative'>
                                    <button onClick={() => setOpenExport(prev => !prev)}
                                        type='button'
                                        className="px-4 py-2 min-w-25 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition">
                                        ดึงข้อมูล
                                    </button>
                                    <div
                                        className={`
                                            absolute bottom-0 right-0 min-w-30 py-2 bg-white rounded-2xl
                                            flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-out
                                            ${
                                                onOpenExport
                                                    ? "translate-y-[calc(100%+10px)] opacity-100"
                                                    : "translate-y-[calc(100%+10px)] opacity-0 pointer-events-none"
                                            }
                                        `} >
                                        <CSVLink data={transactionData ?? []} filename="transactions-data.csv" className="px-4 py-2 w-10/12 rounded-full cursor-pointer border border-gray-200 
                                                text-xs font-medium text-white! text-center bg-emerald-600! hover:bg-emerald-600/60! transition uppercase">
                                            csv
                                        </CSVLink>
                                        <button
                                            onClick={exportXLSX}
                                            type="button"
                                            className="px-4 py-2 w-10/12 rounded-full cursor-pointer border border-gray-200 
                                                text-xs font-medium text-white! text-center bg-emerald-600! hover:bg-emerald-600/60! transition uppercase">
                                            xlsx
                                        </button>
                                    </div>
                                </div>
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