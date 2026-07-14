import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// สมมติว่าใช้ userId เป็น 'user_default' ไปก่อนสำหรับการทดสอบ
// const userId = 'user_default'; 

export const getBalance = async (req, res) => {
    const { userId } = req.body;
    try {
        const balanceData = await prisma.userBalance.findUnique({
            where: { userId: userId }
        });
        res.json(balanceData || { userId: userId, amount: 0 });
    } catch (error) {
        res.status(500).json({ error: "ดึงข้อมูลเงินไม่สำเร็จ" });
    }
};

export const addBalance = async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const updatedBalance = await prisma.userBalance.upsert({
            where: { userId: userId },
            update: { amount: { increment: parseFloat(amount) } },
            create: { userId: userId, amount: parseFloat(amount) }
        });
        res.json({ message: "เพิ่มเงินสำเร็จ", newBalance: updatedBalance.amount });
    } catch (error) {
        res.status(500).json({ error: "อัปเดตยอดเงินไม่สำเร็จ" });
    }
};