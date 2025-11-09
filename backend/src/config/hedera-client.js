import dotenv from 'dotenv';
import { Client, PrivateKey, Hbar } from '@hashgraph/sdk';

dotenv.config();

if (!process.env.MY_ACCOUNT_ID || !process.env.MY_PRIVATE_KEY) {
  throw new Error('❌ MY_ACCOUNT_ID ve MY_PRIVATE_KEY .env dosyasında olmalı');
}

// Testnet client oluştur
const client = Client.forTestnet();

const { MY_ACCOUNT_ID, MY_PRIVATE_KEY, PRIVATE_KEY_DER, PUBLIC_KEY_DER } = process.env;

if (!MY_PRIVATE_KEY && !PRIVATE_KEY_DER) {
  throw new Error('❌ MY_PRIVATE_KEY veya PRIVATE_KEY_DER environment değişkeni ayarlanmalı');
}

const privateKeyCandidates = [MY_PRIVATE_KEY, PRIVATE_KEY_DER]
  .filter(Boolean)
  .map((value) => value.trim())
  .flatMap((value) => {
    if (!value) return [];
    return value.startsWith('0x') ? [value, value.substring(2)] : [value];
  });

function keyMatchesPublicKey(key) {
  if (!PUBLIC_KEY_DER) {
    return true;
  }

  const derivedDer = key.publicKey.toStringDer();
  const derivedRaw = key.publicKey.toStringRaw();
  return PUBLIC_KEY_DER === derivedDer || PUBLIC_KEY_DER === derivedRaw;
}

function tryParsePrivateKey(value) {
  const parsers = [
    (str) => PrivateKey.fromString(str),
    (str) => PrivateKey.fromStringECDSA(str),
    (str) => PrivateKey.fromStringED25519(str)
  ];

  for (const parser of parsers) {
    try {
      return parser(value);
    } catch (error) {
      // Diğer parser'ları denemeye devam et
    }
  }

  return null;
}

let privateKey;
for (const candidate of privateKeyCandidates) {
  const parsed = tryParsePrivateKey(candidate);
  if (parsed && keyMatchesPublicKey(parsed)) {
    privateKey = parsed;
    break;
  }
}

if (!privateKey) {
  throw new Error('❌ Private key environment değişkenleri geçerli bir anahtar ile eşleşmedi. PUBLIC_KEY_DER değerini ve anahtar formatını kontrol edin.');
}

console.log(`🔐 Operator anahtar tipi: ${privateKey.type}`);

// Operator hesabını ayarla (işlem ücretlerini kim ödüyor?)
client.setOperator(
  MY_ACCOUNT_ID,
  privateKey
);

// İşlem timeout süresini ayarla (opsiyonel)
client.setDefaultMaxTransactionFee(new Hbar(100));

console.log('✅ Hedera Testnet Client başarıyla kuruldu.');
console.log(`📌 Operator Account: ${process.env.MY_ACCOUNT_ID}`);

export default client;
