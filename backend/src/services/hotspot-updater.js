import { getAllHotspots } from './hotspot-service.js';
import { simulateBandwidthUsage, updateActiveUsers } from './bandwidth-simulator.js';
import { broadcastHotspotUpdate } from './websocket-service.js';

/**
 * Tüm hotspot'ların istatistiklerini günceller
 */
export function updateHotspotStats() {
  const hotspots = getAllHotspots();

  hotspots.forEach(hotspot => {
    if (hotspot.status !== 'ACTIVE') return;

    // Aktif kullanıcı sayısını güncelle
    updateActiveUsers(hotspot);

    // Bandwidth kullanımını artır
    const additionalBandwidth = simulateBandwidthUsage(hotspot);
    hotspot.stats.bandwidthUsedMB += additionalBandwidth;

    // Uptime'ı artır (her update = 1 saat varsayalım)
    hotspot.stats.uptimeHours += 1;

    // WebSocket ile frontend'e bildir
    broadcastHotspotUpdate(hotspot);
  });
}

/**
 * Hotspot updater'ı başlat (her 30 saniyede bir)
 */
export function startHotspotUpdater() {
  setInterval(() => {
    updateHotspotStats();
  }, 30000); // 30 saniye

  console.log('✅ Hotspot stats updater started');
}

