import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { insertNewTransactionService, getAllTransactionService } from '../service/transactionService.js'
import { checkBalanceService } from '../service/balanceSevice.js'

// ดึง transactions ของกระเป๋านั้น และต้องเป็นเจ้าของกระเป๋า
export const getAllTransactions = async (req, res) => {
    const userId = req.user?.id || req.body.userId;  // รออัพเดท jwt
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
    const userId = req.user?.id || req.body.userId;
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

    // tansaction = {transactionId, amount, type, note, creatAt}

    // check ว่าเป็นเจ้าของ ใช้ pocket service หรือ middleware

    // check ว่า ต้องหักเงินจากกระเป๋า หรือ balance 

    // check ว่าเงินในกระเป๋าพอมั้ย พอ -> หักเงินกระเป๋า / ไม่พอ -> หักเงินกระเป๋า + หัก balance

}
