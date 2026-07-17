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

export const getEachTransactionService = async (transactionId) => {
    return await prisma.transaction.findUnique({
        where: { id: transactionId },
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
            if (amount !== undefined && amount < 0) {
                throw new Error("จำนวนเงินต้องไม่เป็นค่าติดลบ");
            }
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
                    data: {
                        limit: { decrement: deductPocket },
                    }
                });

                // หักจาก Main Balance ถ้ามีส่วนเกิน
                if (deductMain > 0) {
                    await tx.userBalance.update({
                        where: { userId },
                        data: {
                            amount: { decrement: deductMain }
                        }
                    });
                }
            }
            let pocketName = null;
            if (pocketId) {
                const pocket = await tx.pocket.findUnique({ where: { id: pocketId } });
                pocketName = pocket ? pocket.name : "Unknown Pocket";
            }
            return await tx.transaction.create({
                data: { userId, amount, pocketId, pocketName, type, note, deductMain, deductPocket, createdAt: new Date() }
            });
        }
    });
};

export const editTransactionService = async (userId, transactionId, newNote, newPocketId, newAmount) => {
    const transaction = await getEachTransactionService(transactionId);
    if (!transaction) throw new Error("ไม่พบรายการ");

    // --- ตรวจสอบเงื่อนไขห้ามเปลี่ยนสถานะ (In-Pocket vs Outside-Pocket) ---
    if (newPocketId !== undefined) {
        const hasOldPocket = transaction.pocketId !== null;
        const hasNewPocket = newPocketId !== null;

        // ถ้าของเดิมมีกระเป๋า แต่ของใหม่ไม่มีกระเป๋า (หรือกลับกัน) -> ไม่อนุญาต
        if (hasOldPocket !== hasNewPocket) {
            throw new Error("ไม่สามารถเปลี่ยนจากการหักในกระเป๋าเป็นนอกกระเป๋าได้ โปรดลบแล้วสร้างรายการใหม่");
        }
    }

    return await prisma.$transaction(async (tx) => {
        const amount = newAmount !== undefined ? newAmount : transaction.amount;
        const pocketId = newPocketId !== undefined ? newPocketId : transaction.pocketId;

        if (newAmount !== undefined && newAmount < 0) {
            throw new Error("จำนวนเงินต้องไม่เป็นค่าติดลบ");
        }

        // ถ้ามีการแก้จำนวนเงิน หรือ แก้เปลี่ยนกระเป๋า (1 ไป 2)
        if (newAmount !== undefined || newPocketId !== undefined) {
            await revertMoney(tx, userId, transaction);

            let deductPocket = 0;
            let deductMain = amount;

            // ถ้ามีการใช้งานกระเป๋า ให้คำนวณหักจากกระเป๋าใหม่
            if (pocketId) {
                const pocket = await tx.pocket.findUnique({ where: { id: pocketId } });
                if (!pocket) throw new Error("ไม่พบกระเป๋านี้");

                deductPocket = Math.min(amount, pocket.limit);
                deductMain = amount - deductPocket;

                const currentBalance = await tx.userBalance.findUnique({ where: { userId } });
                if (currentBalance.amount < deductMain) throw new Error("ยอดเงินรวมไม่พอทำรายการ");

                await tx.pocket.update({
                    where: { id: pocketId },
                    data: { limit: { decrement: deductPocket } }
                });
            } else {
                // กรณีไม่มีกระเป๋า (หักเงินหลักทั้งหมด)
                const currentBalance = await tx.userBalance.findUnique({ where: { userId } });
                if (currentBalance.amount < amount) throw new Error("ยอดเงินไม่พอทำรายการ");
            }

            // หักเงินจาก Main Balance (ถ้ามีการใช้กระเป๋าแล้วมีส่วนเกิน หรือ กรณีหักข้างนอกปกติ)
            if (deductMain > 0) {
                await tx.userBalance.update({
                    where: { userId },
                    data: { amount: { decrement: deductMain } }
                });
            }

            // Update Transaction
            await tx.transaction.update({
                where: { id: transactionId },
                data: { amount, deductMain, deductPocket, pocketId, note: newNote ?? transaction.note }
            });
        }
        else if (newNote !== undefined && newNote !== transaction.note) {
            await tx.transaction.update({
                where: { id: transactionId },
                data: { note: newNote }
            });
        }
    });
};

export const deleteTransactionService = async (userId, transactionId) => {
    const transaction = await getEachTransactionService(transactionId);
    if (!transaction) throw new Error("ไม่พบรายการที่ต้องการลบ");

    return await prisma.$transaction(async (tx) => {
        await revertMoney(tx, userId, transaction);

        return await tx.transaction.delete({
            where: { id: transactionId, userId: userId }
        });
    });
};

// Helper 
const revertMoney = async (tx, userId, transaction) => {
    const deductPocket = +transaction.deductPocket || 0;
    const deductMain = +transaction.deductMain || 0;

    if (transaction.deductPocket > 0) {
        await tx.pocket.update({
            where: { id: transaction.pocketId },
            data: { limit: { increment: transaction.deductPocket } }
        });
    }
    if (transaction.deductMain > 0) {
        await tx.userBalance.update({
            where: { userId },
            data: { amount: { increment: transaction.deductMain } }
        });
    }
};

