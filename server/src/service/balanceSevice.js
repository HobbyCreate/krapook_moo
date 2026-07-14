import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const checkBalanceService = async (userId) => {
    return await prisma.userBalance.findUnique({
        where: { userId: userId }
    })
}

export const addBalanceService = async (userId, amount) => {
    return await prisma.userBalance.upsert({
        where: { userId: userId },
        update: { amount: { increment: parseFloat(amount) } },
        create: { userId: userId, amount: parseFloat(amount) }
    });
}