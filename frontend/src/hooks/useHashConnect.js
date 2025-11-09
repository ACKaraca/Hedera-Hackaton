import { HashConnect } from 'hashconnect';
import { useState, useEffect } from 'react';

let hc = null;

const appMetadata = {
  name: "MeshFi",
  description: "DePIN WiFi Network",
  icon: "/logo.png"
};

export const useHashConnect = () => {
  const [accountId, setAccountId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize HashConnect
    const initHashConnect = async () => {
      try {
        if (!hc) {
          hc = new HashConnect();
        }

        await hc.init(appMetadata, "testnet", false);
        setIsInitialized(true);

        // Check for saved pairing data
        const savedPairingData = localStorage.getItem('hashconnect_pairing');
        if (savedPairingData) {
          const pairingData = JSON.parse(savedPairingData);
          if (pairingData.accountIds && pairingData.accountIds.length > 0) {
            setAccountId(pairingData.accountIds[0]);
            setIsConnected(true);
          }
        }

        // Listen for pairing events
        hc.pairingEvent.on((data) => {
          if (data.accountIds && data.accountIds.length > 0) {
            setAccountId(data.accountIds[0]);
            setIsConnected(true);
            // Save pairing data to localStorage
            localStorage.setItem('hashconnect_pairing', JSON.stringify(data));
          }
        });

        // Listen for disconnect events
        hc.disconnectionEvent.on(() => {
          setAccountId(null);
          setIsConnected(false);
          localStorage.removeItem('hashconnect_pairing');
        });

        // Check if already paired
        if (hc.pairingData) {
          const pairingData = hc.pairingData;
          if (pairingData.accountIds && pairingData.accountIds.length > 0) {
            setAccountId(pairingData.accountIds[0]);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('HashConnect initialization error:', error);
      }
    };

    initHashConnect();
  }, []);

  const connectWallet = async () => {
    try {
      if (!hc) {
        hc = new HashConnect();
        await hc.init(appMetadata, "testnet", false);
        setIsInitialized(true);
      }
      await hc.connectToLocalWallet();
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    try {
      if (hc) {
        hc.disconnect();
      }
      setAccountId(null);
      setIsConnected(false);
      localStorage.removeItem('hashconnect_pairing');
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  return { 
    accountId, 
    isConnected, 
    isInitialized,
    connectWallet, 
    disconnectWallet,
    hc 
  };
};

