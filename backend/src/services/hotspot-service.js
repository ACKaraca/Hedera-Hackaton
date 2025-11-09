import { Hotspot } from '../models/hotspot-model.js';
import { validateHotspot } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

// Basit in-memory store (production'da PostgreSQL/MongoDB kullan)
let hotspotsDB = [];

/**
 * Tüm hotspot'ları getir
 */
export function getAllHotspots() {
  return hotspotsDB;
}

/**
 * ID ile hotspot bul
 */
export function getHotspotById(id) {
  return hotspotsDB.find(h => h.id === id);
}

/**
 * Yeni hotspot ekle
 */
export function createHotspot(hotspotData) {
  const hotspot = new Hotspot(hotspotData);
  validateHotspot(hotspot);

  hotspotsDB.push(hotspot);
  logger.success('Hotspot created', { id: hotspot.id });

  return hotspot;
}

/**
 * Hotspot güncelle
 */
export function updateHotspot(id, updates) {
  const index = hotspotsDB.findIndex(h => h.id === id);

  if (index === -1) {
    throw new Error('Hotspot not found');
  }

  hotspotsDB[index] = { ...hotspotsDB[index], ...updates };
  logger.info('Hotspot updated', { id });

  return hotspotsDB[index];
}

/**
 * Hotspot sil
 */
export function deleteHotspot(id) {
  const index = hotspotsDB.findIndex(h => h.id === id);

  if (index === -1) {
    throw new Error('Hotspot not found');
  }

  const deleted = hotspotsDB.splice(index, 1)[0];
  logger.info('Hotspot deleted', { id });

  return deleted;
}

/**
 * Şehre göre filtrele
 */
export function getHotspotsByCity(city) {
  return hotspotsDB.filter(h => h.location.city === city);
}

/**
 * Sahibine göre filtrele
 */
export function getHotspotsByOwner(ownerAccountId) {
  return hotspotsDB.filter(h => h.owner === ownerAccountId);
}

