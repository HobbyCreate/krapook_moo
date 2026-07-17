import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { checkBalanceService } from './balanceSevice.js'

export const getAllTransactionService = async (userId) => {
    return await prisma.transaction.findMany({
        where: { userId: userId },
        include: {
            pocket: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export const insertNewTransactionService = async (userId, amount, type, pocketId = null, note = "") => {
    return await prisma.$transaction(async (tx) => {

        // 1. กรณี INCOME
        if (type === 'INCOME') {
            await tx.userBalance.update({
                where: { userId },
                data: { amount: { increment: amount } }
            });
            return await tx.transaction.create({
                data: { userId, amount, type, note, createdAt: new Date() }
            });
        }

        // 2. กรณี OUTCOME
        if (type === 'OUTCOME') {
            // เช็คยอดเงินปัจจุบันก่อน
            const currentBalance = await tx.userBalance.findUnique({ where: { userId: userId } });

            if (!pocketId) {
                // กรณีไม่ระบุกระเป๋า: ตรวจสอบ Balance หลัก
                if (currentBalance.amount < amount) throw new Error("ยอดเงินในกระเป๋าหลักไม่พอ");

                await tx.userBalance.update({
                    where: { userId },
                    data: { amount: { decrement: amount } }
                });
            } else {
                // กรณีระบุกระเป๋า: ตรวจสอบกระเป๋า
                const pocket = await tx.pocket.findUnique({ where: { id: pocketId } });
                if (!pocket) throw new Error("ไม่พบกระเป๋านี้");

                let deductPocket = Math.min(amount, pocket.limit);
                let deductMain = amount - deductPocket;

                // ตรวจสอบรวมว่าเงินหลักพอสำหรับส่วนเกินไหม
                if (currentBalance.amount < deductMain) throw new Error("ยอดเงินรวมไม่พอทำรายการ");

                // หักจาก Pocket
                await tx.pocket.update({
                    where: { id: pocketId },
                    data: { limit: { decrement: deductPocket } }
                });

                // หักจาก Main Balance ถ้ามีส่วนเกิน
                if (deductMain > 0) {
                    await tx.userBalance.update({
                        where: { userId },
                        data: { amount: { decrement: deductMain } }
                    });
                }
            }

            return await tx.transaction.create({
                data: { userId, amount, pocketId, type, note, createdAt: new Date() }
            });
        }
    });
};