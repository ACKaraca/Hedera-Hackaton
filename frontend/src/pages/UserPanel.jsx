import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHashConnect } from '../hooks/useHashConnect';
import './UserPanel.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const MIRROR_NODE_URL = 'https://testnet.mirrornode.hedera.com';

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const UserPanel = () => {
  const { accountId, isConnected } = useHashConnect();
  const [nearbyHotspots, setNearbyHotspots] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotspots
        const hotspotsRes = await axios.get(`${API_BASE_URL}/api/hotspots`);
        const hotspots = hotspotsRes.data || [];

        // Calculate distances if user location is available
        let hotspotsWithDistance = hotspots;
        if (userLocation) {
          hotspotsWithDistance = hotspots.map(hotspot => ({
            ...hotspot,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lon,
              hotspot.latitude || 0,
              hotspot.longitude || 0
            )
          })).sort((a, b) => a.distance - b.distance);
        }

        setNearbyHotspots(hotspotsWithDistance.slice(0, 10)); // Top 10 nearest

        // Fetch token balance if wallet is connected
        if (isConnected && accountId) {
          try {
            // Find MESH token balance (assuming token ID is known)
            // For now, we'll show account balance
            const accountRes = await axios.get(
              `${MIRROR_NODE_URL}/api/v1/accounts/${accountId}`
            );
            setTokenBalance(accountRes.data.balance?.balance || 0);
          } catch (error) {
            console.error('Error fetching token balance:', error);
          }
        }

        // Fetch usage history if wallet is connected
        if (isConnected && accountId) {
          try {
            const historyRes = await axios.get(
              `${API_BASE_URL}/api/users/${accountId}/history`
            );
            setUsageHistory(historyRes.data || []);
          } catch (error) {
            console.error('Error fetching usage history:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, isConnected, userLocation]);

  if (!isConnected) {
    return (
      <div className="user-panel">
        <div className="wallet-required">
          <h2>Cüzdan Bağlantısı Gerekli</h2>
          <p>Kullanıcı panelini kullanmak için lütfen HashPack cüzdanınızı bağlayın.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-panel-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="user-panel">
      <h1 className="panel-title">Kullanıcı Paneli</h1>

      <div className="panel-section">
        <h2>Token Bakiyesi</h2>
        <div className="balance-card">
          <div className="balance-amount">
            {tokenBalance !== null ? `${tokenBalance / 100000000} HBAR` : 'Yükleniyor...'}
          </div>
          <p className="balance-label">Hesap Bakiyesi</p>
        </div>
      </div>

      <div className="panel-section">
        <h2>Yakındaki Hotspotlar</h2>
        {nearbyHotspots.length > 0 ? (
          <div className="hotspots-grid">
            {nearbyHotspots.map((hotspot) => (
              <div key={hotspot.id} className="hotspot-card">
                <div className="hotspot-header">
                  <h3>{hotspot.name || 'Hotspot'}</h3>
                  <span className={`status-badge ${hotspot.status?.toLowerCase()}`}>
                    {hotspot.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="hotspot-info">
                  <p><strong>Şehir:</strong> {hotspot.city || 'Belirtilmemiş'}</p>
                  {hotspot.distance !== undefined && (
                    <p><strong>Mesafe:</strong> {hotspot.distance.toFixed(2)} km</p>
                  )}
                  {hotspot.bandwidthShared && (
                    <p><strong>Paylaşılan Bant:</strong> {(hotspot.bandwidthShared / (1024 ** 3)).toFixed(2)} GB</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Yakında hotspot bulunamadı.</p>
        )}
      </div>

      <div className="panel-section">
        <h2>Kullanım Geçmişi</h2>
        {usageHistory.length > 0 ? (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Hotspot</th>
                  <th>Süre</th>
                  <th>Bant Genişliği</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.timestamp).toLocaleString('tr-TR')}</td>
                    <td>{entry.hotspotName || 'Bilinmiyor'}</td>
                    <td>{entry.duration || 'N/A'}</td>
                    <td>{entry.bandwidth ? `${Math.round(entry.bandwidth / 1024)} GB` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">Henüz kullanım geçmişi bulunmuyor.</p>
        )}
      </div>
    </div>
  );
};

