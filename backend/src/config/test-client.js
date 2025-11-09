import client from './hedera-client.js';
import { AccountBalanceQuery } from '@hashgraph/sdk';
import { logger } from '../utils/logger.js';

async function testClient() {
  try {
    logger.info('🧪 Hedera Client testi başlatılıyor...');

    const balance = await new AccountBalanceQuery()
      .setAccountId(client.operatorAccountId)
      .execute(client);

    logger.success('💰 Account Balance', {
      account: client.operatorAccountId.toString(),
      balance: balance.hbars.toString()
    });

    const balanceTinybars = balance.hbars.toTinybars().toNumber();
    if (balanceTinybars < 1000000) {
      logger.warn('⚠️  Bakiye düşük! Portal\'dan daha fazla test HBAR alın.');
      logger.info('📝 Portal: https://portal.hedera.com');
    } else {
      logger.success('✅ Bakiye yeterli');
    }
    
    // Client'ı kapat
    client.close();
    
    // Test başarıyla tamamlandı, process'i kapat
    process.exit(0);
  } catch (error) {
    logger.error('❌ Hedera Client testi başarısız', error);
    
    // Hata durumunda da client'ı kapat
    try {
      client.close();
    } catch (closeError) {
      // Client kapatma hatası görmezden gel
    }
    
    process.exit(1);
  }
}

testClient();

