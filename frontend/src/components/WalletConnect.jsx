import React from 'react';
import { useHashConnect } from '../hooks/useHashConnect';
import './WalletConnect.css';

export const WalletConnect = () => {
  const { accountId, isConnected, connectWallet, disconnectWallet } = useHashConnect();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      alert('Cüzdan bağlantısı başarısız. Lütfen HashPack cüzdanınızın açık olduğundan emin olun.');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAccountId = (id) => {
    if (!id) return '';
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {isConnected && accountId ? (
        <div className="wallet-connected">
          <span className="wallet-status">●</span>
          <span className="wallet-address">{formatAccountId(accountId)}</span>
          <button onClick={handleDisconnect} className="btn-disconnect">
            Bağlantıyı Kes
          </button>
        </div>
      ) : (
        <button onClick={handleConnect} className="btn-connect">
          Cüzdan Bağla
        </button>
      )}
    </div>
  );
};

