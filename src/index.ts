import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware';
import { connectDB } from './config/db';
import log from './utils/logger';
import { corsMiddleware, corsErrorHandler} from './middleware/corsMiddleware';

// routes
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
connectDB();

const app = express();
const port = Number(
	process.env.NODE_ENV === 'development'
		? process.env.DEV_PORT || 3000
		: process.env.PROD_PORT || 5000
);

// middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

// error handling
app.use(corsErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
	log.info(`Server is running at http://localhost:${port}`);
});
