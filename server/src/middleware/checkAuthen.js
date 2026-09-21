import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const checkAuthen = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if(!token) {
            return res.status(401).json({ error:"กรุณาเข้าสู่ระบบอีกครั้ง" })
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = {
            userId: decoded.userId,
        };

        next();

    } catch(error) {
        return res.status(403).json({ error: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }
}