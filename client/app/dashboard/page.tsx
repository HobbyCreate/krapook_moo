"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import api from '@/lib/axios'; // 
import { ChartNoAxesCombined, ArrowUp } from 'lucide-react';
import { Header } from "@/component/header";
import { Sidebar } from "@/component/sidebar";
import BalanceCard from '@/component/dashboard/balanceCard';
import TransactionTable from '@/component/dashboard/transactionsTable';
import PocketCardSwiper from '@/component/dashboard/pocketCardSwiper';
import ExpenseDonutChartCard from '@/component/dashboard/expenseDonutChartCard';
import CompareMultiBarChartCard from '@/component/dashboard/compareMultiBarChartCard';
import CumulativeChartCard from '@/component/dashboard/cumulativeChartCard';
import MobileNavBar from '@/component/mobilenavbar'

import { processDate } from '@/util/util';

export default function Dashboard() {
    const router = useRouter(); 
    const { formattedDateTH, formattedDateEN } = processDate();
    const [openAnalysis, SetOpenAnalysis] = useState<boolean>(false);
    const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

    useEffect(() => {
        api.get('/auth/getme')
            .then((res) => {
                if (!res.data.user) {
                    router.push('/'); 
                } else {
                    setCheckingAuth(false); 
                }
            })
            .catch(() => {
                router.push('/'); 
            });
    }, [router]);

    const openAnalysisToggle = () => {
        SetOpenAnalysis((prev) => !prev);
    }

    if (checkingAuth) {
        return (
            <div className="h-screen w-full bg-zinc-900 flex items-center justify-center text-white">
                กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...
            </div>
        );
    }

    return (
        <div className="relative flex flex-col flex-1 items-center bg-zinc-50 font-sans pb-10 md:pb-0">
                <Header />
                <div className='hidden md:block'>
                    <Sidebar />
                </div>
                <div className='block md:hidden'>
                    <MobileNavBar />
                </div>
                <div className="flex w-full">
                    <div className=' bg-[var(--color-bg-main)] w-full'>
                        <div className="w-full py-6 md:py-10 px-6 md:px-10">
                            <div className='balance-card mb-10'>
                                <div className='flex flex-col-reverse md:flex-row justify-between'>
                                    <h2 className='text-lg md:text-xl lg:text-3xl font-bold uppercase mb-6 text-[var(--color-sage-dark)]'>Balance & Summary</h2>
                                    <h2 className='text-md md:text-lg lg:text-2xl font-bold uppercase mb-6 text-right text-[var(--color-sage-dark)]'>{formattedDateTH} </h2>
                                </div>
                                <BalanceCard />
                                <div className='pb-6'>
                                    <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out
                                            ${openAnalysis ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]' }`} >
                                        <div className="overflow-hidden">
                                            <div className={`grid grid-cols-1 py-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 w-full transition-all duration-500
                                                    ${openAnalysis ? 'opacity-100 translate-y-0 mt-6' : 'opacity-0 -translate-y-4'}`} >
                                                <CumulativeChartCard />
                                                <CompareMultiBarChartCard />
                                                <ExpenseDonutChartCard />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full text-center mt-6 grid place-content-center'>
                                        <button type='button' 
                                            onClick={openAnalysisToggle}
                                            className='primary-button flex items-center py-0 px-4 bg-emerald-600 text-white! rounded-full cursor-pointer'>
                                            <ChartNoAxesCombined className='w-5 h-5'/>
                                            <p className='m-2 text-white! text-bold'>ดูการวิเคราะห์</p>
                                            <ArrowUp className={`w-5 h-5 transition-all duration-300 ${openAnalysis ? 'rotate-0':'rotate-180'}`}/>
                                        </button>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='balance-card mb-10'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-lg md:text-xl lg:text-3xl font-bold uppercase mb-4 text-[var(--color-sage-dark)]'>Pockets</h2>
                                    <Link
                                        href="/dashboard/pockets?modal=add"
                                        className="primary-button flex items-center py-2 px-4 bg-emerald-600 text-white! rounded-full cursor-pointer"
                                    >
                                        + เพิ่มกระเป๋า
                                    </Link>
                                </div>
                                <PocketCardSwiper />
                            </div>

                            <div className='balance-card mb-10'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h2 className='text-lg md:text-xl lg:text-3xl font-bold uppercase mb-6 text-[var(--color-sage-dark)]'>Transactions</h2>
                                    <Link
                                        href="/dashboard/transactions?modal=open"
                                        className="primary-button flex items-center py-2 px-4 bg-emerald-600 text-white! rounded-full cursor-pointer"
                                    >
                                        + เพิ่มธุรกรรม
                                    </Link>
                                </div>
                                <TransactionTable />
                            </div>
                        </div>
                    </div>
                    
                </div>
        </div>
    );
}