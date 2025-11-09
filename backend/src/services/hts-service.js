import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TokenInfoQuery
} from '@hashgraph/sdk';
import client from '../config/hedera-client.js';
import { logger } from '../utils/logger.js';

/**
 * $MESH DePIN Token oluşturur (bir kerelik)
 * @returns {Promise<string>} Token ID
 */
export async function createMeshToken() {
  try {
    logger.info('🪙 $MESH Token oluşturuluyor...');

    const adminKey = client.operatorPublicKey;
    const supplyKey = client.operatorPublicKey;

    const txResponse = await new TokenCreateTransaction()
      .setTokenName('MeshFi Network Token')
      .setTokenSymbol('MESH')
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(2) // 0.01 MESH hassasiyeti
      .setInitialSupply(1000000000) // 10,000,000.00 MESH
      .setSupplyType(TokenSupplyType.Infinite) // İleride mint edebiliriz
      .setTreasuryAccountId(client.operatorAccountId)
      .setAdminKey(adminKey)
      .setSupplyKey(supplyKey)
      .setMaxTransactionFee(new Hbar(30))
      .execute(client);

    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId.toString();

    logger.success('$MESH Token oluşturuldu', { tokenId });
    console.log(`\n⚠️  ÖNEMLİ: Bu Token ID'yi .env dosyasına kaydedin:`);
    console.log(`MESH_TOKEN_ID="${tokenId}"\n`);

    return tokenId;
  } catch (error) {
    logger.error('Token oluşturma hatası', error);
    throw error;
  }
}

/**
 * Token bilgilerini sorgular
 * @param {string} tokenId - Token ID
 * @returns {Promise<object>} Token bilgileri
 */
export async function getTokenInfo(tokenId) {
  try {
    logger.info('🔍 Token bilgileri sorgulaniyor...', { tokenId });

    const info = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .execute(client);

    const tokenInfo = {
      name: info.name,
      symbol: info.symbol,
      decimals: info.decimals,
      totalSupply: info.totalSupply.toString(),
      treasury: info.treasuryAccountId.toString()
    };

    logger.success('Token bilgileri alındı', tokenInfo);
    return tokenInfo;
  } catch (error) {
    logger.error('Token bilgisi sorgulama hatası', error);
    throw error;
  }
}

/**
 * Kullanıcıya $MESH token gönderir (ödül)
 * @param {string} recipientAccountId - Alıcı Hedera Account ID
 * @param {number} amount - Token miktarı (örn: 10.50 için 1050)
 * @returns {Promise<object>} Transfer receipt
 */
export async function transferMeshTokens(recipientAccountId, amount) {
  try {
    const tokenId = process.env.MESH_TOKEN_ID;

    if (!tokenId) {
      throw new Error('MESH_TOKEN_ID .env dosyasında tanımlı değil!');
    }

    logger.info('💸 Token transfer başlatılıyor...', {
      recipient: recipientAccountId,
      amount: (amount / 100).toFixed(2) + ' MESH'
    });

    const txResponse = await new TransferTransaction()
      .addTokenTransfer(tokenId, client.operatorAccountId, -amount)
      .addTokenTransfer(tokenId, recipientAccountId, amount)
      .execute(client);

    const receipt = await txResponse.getReceipt(client);

    logger.success('Token transfer tamamlandı', {
      status: receipt.status.toString()
    });

    return {
      success: true,
      status: receipt.status.toString(),
      amount: (amount / 100).toFixed(2)
    };
  } catch (error) {
    logger.error('Token transfer hatası', error);
    throw error;
  }
}

/**
 * Hesabın token bakiyesini sorgulanır
 * @param {string} accountId - Account ID
 * @param {string} tokenId - Token ID
 * @returns {Promise<number>} Bakiye (tiny units'de)
 */
export async function getTokenBalance(accountId, tokenId) {
  try {
    logger.info('💰 Token bakiyesi sorgulaniyor...', { accountId, tokenId });

    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    const tokenBalance = balance.tokens.get(tokenId);
    const balanceAmount = tokenBalance ? tokenBalance.toNumber() : 0;

    logger.success('Bakiye sorgulandı', {
      accountId,
      balance: (balanceAmount / 100).toFixed(2) + ' MESH'
    });

    return balanceAmount;
  } catch (error) {
    logger.error('Bakiye sorgulama hatası', error);
    throw error;
  }
}
