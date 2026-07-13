export const validateBalance = (req, res, next) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "ยอดเงินต้องมากกว่า 0" });
    }
        next(); // ผ่านไปหา Controller
};