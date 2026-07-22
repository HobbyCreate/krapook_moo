import { email } from "zod";
import { registerService, loginService, logoutService } from "../service/authenSevice";

export const register = async (req, res, next) => {
    const {email, firstName, lastName, password} = req.body;
    try {
        const userRegister = await registerService(email, firstName, lastName, password);
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
        res.status(500).json({error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"})
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