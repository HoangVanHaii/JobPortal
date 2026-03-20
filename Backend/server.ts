import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import companyRouter from './src/router/company'
import { connectDatabase } from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler';
import userRouter from './src/router/user';
import adminRouter from './src/router/admin/user';
import skillRouter from './src/router/skill';
import candidateRouter from './src/router/candidate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/company", companyRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Job Portal API with AI is running... 🚀');
});
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/skills', skillRouter); 
app.use('/api/candidates', candidateRouter);
app.use(errorHandler);
connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
