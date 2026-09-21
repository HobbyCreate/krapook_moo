import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import balanceRoutes from './src/routes/balanceRoutes.js'
import pocketRouter from './src/routes/pocketRoutes.js';
import transactionRouter from './src/routes/transactionRoutes.js'
import authenticationRouter from './src/routes/authenRoutes.js';

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
    'http://localhost:3000', 
    process.env.FRONTEND_URL 
].filter(Boolean); 

app.use(cors({
    origin: 
    function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS')); 
        }
    },
    credentials: true
}));

app.use(express.json()); 
app.use(cookieParser());

app.use('/api/balance', balanceRoutes);
app.use('/api/pocket', pocketRouter)
app.use('/api/transactions', transactionRouter);
app.use('/api/auth', authenticationRouter)

app.get('/', (req, res) => {
    res.json({ message: "กระปุกหมู API พร้อมใช้งานแล้วครับ!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});