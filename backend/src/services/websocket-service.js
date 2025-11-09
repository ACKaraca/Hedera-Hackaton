import { WebSocketServer } from 'ws';
import { logger } from '../utils/logger.js';

let wss = null;

/**
 * WebSocket sunucusunu başlat
 */
export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  // Heartbeat interval (her 30 saniye)
  const heartbeatInterval = setInterval(() => {
    if (!wss) return;
    
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    logger.info('🔌 WebSocket client connected');

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      logger.info('📩 Received message:', message.toString());
    });

    ws.on('close', () => {
      logger.info('🔌 WebSocket client disconnected');
    });

    // Bağlantı kurulduğunda hoş geldin mesajı
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'MeshFi WebSocket connected'
    }));
  });

  logger.success('WebSocket server initialized');
}

/**
 * Tüm bağlı istemcilere mesaj gönder
 */
export function broadcastToClients(data) {
  if (!wss) return;

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });
}

/**
 * Hotspot güncellemelerini yayınla
 */
export function broadcastHotspotUpdate(hotspot) {
  broadcastToClients({
    type: 'HOTSPOT_UPDATE',
    hotspot: hotspot
  });
}

