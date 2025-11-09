/**
 * Hotspot veri yapısı
 * @typedef {Object} Hotspot
 * @property {string} id - Benzersiz ID (UUID)
 * @property {string} name - Hotspot adı
 * @property {object} location - Coğrafi konum
 * @property {number} location.lat - Enlem
 * @property {number} location.lon - Boylam
 * @property {string} location.city - Şehir
 * @property {string} owner - Sahip Hedera Account ID
 * @property {object} stats - İstatistikler
 * @property {number} stats.bandwidthUsedMB - Kullanılan bandwidth (MB)
 * @property {number} stats.uptimeHours - Çalışma süresi (saat)
 * @property {number} stats.activeUsers - Aktif kullanıcı sayısı
 * @property {string} status - "ACTIVE" | "INACTIVE" | "MAINTENANCE"
 * @property {number} createdAt - Oluşturulma zamanı (timestamp)
 * @property {number} lastProofSent - Son kanıt gönderim zamanı
 */

export class Hotspot {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.name = data.name;
    this.location = data.location;
    this.owner = data.owner;
    this.stats = {
      bandwidthUsedMB: 0,
      uptimeHours: 0,
      activeUsers: 0,
      ...data.stats
    };
    this.status = data.status || 'ACTIVE';
    this.createdAt = data.createdAt || Date.now();
    this.lastProofSent = data.lastProofSent || 0;
  }

  generateId() {
    return 'HS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      owner: this.owner,
      stats: this.stats,
      status: this.status,
      createdAt: this.createdAt,
      lastProofSent: this.lastProofSent
    };
  }
}

