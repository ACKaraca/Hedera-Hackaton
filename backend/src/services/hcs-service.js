import { TopicCreateTransaction, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import client from '../config/hedera-client.js';
import { logger } from '../utils/logger.js';

/**
 * Yeni HCS Topic oluşturur (bir kerelik)
 * @returns {Promise<string>} Topic ID (örn: "0.0.123456")
 */
export async function createHcsTopic() {
  try {
    logger.info('📝 Yeni HCS Topic oluşturuluyor...');

    const txResponse = await new TopicCreateTransaction()
      .setTopicMemo('MeshFi DePIN - Hotspot Proofs')
      .execute(client);

    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId.toString();

    logger.success('HCS Topic oluşturuldu', { topicId });
    console.log(`\n⚠️  ÖNEMLİ: Bu Topic ID'yi .env dosyasına kaydedin:`);
    console.log(`HCS_TOPIC_ID="${topicId}"\n`);

    return topicId;
  } catch (error) {
    logger.error('HCS Topic oluşturma hatası', error);
    throw error;
  }
}

/**
 * HCS Topic'e kanıt mesajı gönderir
 * @param {string} proofHash - SHA-256 hash of data
 * @returns {Promise<object>} Receipt bilgisi
 */
export async function submitProofToHCS(proofHash) {
  try {
    const topicId = process.env.HCS_TOPIC_ID;

    if (!topicId) {
      throw new Error('HCS_TOPIC_ID .env dosyasında tanımlı değil!');
    }

    logger.info('📤 HCS\'ye kanıt gönderiliyor...', {
      topicId,
      hashPreview: proofHash.substring(0, 16) + '...'
    });

    const txResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: proofHash,
    }).execute(client);

    const receipt = await txResponse.getReceipt(client);

    logger.success('HCS mesajı gönderildi', {
      status: receipt.status.toString(),
      sequenceNumber: receipt.topicSequenceNumber.toString()
    });

    return {
      status: receipt.status.toString(),
      sequenceNumber: receipt.topicSequenceNumber.toString(),
      topicId: topicId
    };
  } catch (error) {
    logger.error('HCS mesaj gönderme hatası', error);
    throw error;
  }
}

/**
 * Birden fazla kanıtı toplu olarak gönderir
 * @param {string[]} proofHashes - Hash dizisi
 * @returns {Promise<object[]>} Tüm receipt'ler
 */
export async function submitBatchProofs(proofHashes) {
  const results = [];

  for (const hash of proofHashes) {
    try {
      const result = await submitProofToHCS(hash);
      results.push({ success: true, ...result });
      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  return results;
}
