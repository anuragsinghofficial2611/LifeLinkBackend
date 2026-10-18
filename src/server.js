import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { seedInitialAdmin } from './services/auth.service.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Seed initial admin user if needed
    await seedInitialAdmin();

    // 3. Start Express HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`Lifelink Backend server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`Swagger UI Documentation available at: http://localhost:${env.PORT}/docs`);
      logger.info(`Health check available at: http://localhost:${env.PORT}/health`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });

      // Force exit after 10s if graceful shutdown hangs
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start Lifelink server:', error);
    process.exit(1);
  }
};

startServer();
