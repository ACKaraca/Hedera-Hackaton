/**
 * Gerçekçi bandwidth kullanımı simüle eder
 * @param {Hotspot} hotspot
 * @returns {number} Yeni bandwidth artışı (MB)
 */
export function simulateBandwidthUsage(hotspot) {
  const activeUsers = hotspot.stats.activeUsers;

  // Aktif kullanıcı yoksa çok az veri
  if (activeUsers === 0) {
    return Math.random() * 10; // 0-10 MB
  }

  // Kullanıcı başına ortalama 50-200 MB/saat
  const avgUsagePerUser = 50 + Math.random() * 150;
  const totalUsage = activeUsers * avgUsagePerUser * (Math.random() * 0.2); // 20% varyasyon

  return Math.floor(totalUsage);
}

/**
 * Rastgele aktif kullanıcı sayısı günceller
 */
export function updateActiveUsers(hotspot) {
  // Günün saatine göre kullanıcı sayısı değişir (basit simülasyon)
  const hour = new Date().getHours();

  if (hour >= 9 && hour <= 18) {
    // İş saatleri - daha fazla kullanıcı
    hotspot.stats.activeUsers = Math.floor(Math.random() * 20);
  } else {
    // Gece - daha az kullanıcı
    hotspot.stats.activeUsers = Math.floor(Math.random() * 5);
  }
}

