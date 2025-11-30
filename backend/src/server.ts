import dotenv from 'dotenv';
import http from 'http';
import { createApp } from './app';
import { initializeSocket } from './sockets';
import { initializeDefaultSettings } from './controllers/settings.controller';
// Temporarily disabled Redis worker
// import crisisAlertWorker from './workers/crisisAlert.worker';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create Express app
const app = createApp();

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Initialize default settings
initializeDefaultSettings().then(() => {
  console.log('✅ Default settings initialized');
}).catch((err) => {
  console.error('❌ Failed to initialize default settings:', err);
});

// Start server
httpServer.listen(PORT, () => {
  console.log('\n===========================================');
  console.log('🏥 AUI Wellbeing Hub Backend');
  console.log('===========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO initialized`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚠️  Crisis alert worker disabled (Redis not installed)`);
  console.log('===========================================\n');
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🔴 Shutting down gracefully...');
  
  // Close HTTP server
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
  });

  // Close Socket.IO
  io.close(() => {
    console.log('✅ Socket.IO closed');
  });

  // Close crisis alert worker
  // await crisisAlertWorker.close();
  console.log('✅ Crisis alert worker closed (was disabled)');

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export { app, httpServer, io };
