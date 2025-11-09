import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('Yükleniyor...');
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    // Backend'e bağlan
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
          const data = await response.json();
          setStatus('Backend Bağlandı ✅');
          setApiStatus(data);
        }
      } catch (error) {
        setStatus('Backend Bağlanılamadı ❌');
        console.error('Backend bağlantı hatası:', error);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌊 MeshFi</h1>
        <p>Hedera DePIN Platformu</p>
        
        <div className="status-box">
          <h2>Sistem Durumu</h2>
          <p className="status-text">{status}</p>
          
          {apiStatus && (
            <div className="api-info">
              <p><strong>Mesaj:</strong> {apiStatus.message}</p>
              <p><strong>Zaman:</strong> {new Date(apiStatus.timestamp).toLocaleString('tr-TR')}</p>
            </div>
          )}
        </div>

        <div className="info-box">
          <h3>Proje Bilgisi</h3>
          <p>MeshFi - Mesh Wireless Network üzerine kurulu DePIN platformu</p>
          <p>Backend: http://localhost:3001</p>
          <p>Frontend: http://localhost:3000</p>
        </div>
      </header>
    </div>
  );
}

export default App;
