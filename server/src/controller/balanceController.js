import { checkBalanceService, addBalanceService } from '../service/balanceSevice.js'

// สมมติว่าใช้ userId เป็น 'user_default' ไปก่อนสำหรับการทดสอบ
// const userId = 'user_default'; 

export const getBalance = async (req, res) => {
    const { userId } = req.body;
    try {
        const balanceData = await checkBalanceService(userId);
        res.json(balanceData || { userId: userId, amount: 0 });
    } catch (error) {
        res.status(500).json({ error: "ดึงข้อมูลเงินไม่สำเร็จ" });
    }
};

export const addBalance = async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const updatedBalance = await addBalanceService(userId, amount);
        res.json({ message: "เพิ่มเงินสำเร็จ", newBalance: updatedBalance.amount });
    } catch (error) {
        res.status(500).json({ error: "อัปเดตยอดเงินไม่สำเร็จ" });
    }
};