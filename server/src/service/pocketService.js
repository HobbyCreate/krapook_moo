import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// get all pockets sevice
export const getAllpocketsService = async (userId) => {
    return await prisma.pocket.findMany({
        where: { userId: userId }
    })
};

// add new pocket service
export const addPocketService = async (userId, name, limit, icon) => {
    // สร้างกระเป็น ละเอา limit ของกระเป๋าที่สร้างไปลบออกจาก balance
    const result = await prisma.$transaction([
            prisma.pocket.create({ data: { userId, name, limit: parseFloat(limit), icon } }),
            prisma.userBalance.update({
                where: { userId },
                data: { amount: { decrement: parseFloat(limit) } }
            })
        ]);
}

// edit pocket name service
export const editPocketNameService = async (id, name) => {
    await prisma.pocket.update({
        where: { id: id },
        data: { name: name },
    })
}

// edit pocket limit service

// transfer limit to another pocket sevice

// delete pocket sevice
export const deletePocketService = async (id, userId, limit) => {
    return await prisma.$transaction([
        prisma.pocket.delete({where: { id: id }}),
        prisma.userBalance.update({
                where: { userId },
                data: { amount: { increment: parseFloat(limit) } }
            })
    ]);
}