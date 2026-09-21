import { email } from "zod";
import { registerService, loginService, logoutService, getMeService } from "../service/authenSevice.js";
import { insertNewTransactionService } from "../service/transactionService.js";

export const register = async (req, res, next) => {
    const { email, firstname, lastname, password } = req.body;
    try {
        const userRegister = await registerService(email, firstname, lastname, password);
        res.status(201).json({message: "ลงทะเบียนสำเร็จ"})
    } catch(error) {
        res.status(500).json({error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"})
    }
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const { accessToken, user } = await loginService(email, password);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,  
            maxAge: 24 * 60 * 60 * 1000,  
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ 
            message: "เข้าสู่ระบบสำเร็จ", 
            accessToken, 
            user 
        });

    } catch(error) {
        res.status(400).json({ error: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
    }
}

export const logout = async (req, res, next) => {
    try {

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({ 
            message: "ออกจากระบบสำเร็จ" 
        });

    } catch (error) {
        res.status(500).json({error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"})
    }
}

export const getMe = async (req, res) => {
    try {
        const { userId } = req.userId; 
        
        const user = await getMeService(userId)

        if (!user) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้งาน" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
};