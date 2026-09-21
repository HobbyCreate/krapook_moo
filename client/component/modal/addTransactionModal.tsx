import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAddNewTransaction } from "@/customHooks/transactionHooks";
import { usePocketHook } from "@/customHooks/pocketHooks";
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface AddTransactionProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionProps) {
    const { data: pocketData } = usePocketHook();
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const { mutate: AddNewTransaction, isPending } = useAddNewTransaction();

    const [transactionAmount, setTransactionAmount] = useState<number | string>("");
    const [transactionType, setTransactionType] = useState('INCOME');
    const [transactionNote, setTransactionNote] = useState('');
    const [selectedPocket, setSelectedPocket] = useState('');

    const handleAddTransactionClick = () => {
        if (loading) {
            alert("กำลังโหลดข้อมูล กรุณาสักครู่...");
            return;
        }

        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
            return;
        }

        const addTransactionPayload = {
            userId: user?.id,
            pocketId: selectedPocket,
            amount: Number(transactionAmount) || 0,
            type: transactionType,
            note: transactionNote,
        };

        AddNewTransaction(addTransactionPayload, {
            onSuccess: () => {
                alert("เพิ่มธุรกรรมสำเร็จ!");
                onClose();
            },
            onError: (error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการเพิ่มธุรกรรม");
            }
        });
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
            <div className={`w-11/12 md:w-[480px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl relative transform transition-all duration-300 ${
                isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}>
                
                {/* Header & Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--color-sage-dark)]">บันทึกรายการใหม่</h2>
                    <button 
                        onClick={onClose}
                        className='p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='flex flex-col gap-5'>
                    {/* ประเภทธุรกรรม (เปลี่ยนสีเขียวตามสไตล์ภาพตัวอย่าง) */}
                    <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTransactionType('INCOME')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                transactionType === 'INCOME'
                                    ? 'bg-[#00A86B] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <ArrowDownRight size={18} />
                            เงินเข้า
                        </button>
                        <button
                            type="button"
                            onClick={() => setTransactionType('OUTCOME')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                transactionType === 'OUTCOME'
                                    ? 'bg-[#f04d4d] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <ArrowUpRight size={18} />
                            เงินออก
                        </button>
                    </div>

                    {/* จำนวนเงิน */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>จำนวนเงิน (บาท)</label>
                        <div className="relative">
                            {
                                    <input 
                                        type="number" 
                                        value={transactionAmount}
                                        onChange={(e) => setTransactionAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={`w-full bg-gray-50 border border-gray-200 focus:border-[#00A86B] focus:bg-white text-2xl font-bold py-3 px-4 rounded-2xl outline-none transition
                                            ${transactionType === 'OUTCOME' ? 'text-[#f04d4d]' : 'text-emerald-500'}`}
                                    />
                            }
                        </div>
                    </div>

                    {/* เลือกกระเป๋า */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>กระเป๋าเงิน</label>
                        <select
                            name="pocketId"
                            id="pocketId"
                            value={selectedPocket}
                            onChange={(e) => setSelectedPocket(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#00A86B] focus:bg-white text-gray-800 py-3 px-4 rounded-2xl outline-none transition cursor-pointer text-sm"
                        >
                            <option value="">กระเป๋ารวมทั้งหมด</option>
                            {transactionType === "OUTCOME" && pocketData
                                ?.filter((pocket) => (pocket.limit ?? 0) > 0 && (pocket.isActive))
                                ?.map((pocket) => (
                                    <option value={pocket.id} key={pocket.id}>
                                        {pocket.name} (คงเหลือ: {pocket.limit})
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* คำอธิบายเพิ่มเติม */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>บันทึกช่วยจำ (ถ้ามี)</label>
                        <input 
                            type="text" 
                            value={transactionNote}
                            onChange={(e) => setTransactionNote(e.target.value)}
                            placeholder="เช่น ค่าข้าว, เงินเดือน"
                            className='w-full bg-gray-50 border border-gray-200 focus:border-[#00A86B] focus:bg-white text-sm py-3 px-4 rounded-2xl outline-none transition'
                        />
                    </div>
                </div>
                
                {/* ปุ่มจัดการ (Action Buttons ใช้สีเขียวมรกตสไตล์เดียวกับปุ่มสร้างกระเป๋า) */}
                <div className='flex items-center gap-3 mt-8'>
                    <button 
                        type='button' 
                        onClick={onClose}
                        className='flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer'
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type='button'
                        disabled={isPending}
                        onClick={handleAddTransactionClick}
                        className='flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#00A86B] hover:bg-[#008f5a] transition cursor-pointer disabled:opacity-50 shadow-lg shadow-[#00A86B]/20'
                    >
                        {
                            isPending ? 
                                <div className="flex items-center justify-center" role="status">
                                    <svg aria-hidden="true" className="w-4 h-4 text-neutral-tertiary animate-spin fill-emerald-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                : 
                                'บันทึกรายการ'
                        }
                    </button>
                </div>

            </div>
        </div>
    );
}