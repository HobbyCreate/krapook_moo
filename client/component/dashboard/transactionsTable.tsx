import { useState } from "react";
import { useTransactionsHook, Transactions } from "@/customHooks/transactionHooks";
import { usePathname } from 'next/navigation'
import { Trash, SquarePen } from 'lucide-react';
import EditTransactionModal from "../modal/editTransactionModal";

export default function TransactionTable() {
    const { data: transactionData, isLoading, isError } = useTransactionsHook();

    const [currentPage, setCurrentPage] = useState(1);
    let itemsPerPage;
    const pathname = usePathname();
    const isTransactionsPage = pathname.startsWith('/dashboard/transactions');
    if(isTransactionsPage) {
        itemsPerPage = 20;
    } else {
        itemsPerPage = 5;
    }

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-80 min-h-30 mb-4">
                <p className="text-md font-medium text-gray-400 mt-2">กำลังโหลด...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-80 min-h-30 mb-4">
                <p className="text-md font-extrabold text-red-500 mt-2">
                    เกิดข้อผิดพลาดของระบบ
                </p>
            </div>
        );
    }

    if (!transactionData || transactionData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200/40 w-full min-h-30 mb-4 flex items-center justify-center">
                <p className="text-gray-400">ยังไม่มีประวัติธุรกรรม</p>
            </div>
        );
    }

    const totalPages = Math.ceil(transactionData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTransactions = transactionData.slice(startIndex, startIndex + itemsPerPage);

    const checkEdit = (date: number): boolean => {
        const nowDate = new Date().getTime();
        const diffInMs = nowDate - date; 
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; 
        return diffInMs <= threeDaysInMs;
    }

    return (
        <div className="overflow-scroll lg:overflow-hidden pb-6">
        <div className="w-max lg:w-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/40 w-full overflow-hidden">
                <div className={`grid grid-cols-6 bg-[var(--color-bg-submain)] border-b border-gray-100 
                            text-gray-400 text-xs font-bold uppercase tracking-wider py-3.5 px-4 text-center`}>
                    <div className="text-[var(--color-slate-900)] text-base">ชื่อกระเป๋า</div>
                    <div className="text-[var(--color-slate-900)] text-base">ประเภทธุรกรรม</div>
                    <div className="text-[var(--color-slate-900)] text-base">จำนวน</div>
                    <div className="text-[var(--color-slate-900)] text-base">เกินงบกระเป๋า</div>
                    <div className="text-[var(--color-slate-900)] text-base">วัน</div>
                    <div className="text-[var(--color-slate-900)] text-base">เวลา</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {currentTransactions.map((transaction, index) => {
                        const isOutcome = transaction.type === "OUTCOME";
                        const isOverBudget = isOutcome && (transaction.deductMain ?? 0) > 0 && (transaction.deductPocket ?? 0) > 0;
                        const createDate = new Date(transaction.createdAt).getTime();
                        const canEdit = checkEdit(createDate);

                        return (
                            <div 
                                key={transaction.id || index} 
                                className={`grid grid-cols-6 items-center py-3.5 px-4 hover:bg-gray-50/80 transition-colors text-sm`}
                            >
                                <div className="flex justify-between items-center font-bold text-gray-800 text-center truncate px-1">
                                    <div>{transaction.pocketName || "กระเป๋าหลัก"}</div>
                                    <div className={`flex justify-around items-center gap-4 ${(isTransactionsPage && canEdit) ? 'flex':'hidden'}`}>
                                        <button onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setIsEditModalOpen(true);
                                                }} type="button" className="cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 transition-all rounded-full">
                                            <SquarePen className="size-3.5" />
                                        </button>
                                        <button type="button" className="cursor-pointer p-2 bg-red-200 hover:bg-red-400 transition-all rounded-full">
                                            <Trash className="size-3.5" />
                                        </button>
                                    </div>
                                    
                                </div>
                                <div className="flex justify-center">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        isOutcome ? 'bg-rose-50! text-rose-600!' : 'bg-emerald-50! text-emerald-600!'
                                    }`}>
                                        {transaction.type}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className={`font-bold tracking-tight ${isOutcome ? 'text-rose-600!' : 'text-emerald-600!'}`}>
                                        {isOutcome ? '-' : '+'}{transaction.amount?.toLocaleString()} THB
                                    </span>
                                </div>
                                <div className="text-center">
                                    {isOverBudget && (
                                        <span className="bg-amber-50! text-amber-600! border border-amber-200/60 text-xs px-2 py-0.5 rounded-full mt-1 font-semibold leading-tight shadow-2xs">
                                            เกินงบ! ดึงจากกระเป๋ารวม {transaction.deductMain?.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="text-gray-500 font-medium text-xs text-center">
                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                </div>

                                <div className="text-gray-500 font-medium text-xs text-center">
                                    {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} น.
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <EditTransactionModal 
                key={selectedTransaction?.id || "modal-closed"}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTransaction(null);
                }}
                transactionData={selectedTransaction}
            />

            {totalPages > 1 && (
                <div className="flex justify-between items-center px-2 pt-4">
                    <span className="text-xs text-gray-400 font-medium">
                        กำลังแสดง {startIndex + 1} - {Math.min(startIndex + itemsPerPage, transactionData.length)} จาก {transactionData.length} 
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-1 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition"
                        >
                            กลับ
                        </button>
                        
                        <span className="text-base font-bold text-gray-600 px-2">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-1 rounded-full cursor-pointer border border-gray-200 text-base font-medium text-white! bg-emerald-600! hover:bg-emerald-600/60! disabled:opacity-20 disabled:cursor-not-allowed transition"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}