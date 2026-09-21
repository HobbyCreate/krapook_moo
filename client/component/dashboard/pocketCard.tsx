import { usePocketHook, Pockets } from '@/customHooks/pocketHooks';
import { useState } from 'react';
import { getPocketProgressColor } from '@/util/util';
import 'swiper/css';
import EditPocketModal from '../modal/editPocketModal';
import DeletePocketModal from '../modal/deleteModal';

import { PencilLine, Trash2, RotateCcw } from 'lucide-react';

interface PocketCardProps {
    onOpenAddPocket: () => void;
}

export default function PocketCard({ onOpenAddPocket }: PocketCardProps) {
    const { data: pocketData, isLoading, isError } = usePocketHook();
    
    const [selectedPocket, setSelectedPocket] = useState<Pockets | null>(null);
    const [editpocketmodal, setEditpocketmodal] = useState(false);
    const [deletepocketmodal, setDeletepocketmodal] = useState(false);

    const handleOpenEdit = (pocket: Pockets) => {
        setSelectedPocket(pocket);
        setEditpocketmodal(true);
    };

    const handleOpenDelete = (pocket: Pockets) => {
        setSelectedPocket(pocket);
        setDeletepocketmodal(true);
    }

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

    return (
        <div className="w-full flex flex-wrap gap-4 items-stretch">
            {pocketData?.filter((pocket) => pocket.isActive === true)?.map((pocket, index: number) => {
                const { percentage, progressBg, progrestext } = getPocketProgressColor(pocket?.limit, pocket?.initialLimit);
                
                const initialLimit = pocket?.initialLimit ?? 0;
                const currentLimit = pocket?.limit ?? 0;
                const spentAmount = Math.max(0, initialLimit - currentLimit);

                let pocketStatus = 'opacity-100';
                    if(pocket.isActive === false) {
                        pocketStatus = 'opacity-30';
                    }

                return (
                    <div key={pocket.id || index} className='relative py-3 px-1 flex flex-col w-full md:w-80 pocket-card'>
                        <div className='flex gap-2'>
                            {
                                pocket.isActive === true ?
                                    <div className='absolute py-3 px-1 top-4 right-4 flex gap-2 z-50'>
                                        <button 
                                            type="button"
                                            onClick={() => handleOpenEdit(pocket)}
                                            className='w-9 h-9 flex items-center justify-center rounded-full border border-emerald-500 text-emerald-500! hover:bg-emerald-50 active:scale-95 transition-all duration-200 cursor-pointer font-semibold shadow-xs hover:rotate-12'
                                        >
                                            <PencilLine size={16} className="" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleOpenDelete(pocket)}
                                            className='w-9 h-9 flex items-center justify-center rounded-full border border-emerald-500 text-emerald-500! hover:bg-emerald-50 active:scale-95 transition-all duration-200 cursor-pointer font-semibold shadow-xs hover:rotate-12'
                                        >
                                            <Trash2 size={16} className="" />
                                        </button>
                                    </div>
                                    :
                                    <div className='absolute py-3 px-1 top-4 right-4 flex gap-2 z-50'>
                                        <button 
                                            type="button"
                                            onClick={() => handleOpenDelete(pocket)}
                                            className='w-9 h-9 flex items-center justify-center rounded-full border border-emerald-500 text-emerald-500! hover:bg-emerald-50 active:scale-95 transition-all duration-200 cursor-pointer font-semibold shadow-xs hover:rotate-12 opacity-150!'
                                        >
                                            <RotateCcw size={16} className="opacity-100!" />
                                        </button>
                                    </div>
                                    }
                            </div>
                        <div className={`relative p-6 rounded-2xl shadow-sm border ${pocketStatus} z-10 bg-[var(--color-bg-card)] border-gray-200/40 w-full h-full flex flex-col justify-between`}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                                {pocket?.name}
                                            </h2>
                                            <span className="text-base text-slate-400 font-medium">งบประมาณรายเดือน</span>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div className="w-full bg-gray-200/70 rounded-full h-2 my-3 overflow-hidden">
                                    <div 
                                        className={`h-2 rounded-full ${progressBg} transition-all duration-500`} 
                                        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-base text-slate-500 font-medium mb-1">
                                    <div>
                                        <p>ใช้ไป: <span className='text-red-500!'>{spentAmount.toLocaleString()}</span> THB</p>
                                        <p>จาก: <span className='text-[var(--color-htext-card)]!'>{initialLimit.toLocaleString()}</span> THB</p>
                                    </div>
                                    <p className={`text-3xl font-bold ${progrestext}`}>{percentage.toFixed(0)}%</p>
                                </div>
                            </div>

                            <div className='flex justify-between items-end mt-3 pt-3 border-t border-current/10'>
                                <span className='text-base font-semibold tracking-wider uppercase text-slate-500'>
                                    ยอดคงเหลือ
                                </span>
                                <div className="text-right">
                                    <span className={`text-2xl md:text-3xl font-black tracking-tight ${progrestext}`}>
                                        {currentLimit.toLocaleString()}
                                    </span>
                                    <span className='text-base font-bold ml-1 opacity-90'>
                                        THB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="py-3 px-1 flex flex-col w-full md:w-80">
                <button
                    onClick={onOpenAddPocket} 
                    type='button'
                    className='p-6 rounded-xl shadow-md border-2 border-dashed border-gray-300 w-full h-full flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer text-emerald-500! font-semibold min-h-[160px]'
                >
                    + เพิ่มกระเป๋าเงิน
                </button>
            </div>

            {
                <EditPocketModal 
                    isOpen={editpocketmodal} 
                    onClose={() => {
                        setEditpocketmodal(false);
                        setSelectedPocket(null);
                    }}
                    pocket={selectedPocket}
                />
            }

            {
                <DeletePocketModal
                    isOpen={deletepocketmodal} 
                    onClose={() => {
                        setDeletepocketmodal(false);
                        setSelectedPocket(null);
                    }}
                    pocket={selectedPocket}
                />
            }
        </div>
    );
}