import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { validateEnv } from './config/validate-env.js';
import { logger } from './utils/logger.js';
import hcsRoutes from './routes/hcs-routes.js';
import tokenRoutes from './routes/token-routes.js';
import hotspotRoutes from './routes/hotspot-routes.js';
import { generateHotspots } from './utils/mock-data-generator.js';
import { createHotspot } from './services/hotspot-service.js';
import { getAllHotspots } from './services/hotspot-service.js';
import { setHotspots, startProofScheduler } from './services/proof-scheduler.js';
import { initWebSocket } from './services/websocket-service.js';
import { startHotspotUpdater } from './services/hotspot-updater.js';

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
app.use('/api/hotspots', hotspotRoutes);

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
      token: '/api/token',
      hotspots: '/api/hotspots'
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

// Express app'i http server ile wrap et
const server = http.createServer(app);

// WebSocket'i başlat
initWebSocket(server);

server.listen(PORT, () => {
  logger.success(`🚀 Backend sunucusu ${PORT} portunda çalışıyor`);
  logger.info(`📡 Hedera Ağı: ${process.env.HEDERA_NETWORK || 'testnet'}`);
  logger.info(`👤 Operator Account: ${process.env.MY_ACCOUNT_ID}`);
  console.log(`\n📚 API Documentation: http://localhost:${PORT}/`);

  // Server başladığında mock hotspot'lar oluştur
  const ownerAccountId = process.env.MY_ACCOUNT_ID || '0.0.0';
  const mockHotspots = generateHotspots(10, ownerAccountId);

  mockHotspots.forEach(hotspot => {
    createHotspot(hotspot);
  });

  logger.success(`${mockHotspots.length} simulated hotspots created`);

  // Proof scheduler'ı başlat
  setHotspots(getAllHotspots());
  startProofScheduler();

  // Hotspot istatistik güncelleyiciyi başlat
  startHotspotUpdater();
});
