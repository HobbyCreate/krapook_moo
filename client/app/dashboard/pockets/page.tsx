"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/component/header";
import { Sidebar } from "@/component/sidebar";
import MobileNavBar from '@/component/mobilenavbar'
import PocketCard from "@/component/dashboard/pocketCard";
import AddPocketModal from "@/component/modal/addPocketModal";

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAddModalOpen =
        searchParams.get("modal") === "add";

    const openAddPocketModal = () => {
        router.push("/dashboard/pockets?modal=add");
    };

    const closeAddPocketModal = () => {
        router.push("/dashboard/pockets");
    };

    return (
        <div className="flex flex-col flex-1 items-center pb-10 md:pb-0">
            <Header />
            <div className='hidden md:block'>
                <Sidebar />
            </div>
            <div className='block md:hidden'>
                <MobileNavBar />
            </div>
            <div className="flex w-full">
                <div className="bg-[var(--color-bg-main)] w-full min-h-screen">
                    <div className="w-full p-6 md:p-10">
                        <div className="balance-card mb-10">
                            <h2 className="text-3xl font-bold uppercase mb-8">
                                Pockets
                            </h2>
                            <PocketCard onOpenAddPocket={openAddPocketModal}/>
                        </div>
                        <AddPocketModal 
                            isOpen={isAddModalOpen} 
                            onClose={closeAddPocketModal} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}