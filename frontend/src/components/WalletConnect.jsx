import React, { useState } from 'react';
import { useHashConnect } from '../hooks/useHashConnect';
import './WalletConnect.css';

export const WalletConnect = () => {
  const { accountId, isConnected, connectWallet, disconnectWallet } = useHashConnect();
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (error) {
      setError('Cüzdan bağlantısı başarısız. Lütfen HashPack cüzdanınızın açık olduğundan emin olun.');
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
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
      {error && (
        <div className="error-toast">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}
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

