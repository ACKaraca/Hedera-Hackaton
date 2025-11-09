const requiredEnvVars = [
  'MY_ACCOUNT_ID',
  'MY_PRIVATE_KEY',
  'PORT',
  'HEDERA_NETWORK'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Eksik environment variables: ${missing.join(', ')}\n` +
      'Lütfen .env dosyasını kontrol edin.'
    );
  }

  console.log('✅ Environment variables doğrulandı');
}
