import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler';
import userRouter from './src/router/user';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use(errorHandler);
connectDatabase();
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
