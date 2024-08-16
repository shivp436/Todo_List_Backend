import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware';
import colors from 'colors';
import { connectDB } from './config/db';

dotenv.config();
connectDB();

const app = express();
const port = process.env.NODE_ENV === 'development' ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/tasks', require('./routes/taskRoutes'));

app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send(`Home page. Server running at http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
