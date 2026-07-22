import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { insertNewTransactionService, getAllTransactionService, editTransactionService, deleteTransactionService } from '../service/transactionService.js'
import { checkBalanceService } from '../service/balanceSevice.js'

// ดึง transactions ของกระเป๋านั้น และต้องเป็นเจ้าของกระเป๋า
export const getAllTransactions = async (req, res) => {
    const { userId } = req.userId;
    try {
        const user = await checkBalanceService(userId)
        if(!user){
            return res.status(404).json({ error: "ไม่พบ user นี้" })
        }
        const transactions = await getAllTransactionService(userId);

        res.status(200).json({ data: transactions });
    } catch (error) {
        return res.status(500).json({ error: "ระบบผิดพลาด กรุณาลองใหม่อีกครั้ง" })
    }
}

export const insertNewTransaction = async (req, res) => {
    const { userId } = req.userId;
    const { amount, type, pocketId, note } = req.body; 

    try {
        const newTransaction = await insertNewTransactionService(userId, parseFloat(amount), type, pocketId, note);
        
        res.status(200).json({ 
            message: "บันทึกรายการสำเร็จ", 
            transaction: newTransaction 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "ระบบผิดพลาด" });
    }
};

export const editTransaction = async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.userId;
    const { note, pocketId, amount } = req.body; 
    try {
        const result = await editTransactionService(userId, id, note, pocketId, amount);
        res.json({ message: "แก้ไขรายการสำเร็จ", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.userId; 
    try {
        const result = await deleteTransactionService(userId, id);
        res.json({ message: "ลบรายการสำเร็จ", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
