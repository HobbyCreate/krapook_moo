import { usePocketHook } from '@/customHooks/pocketHooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getPocketProgressColor } from '@/util/util'
import 'swiper/css';

export default function PocketCardSwiper() {
    const { data: pocketData, isLoading, isError } = usePocketHook();

    console.log("pocketData", pocketData)

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-80 min-h-30 mb-4">
                <p className="text-lg font-medium text-gray-400 mt-2">กำลังโหลด...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-80 min-h-30 mb-4">
                <p className="text-lg font-extrabold text-red-500 mt-2">
                    เกิดข้อผิดพลาดของระบบ
                </p>
            </div>
        );
    }

    if (!pocketData || pocketData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full min-h-30 mb-4 flex items-center justify-center">
                <p className="text-gray-400">ยังไม่มีกระเป๋าเงิน</p>
            </div>
        );
    }

    return (
            <div className='flex gap-6 mb-4 w-full'>
                <Swiper
                    className='w-full' 
                    slidesPerView={'auto'}
                    spaceBetween={20}
                    observer={true}    
                    observeParents={true}
                    navigation
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                {pocketData
                    ?.filter((pocket) => pocket.isActive === true) // กรองเฉพาะกระเป๋าที่ Active ออกมาแสดง
                    ?.map((pocket, index: number) => {
                        const { percentage, progressBg, progrestext } = getPocketProgressColor(pocket?.limit, pocket?.initialLimit);
                        
                        const initialLimit = pocket?.initialLimit ?? 0;
                        const currentLimit = pocket?.limit ?? 0;
                        const spentAmount = Math.max(0, initialLimit - currentLimit);

                        return (
                            <SwiperSlide 
                                key={pocket.id || index} 
                                className='py-3 px-1 flex flex-col w-full md:w-80!'
                            >
                                <div className='p-6 rounded-2xl shadow-sm border bg-[var(--color-bg-card)] border-gray-200/40 w-full h-full flex flex-col justify-between '>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                                    {pocket?.name}
                                                </h2>
                                                <span className="text-base text-slate-400 font-medium">งบประมาณรายเดือน</span>
                                            </div>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full h-2 my-3 overflow-hidden">
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

                                    <div className='flex justify-between items-end mt-3 pt-3 border-t border-slate-100'>
                                        <span className='text-base font-semibold tracking-wider uppercase text-slate-500'>
                                            ยอดคงเหลือ
                                        </span>
                                        <div className="text-right">
                                            <span className={`text-2xl md:text-3xl font-black tracking-tight ${progrestext}`}>
                                                {currentLimit.toLocaleString()}
                                            </span>
                                            <span className="text-base font-bold text-slate-400 ml-1">
                                                THB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
            </div>
    );
}