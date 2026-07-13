import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// สมมติว่าใช้ userId เป็น 'user_default' ไปก่อนสำหรับการทดสอบ
// const USER_ID = 'user_default'; 

export const getAllPocket = async (req, res) => {
    const { userId } = req.body
    try {
        const allPocket = await prisma.pocket.findMany({
            where: { userId : userId }
        })
        res.status(200).json(allPocket);
    } catch (error) {
        res.status(500).json({ error: "ดึงข้อมูลกระเป๋าไม่สำเร็จ" });
    }
}

export const addPocket = async (req, res) => {
    const { userId, name , limit , icon} = req.body
    try {
        const pocket = await prisma.pocket.create({
            data: {
                userId : userId,
                name: name,
                limit: parseFloat(limit),
                icon: icon
            }
        });
        res.status(201).json({ message : `สร้างกระเป๋า ${name} เรียบร้อยแล้ว`, pocket})
    } catch (error) {
        res.status(500).json({ error: "เพิ่มกระเป๋าไม่สำเร็จ" });
    }
};

export const deletePocket = async (req, res) => {
    const { id } = req.params;
    try {
        const pocket = await prisma.pocket.delete({ 
            where: { id: id }
        });
        res.status(200).json({ message : `ลบกระเป๋าเรียบร้อยแล้ว`, pocket})
    } catch (error) {
        res.status(500).json({ error: "ลบกระเป๋าไม่สำเร็จ" });
    }
};