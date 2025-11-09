import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHashConnect } from '../hooks/useHashConnect';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ProviderPanel.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const ProviderPanel = () => {
  const { accountId, isConnected } = useHashConnect();
  const [myHotspots, setMyHotspots] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !accountId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch my hotspots
        const hotspotsRes = await axios.get(`${API_BASE_URL}/api/hotspots`);
        const allHotspots = hotspotsRes.data || [];
        const myHotspotsData = allHotspots.filter(h => h.ownerId === accountId);
        setMyHotspots(myHotspotsData);

        // Calculate total earnings (mock data for now)
        const total = myHotspotsData.reduce((sum, h) => sum + (h.earnings || 0), 0);
        setTotalEarnings(total);

        // Generate earnings chart data (mock data)
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const dailyEarnings = days.map(() => Math.random() * 100);
        setEarningsData({
          labels: days,
          datasets: [
            {
              label: 'Günlük Kazanç ($MESH)',
              data: dailyEarnings,
              borderColor: 'rgb(102, 126, 234)',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, isConnected]);

  const handleAddHotspot = async (e) => {
    e.preventDefault();
    if (!isConnected || !accountId) {
      alert('Lütfen cüzdanınızı bağlayın');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/hotspots`, {
        name: formData.name,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        ownerId: accountId,
        status: 'ACTIVE'
      });

      alert('Hotspot başarıyla eklendi!');
      setShowAddForm(false);
      setFormData({ name: '', city: '', latitude: '', longitude: '' });
      
      // Refresh hotspots list
      const hotspotsRes = await axios.get(`${API_BASE_URL}/api/hotspots`);
      const allHotspots = hotspotsRes.data || [];
      setMyHotspots(allHotspots.filter(h => h.ownerId === accountId));
    } catch (error) {
      console.error('Error adding hotspot:', error);
      alert('Hotspot eklenirken bir hata oluştu');
    }
  };

  if (!isConnected) {
    return (
      <div className="provider-panel">
        <div className="wallet-required">
          <h2>Cüzdan Bağlantısı Gerekli</h2>
          <p>Sağlayıcı panelini kullanmak için lütfen HashPack cüzdanınızı bağlayın.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="provider-panel-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="provider-panel">
      <div className="panel-header">
        <h1 className="panel-title">Sağlayıcı Paneli</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-add-hotspot"
        >
          {showAddForm ? 'İptal' : '+ Yeni Hotspot Ekle'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-hotspot-form">
          <h2>Yeni Hotspot Ekle</h2>
          <form onSubmit={handleAddHotspot}>
            <div className="form-group">
              <label>Hotspot Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Şehir</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Enlem (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Boylam (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">Hotspot Ekle</button>
          </form>
        </div>
      )}

      <div className="panel-section">
        <h2>Kazanç İstatistikleri</h2>
        <div className="earnings-card">
          <div className="earnings-amount">
            {totalEarnings.toFixed(2)} $MESH
          </div>
          <p className="earnings-label">Toplam Kazanç</p>
        </div>
        {earningsData && (
          <div className="chart-container">
            <Line data={earningsData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Günlük Kazanç Grafiği'
                }
              }
            }} />
          </div>
        )}
      </div>

      <div className="panel-section">
        <h2>Hotspot'larım</h2>
        {myHotspots.length > 0 ? (
          <div className="hotspots-list">
            {myHotspots.map((hotspot) => (
              <div key={hotspot.id} className="hotspot-item">
                <div className="hotspot-item-header">
                  <h3>{hotspot.name || 'Hotspot'}</h3>
                  <span className={`status-badge ${hotspot.status?.toLowerCase()}`}>
                    {hotspot.status || 'UNKNOWN'}
                  </span>
                </div>
                <div className="hotspot-item-info">
                  <p><strong>Şehir:</strong> {hotspot.city || 'Belirtilmemiş'}</p>
                  <p><strong>Konum:</strong> {hotspot.latitude?.toFixed(4)}, {hotspot.longitude?.toFixed(4)}</p>
                  <p><strong>Kazanç:</strong> {(hotspot.earnings || 0).toFixed(2)} $MESH</p>
                  {hotspot.bandwidthShared && (
                    <p><strong>Paylaşılan Bant:</strong> {(hotspot.bandwidthShared / (1024 ** 3)).toFixed(2)} GB</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Henüz hotspot eklenmemiş.</p>
        )}
      </div>
    </div>
  );
};

