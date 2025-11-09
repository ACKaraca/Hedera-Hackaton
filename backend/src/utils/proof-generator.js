import crypto from 'crypto';

/**
 * Proof of Coverage verisi oluşturur
 * @param {Hotspot} hotspot
 * @returns {object} PoC verisi
 */
export function generateProofOfCoverage(hotspot) {
  return {
    type: 'PROOF_OF_COVERAGE',
    hotspotId: hotspot.id,
    location: hotspot.location,
    timestamp: Date.now(),
    status: hotspot.status,
    uptime: hotspot.stats.uptimeHours
  };
}

/**
 * Proof of Bandwidth verisi oluşturur
 * @param {Hotspot} hotspot
 * @returns {object} PoB verisi
 */
export function generateProofOfBandwidth(hotspot) {
  return {
    type: 'PROOF_OF_BANDWIDTH',
    hotspotId: hotspot.id,
    bandwidthUsedMB: hotspot.stats.bandwidthUsedMB,
    activeUsers: hotspot.stats.activeUsers,
    timestamp: Date.now()
  };
}

/**
 * Verinin SHA-256 hash'ini alır
 * @param {object} data - Hash'lenecek veri
 * @returns {string} Hex formatında hash
 */
export function hashData(data) {
  const jsonString = JSON.stringify(data);
  return crypto
    .createHash('sha256')
    .update(jsonString)
    .digest('hex');
}

/**
 * Hotspot için kombine kanıt oluşturur ve hash'ler
 * @param {Hotspot} hotspot
 * @returns {object} { proof, hash }
 */
export function createHotspotProof(hotspot) {
  const proof = {
    ...generateProofOfCoverage(hotspot),
    ...generateProofOfBandwidth(hotspot)
  };

  const hash = hashData(proof);

  return { proof, hash };
}

/**
 * Bir kanıtın hash'ini doğrular
 * @param {object} proof - Orijinal kanıt
 * @param {string} hash - Kontrol edilecek hash
 * @returns {boolean}
 */
export function verifyProof(proof, hash) {
  const calculatedHash = hashData(proof);
  return calculatedHash === hash;
}

