import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import balanceRoutes from './src/routes/balanceRoutes.js'
import pocketRouter from './src/routes/pocketRoutes.js';
import transactionRouter from './src/routes/transactionRoutes.js'
import authenticationRouter from './src/routes/authenRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

app.use('/api/balance', balanceRoutes);
app.use('/api/pocket', pocketRouter)
app.use('/api/transactions', transactionRouter);
app.use('/api/authen', authenticationRouter)

app.get('/', (req, res) => {
    res.json({ message: "กระปุกหมู API พร้อมใช้งานแล้วครับ!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});