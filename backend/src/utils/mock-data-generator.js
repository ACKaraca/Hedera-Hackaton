import { Hotspot } from '../models/hotspot-model.js';

// Türkiye ve dünya çapında örnek şehirler
const CITIES = [
  { name: 'İstanbul', lat: 41.0082, lon: 28.9784 },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597 },
  { name: 'İzmir', lat: 38.4237, lon: 27.1428 },
  { name: 'Antalya', lat: 36.8969, lon: 30.7133 },
  { name: 'Bursa', lat: 40.1826, lon: 29.0665 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 }
];

const HOTSPOT_NAMES = [
  'CafeWiFi', 'OfficeHub', 'ParkSpot', 'UniversityNet',
  'MallConnection', 'AirportZone', 'LibraryAccess', 'HomeShare'
];

/**
 * Rastgele hotspot oluşturur
 * @param {string} ownerAccountId - Sahip Hedera hesabı
 * @returns {Hotspot}
 */
export function generateRandomHotspot(ownerAccountId) {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const baseName = HOTSPOT_NAMES[Math.floor(Math.random() * HOTSPOT_NAMES.length)];

  // Koordinatlara küçük varyasyon ekle (aynı şehirde farklı lokasyonlar)
  const latVariation = (Math.random() - 0.5) * 0.1; // ±0.05 derece
  const lonVariation = (Math.random() - 0.5) * 0.1;

  return new Hotspot({
    name: `${city.name}-${baseName}-${Math.floor(Math.random() * 1000)}`,
    location: {
      lat: city.lat + latVariation,
      lon: city.lon + lonVariation,
      city: city.name
    },
    owner: ownerAccountId,
    stats: {
      bandwidthUsedMB: Math.floor(Math.random() * 5000), // 0-5000 MB
      uptimeHours: Math.floor(Math.random() * 720), // 0-720 saat (30 gün)
      activeUsers: Math.floor(Math.random() * 20) // 0-20 kullanıcı
    }
  });
}

/**
 * Birden fazla hotspot oluşturur
 * @param {number} count - Kaç hotspot
 * @param {string} ownerAccountId - Sahip hesap
 * @returns {Hotspot[]}
 */
export function generateHotspots(count, ownerAccountId) {
  const hotspots = [];
  for (let i = 0; i < count; i++) {
    hotspots.push(generateRandomHotspot(ownerAccountId));
  }
  return hotspots;
}

