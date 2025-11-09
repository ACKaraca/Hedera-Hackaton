import dotenv from 'dotenv';
import { Client, PrivateKey, Hbar } from '@hashgraph/sdk';

dotenv.config();

if (!process.env.MY_ACCOUNT_ID || !process.env.MY_PRIVATE_KEY) {
  throw new Error('❌ MY_ACCOUNT_ID ve MY_PRIVATE_KEY .env dosyasında olmalı');
}

// Testnet client oluştur
const client = Client.forTestnet();

// Private key'i parse et - DER format veya hex format desteklenir
let privateKey;
const privateKeyStr = process.env.MY_PRIVATE_KEY;

try {
  // Önce DER formatını dene (302 ile başlıyorsa)
  if (privateKeyStr.startsWith('302') || privateKeyStr.startsWith('303')) {
    privateKey = PrivateKey.fromStringDer(privateKeyStr);
  } else {
    // Hex format - "0x" prefix'ini kaldır
    const hexKey = privateKeyStr.startsWith('0x') 
      ? privateKeyStr.substring(2) 
      : privateKeyStr;
    
    // ED25519 için deneme (Hedera'nın varsayılan key tipi)
    try {
      privateKey = PrivateKey.fromStringED25519(hexKey);
    } catch (ed25519Error) {
      // ECDSA için deneme
      try {
        privateKey = PrivateKey.fromStringECDSA(hexKey);
      } catch (ecdsaError) {
        throw new Error(`Private key parse edilemedi. ED25519: ${ed25519Error.message}, ECDSA: ${ecdsaError.message}`);
      }
    }
  }
} catch (error) {
  console.error('❌ Private key parse hatası:', error.message);
  throw new Error(`Private key formatı geçersiz: ${error.message}`);
}

// Operator hesabını ayarla (işlem ücretlerini kim ödüyor?)
client.setOperator(
  process.env.MY_ACCOUNT_ID,
  privateKey
);

// İşlem timeout süresini ayarla (opsiyonel)
client.setDefaultMaxTransactionFee(new Hbar(100));

console.log('✅ Hedera Testnet Client başarıyla kuruldu.');
console.log(`📌 Operator Account: ${process.env.MY_ACCOUNT_ID}`);

export default client;
