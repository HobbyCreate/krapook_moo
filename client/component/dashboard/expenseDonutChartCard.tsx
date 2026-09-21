import React from 'react'
// import { useBalanceHook } from '@/customHooks/balanceHooks'
import { useTransactionsHook } from '@/customHooks/transactionHooks';
import { getMonthlyPocketSpending } from '@/util/donutChartUtil'
import { Chart } from '@tanstack/charts/react'
import { createUsageDonutChart } from '@/scripts/donutChartDefinition'

export default function ExpenseDonutChartCard() {
    // const { data: balanceData, isLoading: isBalanceLoading, isError: isBalanceError } = useBalanceHook();
    const { data: transactionData, isLoading: isTransactionLoading , isError: isTransactionError } = useTransactionsHook();

    const isLoading = isTransactionLoading;
    const isError = isTransactionError;

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm grid">
                {/* Header Skeleton */}
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                
                {/* Chart Box Skeleton */}
                <div className="w-full h-50 sm:h-60 flex items-center justify-center rounded-xl bg-gray-50">
                    {/* <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-42 border-gray-200 border-t-gray-300 animate-pulse" /> */}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 rounded-2xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-center min-h-[250px]">
                <p className="text-sm text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            </div>
        );
    }
    
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1);
    const chartData = getMonthlyPocketSpending(transactionData || [], currentYear, currentMonth);
    

    const initailChartColor = '#ef4444';
    const chartDefinition = createUsageDonutChart(chartData, initailChartColor);

    return (
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm grid">
            <h3 className="text-lg font-bold text-gray-800 mb-4">สรุปค่าใช้จ่ายประจำเดือน</h3>
            
            <div className="w-full flex items-center justify-center rounded-xl mx-h-[320px]">
                {chartData.length === 0 ? (
                    <p className="text-base text-gray-400">ไม่มีข้อมูลธุรกรรมในเดือนนี้</p>
                ) : (
                    <div className="text-base text-gray-600 max-h-[320px]">
                        <Chart 
                            ariaLabel="Monthly pocket spending donut chart"
                            definition={chartDefinition} 
                            className="w-full h-full" 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

