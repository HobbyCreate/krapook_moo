import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useEditNewTransaction } from "@/customHooks/transactionHooks"; // ใช้ hook แก้ไข
import { usePocketHook, Pockets } from "@/customHooks/pocketHooks"; // นำเข้า hook กระเป๋าเพื่อดึงรายชื่อ pocketData
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TransactionData {
    id: string;
    userId: string;
    pocketId: string | null;
    pocketName: string;
    amount: number;
    deductPocket: number;
    deductMain: number;
    type: string;
    note: string;
    createdAt: string;
}

interface EditTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    transactionData: TransactionData | null; 
}

export default function EditTransactionModal({ isOpen, onClose, transactionData }: EditTransactionProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    
    const { data: pocketData } = usePocketHook(); 
    const { mutate: editTransaction, isPending } = useEditNewTransaction();

    const [transactionAmount, setTransactionAmount] = useState<number | string>(transactionData?.amount ?? "");
    const [transactionType, setTransactionType] = useState(transactionData?.type ?? 'INCOME');
    const [transactionNote, setTransactionNote] = useState(transactionData?.note ?? '');
    const [selectedPocket, setSelectedPocket] = useState<string>(transactionData?.pocketId ?? '');

    const handleEditTransactionClick = () => {
        if (loading) {
            alert("กำลังโหลดข้อมูล กรุณาสักครู่...");
            return;
        }

        if (!user || !transactionData) {
            alert("ไม่พบข้อมูลผู้ใช้หรือรายการที่ต้องการแก้ไข");
            return;
        }

        const editPayload = {
            userId: user.id,
            transactionId: transactionData.id,
            newAmount: Number(transactionAmount) || 0,
            newPocketId: selectedPocket === "" ? null : selectedPocket,
            newNote: transactionNote,
        };

        editTransaction(editPayload, {
            onSuccess: () => {
                alert("แก้ไขธุรกรรมสำเร็จ!");
                onClose();
            },
            onError: (error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการแก้ไขธุรกรรม");
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
                    <h2 className="text-xl font-bold text-[var(--color-sage-dark)]">แก้ไขรายการ</h2>
                    <button 
                        onClick={onClose}
                        className='p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='flex flex-col gap-5'>
                    {/* ประเภทธุรกรรม */}
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
                            <input 
                                type="number" 
                                value={transactionAmount}
                                onChange={(e) => setTransactionAmount(e.target.value)}
                                placeholder="0.00"
                                className={`w-full bg-gray-50 border border-gray-200 focus:border-[#00A86B] focus:bg-white text-2xl font-bold py-3 px-4 rounded-2xl outline-none transition
                                    ${transactionType === 'OUTCOME' ? 'text-[#f04d4d]' : 'text-emerald-500'}`}
                            />
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
                            {pocketData
                                ?.filter((pocket) => pocket.isActive)
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
                
                {/* ปุ่มจัดการ */}
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
                        onClick={handleEditTransactionClick}
                        className='flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#00A86B] hover:bg-[#008f5a] transition cursor-pointer disabled:opacity-50 shadow-lg shadow-[#00A86B]/20'
                    >
                        {isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                    </button>
                </div>

            </div>
        </div>
    );
}