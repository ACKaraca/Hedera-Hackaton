export const MIRROR_NODE_CONFIG = {
  testnet: 'https://testnet.mirrornode.hedera.com/api/v1',
  mainnet: 'https://mainnet-public.mirrornode.hedera.com/api/v1'
};

export const getMirrorNodeUrl = () => {
  const network = process.env.HEDERA_NETWORK || 'testnet';
  return MIRROR_NODE_CONFIG[network];
};
