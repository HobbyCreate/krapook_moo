'use client'

import React, { useState } from 'react'
import { useTransactionsHook } from '@/customHooks/transactionHooks';
import { getIncomeExpenseTrendData } from '@/util/multiBarChartUtil';
import { createIncomeExpenseMultibarChart } from '@/scripts/multiBarChartDefinition';
import { Chart } from '@tanstack/charts/react'


export default function CompareMultiBarChartCard() {
    const { data: transactionData, isLoading: isTransactionLoading, isError: isTransactionError } = useTransactionsHook();
    
    const [selectedMonths, setSelectedMonths] = useState<number>(3);

    const isLoading = isTransactionLoading;
    const isError = isTransactionError;

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-full h-[300px] flex items-center justify-center rounded-xl bg-gray-50 animate-pulse" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 rounded-2xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-center min-h-[250px]">
                <p className="text-base text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            </div>
        );
    }
    

    const chartData = getIncomeExpenseTrendData(transactionData || [], selectedMonths);
    const chartDefinition = createIncomeExpenseMultibarChart(chartData);

    return (
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">เปรียบเทียบรายรับและรายจ่าย</h3>
                    <p className="text-sm text-gray-500">แสดงข้อมูลงย้อนหลัง {selectedMonths} เดือน</p>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-lg text-sm font-medium">
                    <button
                        onClick={() => setSelectedMonths(3)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md transition-all ${selectedMonths === 3 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        3 เดือน
                    </button>
                    <button
                        onClick={() => setSelectedMonths(6)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md transition-all ${selectedMonths === 6 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        6 เดือน
                    </button>
                </div>
            </div>
            
            <div className="w-full flex items-center justify-center max-h-[320px]">
                {chartData.length === 0 ? (
                    <p className="text-base text-gray-400">ไม่มีข้อมูลธุรกรรมในช่วงเวลานี้</p>
                ) : (
                    <div className="w-full h-full">
                        <Chart definition={chartDefinition} ariaLabel="กราฟเปรียบเทียบรายรับและรายจ่ายรายเดือน" className=''/>
                    </div>
                )}
            </div>
        </div>
    );
}