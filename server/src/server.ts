import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { studentRouter } from './controllers/StudentController';
import { pingRouter } from './controllers/PingController';
import { userRouter } from './controllers/UserController';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));
app.use(cookieParser());

app.use('/api/students', studentRouter);
app.use('/api/ping', pingRouter);
app.use('/api/users', userRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
