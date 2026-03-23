import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import companyRouter from './src/router/company'
import { connectDatabase } from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler';
import userRouter from './src/router/user';
import adminRouter from './src/router/admin/user';
import employerRouter from './src/router/employer';
import jobRouter from './src/router/job';
import http from 'http'
import { Server } from 'socket.io';
import { setupSocket } from './src/socket';
import messageRouter from './src/router/message'
import savedJobRouter from './src/router/savedJob'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods:["GET", "POST"]
    }
})
setupSocket(io);
app.use(cors());
app.use(express.json());

// app.use("/api/employer/company", companyRouter);
app.use("/api/employers", employerRouter);
app.use("/api/jobs", jobRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/messages', messageRouter)
app.use('/api/saved-job');
app.use(errorHandler);
connectDatabase();

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
