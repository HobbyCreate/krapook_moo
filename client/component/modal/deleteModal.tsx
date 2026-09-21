import React from 'react'
import { X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore';
import { useDeletePocket } from '@/customHooks/pocketHooks';


interface PocketData {
    id: string;
    name: string;
    limit: number;
    initialLimit: number;
    icon: string;
    isActive: boolean;
}

interface DeletePocketModalProps {
    isOpen: boolean;
    onClose: () => void;
    pocket: PocketData | null;
}

export default function DeletePocketModal({isOpen, onClose, pocket}: DeletePocketModalProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const { mutate: deletePocket, isPending } = useDeletePocket();

    const handleDeletePocketClick = () => {
        if (loading) {
            alert("กำลังโหลดข้อมูล กรุณาสักครู่...");
            return;
        }

        if (!user || !pocket) {
            alert("ไม่พบข้อมูลผู้ใช้หรือกระเป๋าที่ต้องการลบ");
            return;
        }

        const payloads = {
            id: pocket.id,
            userId: user.id,
        };

        console.log(payloads)

        deletePocket(payloads, {
            onSuccess: () => {
                alert("ลบกระเป๋าสำเร็จ!");
                onClose();
            },
            onError: (error) => {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการเพิ่มกระเป๋า");
            }
        });

    }

    return (
                <div 
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div 
                        className={`w-11/12 sm:w-9/12 md:w-7/12 lg:w-[500px] bg-white rounded-3xl p-6 sm:p-8 relative shadow-2xl transform transition-all duration-300 ease-out border border-gray-100 ${
                            isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                        }`}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className='absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer'
                            >
                                <X size={20} />
                            </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-gray-900'>ท่านต้องการลบกระเป๋าใบนี้หรือไม่</h2>
                            </div>
                        </div>

                        <div className='flex gap-3 mt-8'>
                        <button 
                            type='button' 
                            onClick={onClose}
                            className='flex-1 px-4 py-3 rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700! text-sm font-semibold transition-colors'
                        >
                            ยกเลิก
                        </button>
                        <button 
                            type='button'
                            disabled={isPending}
                            onClick={handleDeletePocketClick}
                            className='flex-1 px-4 py-3 rounded-xl cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white! text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50'
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
                                    'ตกลง'
                            }
                        </button>
                    </div>
                    </div>

            </div>
        )
}


