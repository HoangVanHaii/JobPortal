import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectMySQL } from './src/config/database';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Job Portal API with AI is running... 🚀');
});
connectMySQL();
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
