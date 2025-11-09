import express from 'express';
import { submitProofToHCS, submitBatchProofs } from '../services/hcs-service.js';
import { getHCSMessages } from '../services/mirror-service.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/hcs/proof - Kanıt gönder
 */
router.post('/proof', async (req, res) => {
  try {
    const { proofHash } = req.body;

    if (!proofHash) {
      return res.status(400).json({ error: 'proofHash gerekli' });
    }

    const result = await submitProofToHCS(proofHash);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('HCS proof endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/hcs/batch - Toplu kanıtları gönder
 */
router.post('/batch', async (req, res) => {
  try {
    const { proofHashes } = req.body;

    if (!Array.isArray(proofHashes) || proofHashes.length === 0) {
      return res.status(400).json({ error: 'proofHashes dizisi gerekli' });
    }

    logger.info('📦 Toplu kanıtları gönderiliyor...', { count: proofHashes.length });
    const results = await submitBatchProofs(proofHashes);

    res.json({
      success: true,
      total: proofHashes.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    logger.error('HCS batch endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/hcs/messages - Mesajları getir
 */
router.get('/messages', async (req, res) => {
  try {
    const topicId = process.env.HCS_TOPIC_ID;
    const limit = parseInt(req.query.limit) || 20;

    if (!topicId) {
      return res.status(400).json({ error: 'HCS_TOPIC_ID .env dosyasında tanımlı değil' });
    }

    const messages = await getHCSMessages(topicId, limit);
    res.json({
      topicId,
      messageCount: messages.length,
      messages
    });
  } catch (error) {
    logger.error('HCS messages endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
