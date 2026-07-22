import { getAllpocketsService, addPocketService, editPocketNameService, editPocketLimitService, deletePocketService } from '../service/pocketService.js'
import { checkBalanceService } from '../service/balanceSevice.js'

export const getAllPocket = async (req, res) => {
    const { userId } = req.userId;
    try {
        const allPocket = await getAllpocketsService(userId);
        res.status(200).json(allPocket);
    } catch (error) {
        res.status(500).json({ error: "ดึงข้อมูลกระเป๋าไม่สำเร็จ" });
    }
}

export const addPocket = async (req, res) => {
    const { userId } = req.userId;
    const { name, limit, icon } = req.body;
    try {
        const pocket = await addPocketService(userId, name, limit, icon);
        res.status(201).json({ 
            message: `สร้างกระเป๋า ${name} เรียบร้อยแล้ว`, 
            pocket 
        });
    } catch (error) {
        res.status(400).json({ error: error.message || "เพิ่มกระเป๋าไม่สำเร็จ" });
    }
};

export const changePocketName = async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
    try {
        const pocket = await editPocketNameService(id, newName);
        res.status(200).json({ message: "เปลี่ยนชื่อกระเป๋าสำเร็จ", pocket });
    } catch(error) {
        res.status(500).json({ error: "เปลี่ยนชื่อกระเป๋าไม่สำเร็จ" });
    }
}

export const changePocketLimit = async (req, res) => {
    const { id } = req.params;
    const { newLimit } = req.body;
    const { userId, limit: oldLimit } = req.pocket || {};

    if (!userId || oldLimit === undefined) {
        return res.status(400).json({ error: "ไม่พบข้อมูลกระเป๋า หรือยังไม่ได้ตรวจสอบสิทธิ์กระเป๋า" });
    }
    
    const userBalance = await checkBalanceService(userId);
    if (!userBalance) {
        return res.status(404).json({ error: "ไม่พบข้อมูลยอดเงินของผู้ใช้" });
    }
    const diff = parseFloat(newLimit) - parseFloat(oldLimit);

    if (diff > userBalance.amount) {
        return res.status(400).json({ error: "ยอดเงินในกระเป๋าหลักไม่พอสำหรับการเพิ่ม Limit" });
    }

    try {
        const result = await editPocketLimitService(id, newLimit, userId, oldLimit);
        res.status(200).json({ message: "เปลี่ยน limit กระเป๋าสำเร็จ", pocket: result[0] });
    } catch(error) {
        res.status(500).json({ error: "เปลี่ยน limit กระเป๋าไม่สำเร็จ" });
    }
}

export const deletePocket = async (req, res) => {
    const { id } = req.params;
    const { userId, limit } = req.pocket;
    try {
        const pocket = await deletePocketService(id, userId , limit);
        res.status(200).json({ message : `ลบกระเป๋าเรียบร้อยแล้ว`, pocket})
    } catch (error) {
        res.status(500).json({ error: "ลบกระเป๋าไม่สำเร็จ" });
    }
};