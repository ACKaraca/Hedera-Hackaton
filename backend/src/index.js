import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './config/validate-env.js';
import { logger } from './utils/logger.js';
import hcsRoutes from './routes/hcs-routes.js';
import tokenRoutes from './routes/token-routes.js';

// Hedera client'i import et (başlatma için)
import client from './config/hedera-client.js';

dotenv.config();

try {
  validateEnv();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`📨 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/hcs', hcsRoutes);
app.use('/api/token', tokenRoutes);

// Temel health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MeshFi Backend is running with Hedera integration',
    timestamp: new Date().toISOString()
  });
});

// API v1 status
app.get('/api/v1/status', (req, res) => {
  res.json({
    version: '1.0.0',
    network: process.env.HEDERA_NETWORK || 'testnet',
    account: process.env.MY_ACCOUNT_ID || 'Not configured',
    hcsTopicId: process.env.HCS_TOPIC_ID || 'Not created yet',
    meshTokenId: process.env.MESH_TOKEN_ID || 'Not created yet',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MeshFi DePIN Backend',
    version: '1.0.0',
    description: 'Hedera Hashgraph tabanlı Mesh Wireless Network platformu',
    endpoints: {
      health: '/health',
      status: '/api/v1/status',
      hcs: '/api/hcs',
      token: '/api/token'
    },
    documentation: 'https://github.com/ACKaraca/Hedera-Hackaton'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.success(`🚀 Backend sunucusu ${PORT} portunda çalışıyor`);
  logger.info(`📡 Hedera Ağı: ${process.env.HEDERA_NETWORK || 'testnet'}`);
  logger.info(`👤 Operator Account: ${process.env.MY_ACCOUNT_ID}`);
  console.log(`\n📚 API Documentation: http://localhost:${PORT}/`);
});
