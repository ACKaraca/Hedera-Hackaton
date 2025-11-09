import axios from 'axios';
import { getMirrorNodeUrl } from '../config/mirror-node.js';
import { logger } from '../utils/logger.js';

// Basit in-memory cache
const cache = new Map();
const CACHE_TTL = 10000; // 10 saniye

export function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    logger.info('📦 Cache\'den alındı', { key });
    return cached.data;
  }
  return null;
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * HCS Topic'ten mesajları çeker
 * @param {string} topicId - Topic ID
 * @param {number} limit - Kaç mesaj çekilecek
 * @returns {Promise<object[]>} Mesaj listesi
 */
export async function getHCSMessages(topicId, limit = 10) {
  try {
    const cacheKey = `hcs-messages-${topicId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return cached;
    }

    const url = `${getMirrorNodeUrl()}/topics/${topicId}/messages?limit=${limit}`;

    logger.info('🔍 Mirror Node\'dan HCS mesajları çekiliyor...', { topicId, limit });

    const response = await axios.get(url, { timeout: 10000 });

    // Base64 decode mesajları
    const messages = response.data.messages.map(msg => ({
      sequenceNumber: msg.sequence_number,
      consensusTimestamp: msg.consensus_timestamp,
      message: Buffer.from(msg.message, 'base64').toString('utf-8'),
      runningHash: msg.running_hash
    }));

    logger.success(`${messages.length} mesaj çekildi`, { topicId });

    setCache(cacheKey, messages);
    return messages;
  } catch (error) {
    logger.error('Mirror Node sorgusu başarısız', error);
    throw error;
  }
}

/**
 * Bir hesabın token transferlerini getirir
 * @param {string} accountId - Hedera Account ID
 * @param {string} tokenId - Token ID (opsiyonel)
 * @returns {Promise<object[]>} Transfer listesi
 */
export async function getTokenTransfers(accountId, tokenId = null) {
  try {
    const cacheKey = `token-transfers-${accountId}-${tokenId || 'all'}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return cached;
    }

    let url = `${getMirrorNodeUrl()}/accounts/${accountId}/transactions?type=CRYPTOTRANSFER`;

    if (tokenId) {
      url += `&token.id=${tokenId}`;
    }

    logger.info('🔍 Token transferleri sorgulaniyor...', { accountId, tokenId });

    const response = await axios.get(url, { timeout: 10000 });

    const transfers = response.data.transactions || [];

    logger.success(`${transfers.length} transfer bulundu`, { accountId });

    setCache(cacheKey, transfers);
    return transfers;
  } catch (error) {
    logger.error('Token transfer sorgusu başarısız', error);
    return [];
  }
}

/**
 * Hesap bilgilerini Mirror Node'dan çeker
 * @param {string} accountId - Hedera Account ID
 * @returns {Promise<object>} Hesap bilgileri
 */
export async function getAccountInfo(accountId) {
  try {
    const cacheKey = `account-info-${accountId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return cached;
    }

    const url = `${getMirrorNodeUrl()}/accounts/${accountId}`;

    logger.info('🔍 Hesap bilgileri çekiliyor...', { accountId });

    const response = await axios.get(url, { timeout: 10000 });

    const accountInfo = {
      accountId: response.data.account,
      balance: response.data.balance,
      tokens: response.data.balance ? response.data.balance.tokens || [] : []
    };

    logger.success('Hesap bilgileri alındı', { accountId });

    setCache(cacheKey, accountInfo);
    return accountInfo;
  } catch (error) {
    logger.error('Hesap bilgisi sorgusu başarısız', error);
    throw error;
  }
}

/**
 * Cache'i temizle
 */
export function clearCache() {
  cache.clear();
  logger.success('Cache temizlendi');
}
