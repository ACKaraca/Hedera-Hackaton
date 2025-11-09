import express from 'express';
import {
  transferMeshTokens,
  getTokenBalance,
  getTokenInfo,
  createMeshToken
} from '../services/hts-service.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/token/create - Token oluştur (admin)
 */
router.post('/create', async (req, res) => {
  try {
    logger.warn('⚠️  Token oluşturma endpoint çağrıldı', {});

    const tokenId = await createMeshToken();

    res.json({
      success: true,
      message: 'Token başarıyla oluşturuldu',
      tokenId,
      note: '.env dosyasına MESH_TOKEN_ID eklenmelidir'
    });
  } catch (error) {
    logger.error('Token create endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/token/transfer - Token transfer et
 */
router.post('/transfer', async (req, res) => {
  try {
    const { recipientAccountId, amount } = req.body;

    if (!recipientAccountId || !amount) {
      return res.status(400).json({
        error: 'recipientAccountId ve amount gerekli'
      });
    }

    const result = await transferMeshTokens(recipientAccountId, amount);
    res.json(result);
  } catch (error) {
    logger.error('Token transfer endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/token/balance/:accountId - Bakiye sorgula
 */
router.get('/balance/:accountId', async (req, res) => {
  try {
    const tokenId = process.env.MESH_TOKEN_ID;

    if (!tokenId) {
      return res.status(400).json({ error: 'MESH_TOKEN_ID .env dosyasında tanımlı değil' });
    }

    const balance = await getTokenBalance(req.params.accountId, tokenId);

    res.json({
      accountId: req.params.accountId,
      tokenId,
      balanceSmallestUnits: balance,
      balanceMESH: (balance / 100).toFixed(2)
    });
  } catch (error) {
    logger.error('Token balance endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/token/info - Token bilgileri
 */
router.get('/info', async (req, res) => {
  try {
    const tokenId = process.env.MESH_TOKEN_ID;

    if (!tokenId) {
      return res.status(400).json({ error: 'MESH_TOKEN_ID .env dosyasında tanımlı değil' });
    }

    const info = await getTokenInfo(tokenId);
    res.json({
      tokenId,
      ...info
    });
  } catch (error) {
    logger.error('Token info endpoint hatası', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
