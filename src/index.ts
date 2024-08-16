import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
