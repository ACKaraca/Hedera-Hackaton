import cron from 'node-cron';
import { submitProofToHCS } from './hcs-service.js';
import { createHotspotProof } from '../utils/proof-generator.js';
import { logger } from '../utils/logger.js';

let hotspotStore = []; // Tüm hotspot'lar burada (in-memory)

/**
 * Hotspot store'u ayarla
 */
export function setHotspots(hotspots) {
  hotspotStore = hotspots;
}

/**
 * Tüm hotspot'lar için kanıt gönderir
 */
async function sendAllProofs() {
  logger.info(`⏰ Scheduled proof submission for ${hotspotStore.length} hotspots`);

  for (const hotspot of hotspotStore) {
    try {
      // Sadece aktif hotspot'lar için kanıt gönder
      if (hotspot.status !== 'ACTIVE') continue;

      const { proof, hash } = createHotspotProof(hotspot);

      // HCS'ye gönder
      await submitProofToHCS(hash);

      // Son kanıt zamanını güncelle
      hotspot.lastProofSent = Date.now();

      // Proof'u database'e kaydet (ileride doğrulama için)
      // saveProofToDatabase(proof, hash); // TODO: Implement

      logger.success(`Proof sent for hotspot ${hotspot.id}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      logger.error(`Proof submission failed for ${hotspot.id}`, error);
    }
  }
}

/**
 * Scheduler'ı başlat
 * Her 10 dakikada bir çalışır
 */
export function startProofScheduler() {
  // Cron syntax: '*/10 * * * *' = Her 10 dakikada bir
  // Test için: '*/1 * * * *' = Her 1 dakikada bir

  cron.schedule('*/10 * * * *', () => {
    sendAllProofs();
  });

  logger.info('✅ Proof scheduler started (runs every 10 minutes)');

  // İlk kanıt hemen gönder (bekleme yok)
  setTimeout(sendAllProofs, 5000); // 5 saniye sonra
}

