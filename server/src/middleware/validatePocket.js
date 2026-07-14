import { PrismaClient } from '@prisma/client';
import { checkBalanceService } from '../service/balanceSevice.js';
const prisma = new PrismaClient();



export const validateAddPocket = async (req, res, next) => {
    const { userId, name, limit } = req.body;

    // check userId, pocket name, pocket limit
    if (!userId || !name || !limit || limit <= 0) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วนกรุณาลองใหม่อีกครั้ง" });
    }
    try {
        const balance = await checkBalanceService(userId);
        if (!balance) {
            return res.status(404).json({ error: "ไม่พบข้อมูลยอดเงินของผู้ใช้รายนี้" })
        }
        if (parseFloat(limit) > parseFloat(balance.amount)) {
            return res.status(400).json({ error: "ยอด limit สูงกว่าเงินที่มีในกระเป๋าหลัก" });
        }
        next();



    } catch (error) {
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล" });
    }
}

export const validateAvailablePocket = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pocket = await prisma.pocket.findUnique({
            where: { id: id }
        });

        if (!pocket) {
            return res.status(404).json({ error: "ไม่พบกระเป๋านี้" });
        }
        req.pocket = pocket;
        next();
    } catch (error) {
        res.status(500).json({ error: "ดึงข้อมูลไม่สำเร็จ" });
    }

};

