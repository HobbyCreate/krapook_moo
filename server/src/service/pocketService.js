import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// get all pockets sevice
export const getAllpocketsService = async (userId) => {
    return await prisma.pocket.findMany({
        where: { userId: userId }
    })
};

export const getEachPocketSevice = async (id) => {
    return await prisma.pocket.findUnique({
        where: { id: id }
    });
}

// add new pocket service
export const addPocketService = async (userId, name, limit, icon) => {
    // เช็คกระเป๋าที่ Active อยู่ (ถ้ามีชื่อซ้ำให้กันไว้ก่อน)
    const activePocket = await prisma.pocket.findFirst({
        where: { userId, name, isActive: true }
    });
    if (activePocket) throw new Error("คุณมีกระเป๋าชื่อนี้ที่กำลังใช้งานอยู่แล้ว");
    // เช็คกระเป๋าเก่า (isActive: false) -> เพื่อทำ Restore
    const oldPocket = await prisma.pocket.findFirst({
        where: { userId, name, isActive: false }
    });
    // ถ้าเจอของเก่า -> เรียก Restore
    if (oldPocket) {
        return await restorePocketService(userId, oldPocket.id, limit, icon);
    } 
    // ถ้าไม่เจอ -> สร้างใหม่
    return await prisma.$transaction(async (tx) => {
        // เช็คยอดเงินก่อนสร้าง
        const currentBalance = await tx.userBalance.findUnique({ where: { userId } });
        if (currentBalance.amount < parseFloat(limit)) {
            throw new Error("ยอดเงินในกระเป๋าหลักไม่พอ");
        }
        const newPocket = await tx.pocket.create({ 
            data: { userId, name, limit: parseFloat(limit), icon, isActive: true } 
        });
        await tx.userBalance.update({
            where: { userId },
            data: { amount: { decrement: parseFloat(limit) } }
        });
        return newPocket;
    });
};


export const restorePocketService = async (userId, pocketId, newLimit, icon) => {
    return await prisma.$transaction(async (tx) => {
        const currentBalance = await tx.userBalance.findUnique({ where: { userId } });
        if (currentBalance.amount < parseFloat(newLimit)) {
            throw new Error("ยอดเงินในกระเป๋าหลักไม่พอสำหรับกระเป๋านี้");
        }
        // อัปเดตกระเป๋าเดิม
        const updated = await tx.pocket.update({
            where: { id: pocketId }, 
            data: { 
                isActive: true, 
                limit: parseFloat(newLimit), 
                icon: icon 
            }
        });
        // หักเงินจาก Main Balance
        await tx.userBalance.update({
            where: { userId },
            data: { amount: { decrement: parseFloat(newLimit) } }
        });
        return updated;
    });
};

// edit pocket name service
export const editPocketNameService = async (id, name) => {
    await prisma.pocket.update({
        where: { id: id },
        data: { name: name },
    })
}

// edit pocket limit service
export const editPocketLimitService = async (id, newLimit, userId, oldLimit) => {
    const diff = parseFloat(newLimit) - parseFloat(oldLimit);

    return await prisma.$transaction([
        prisma.pocket.update({
            where: { id: id },
            data: { limit: parseFloat(newLimit) }
        }),
        prisma.userBalance.update({
            where: { userId: userId },
            data: { amount: { decrement: diff } }
        })
    ]);
};


// delete pocket sevice
export const deletePocketService = async (pocketId, userId) => {
    return await prisma.$transaction(async (tx) => {
        const pocket = await tx.pocket.findUnique({ where: { id: pocketId } });

        await tx.pocket.update({
            where: { id: pocketId },
            data: { isActive: false } 
        });

        await tx.userBalance.update({
            where: { userId },
            data: { amount: { increment: pocket.limit } }
        });
    });
}