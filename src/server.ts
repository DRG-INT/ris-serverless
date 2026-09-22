import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './core/config.js';
import { Database, prisma } from './core/database.js';
import { router } from './core/router.js';
import { errorHandler } from './core/errors.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.APP_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/', limiter);

app.get('/health', (_req, res) => res.json({ status: 'ok', name: config.APP_NAME }));
app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});

app.use('/api/v1', router);

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`${config.APP_NAME} listening on :${config.PORT}`);
});

export default server;
