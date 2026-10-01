import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { projectRoutes } from './routes/projectRoutes.js';
import { taskRoutes } from './routes/taskRoutes.js';

const app = express();
const localDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin ||
        env.clientOrigins.includes(origin) ||
        (env.nodeEnv !== 'production' && localDevOrigin.test(origin));

      if (allowed) {
        callback(null, true);
        return;
      }
      const error = new Error('Origin is not allowed');
      error.statusCode = 403;
      callback(error);
    },
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export { app };
