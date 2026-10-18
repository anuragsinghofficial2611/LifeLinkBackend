import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { setupSwagger } from './docs/swagger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

// Security HTTP headers (disable CSP for Swagger UI compatibility)
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.FRONTEND_URL ? [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'] : '*',
    credentials: true
  })
);

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for cookie-based authentication support
app.use(cookieParser());

// Request logging in non-test environments
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger / OpenAPI documentation
setupSwagger(app);

// Application routes
app.use(routes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
