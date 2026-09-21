import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const checkBalanceService = async (userId) => {
    return await prisma.userBalance.findUnique({
        where: { userId: userId }
    })
}
