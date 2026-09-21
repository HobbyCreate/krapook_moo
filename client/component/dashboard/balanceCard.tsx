
import { useBalanceHook } from '@/customHooks/balanceHooks';
import { Wallet } from 'lucide-react';

export default function BalanceCard() {
    const { data: balanceData, isLoading, isError } = useBalanceHook();
    if (isLoading) {
        return (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full md:w-80 min-h-30 mb-4">
                        <p className="text-lg text-gray-500 font-medium"></p>
                        <p className="text-md font-extrabold text-gray-500 mt-2">
                            กำลังโหลดข้อมูลยอดเงิน
                        </p>
                    </div>
                )
    }

    if (isError) {
        return (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full md:w-80 min-h-30 mb-4">
                        <p className="text-lg text-gray-500 font-medium"></p>
                        <p className="text-md font-extrabold text-red-500 mt-2">
                            เกิดข้อผิดพลาดของระบบ
                        </p>
                    </div>
                )
    }

    return (
        <div className="balance-card bg-[var(--color-bg-card)] p-6 rounded-2xl shadow-sm border border-gray-200/40 w-full md:w-80 min-h-36 flex flex-col justify-between hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start ">
                <div>
                    <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider">
                        ยอดเงินคงเหลือหลัก
                    </h2>
                    <span className="text-base text-gray-400 font-medium">ภาพรวมสภาพคล่อง</span>
                </div>
                <div className="w-10 h-10 rounded-xl p-2 bg-emerald-50 flex items-center justify-center text-emerald-500!">
                    <Wallet/>
                </div>
            </div>

            <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
                <span className="text-base font-medium text-white! bg-emerald-600 px-4 py-1 rounded-full">
                    พร้อมใช้
                </span>
                <div className="text-right">
                    <span className="text-2xl md:text-3xl font-black text-emerald-500! tracking-tight">
                        {(balanceData?.amount ?? 0).toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-gray-500 ml-1">
                        THB
                    </span>
                </div>
            </div>
        </div>
                        
    )
} 