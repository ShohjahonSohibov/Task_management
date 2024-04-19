import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import validateToken from '../middleware/validate-token';

import connectDB from '../config/db';
import authRoutes from "../routes/authRoutes"
import taskRoutes from "../routes/taskRoutes" 

connectDB()
const app = express();

app.set('trust proxy', 1);

app.use(express.json({ limit: '4mb' }));
app.use(helmet());
app.use(cors());

//root route
app.get('/', (req, res) => {
  res.send('App works properly!');
});

// Route definitions
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/task/', validateToken, taskRoutes);

// Error handler middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
