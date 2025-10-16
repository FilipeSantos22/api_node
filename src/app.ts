import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config({ quiet: true });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', router);

app.use(errorHandler);

export default app;
