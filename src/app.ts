import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';
import swaggerSpec from './docs/swagger';

let swaggerUi: any;
try {
	swaggerUi = require('swagger-ui-express');
} catch (e) {
	swaggerUi = undefined;
}

dotenv.config({ quiet: true });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', router);

if (swaggerUi) {
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
	console.log('Swagger UI não instalado. Rode: npm install swagger-ui-express swagger-jsdoc');
}

app.use(errorHandler);

export default app;
