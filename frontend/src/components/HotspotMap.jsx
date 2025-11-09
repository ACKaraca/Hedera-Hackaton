import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './HotspotMap.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Fix for default marker icons in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const HotspotMap = () => {
  const [hotspots, setHotspots] = useState([]);
  const [filteredHotspots, setFilteredHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    status: 'ALL'
  });

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/hotspots`);
        const hotspotsData = response.data || [];
        setHotspots(hotspotsData);
        setFilteredHotspots(hotspotsData);
      } catch (error) {
        console.error('Error fetching hotspots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
    const interval = setInterval(fetchHotspots, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...hotspots];

    if (filters.city) {
      filtered = filtered.filter(h => 
        h.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(h => h.status === filters.status);
    }

    setFilteredHotspots(filtered);
  }, [filters, hotspots]);

  const getMarkerColor = (status) => {
    return status === 'ACTIVE' ? 'green' : 'gray';
  };

  const center = hotspots.length > 0 
    ? [hotspots[0].latitude || 39.9334, hotspots[0].longitude || 32.8597] // Default to Ankara
    : [39.9334, 32.8597];

  if (loading) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Harita yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="hotspot-map-container">
      <div className="map-filters">
        <h2>Hotspot Haritası</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Şehre göre filtrele..."
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="filter-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
          </select>
        </div>
        <p className="filter-info">
          {filteredHotspots.length} hotspot gösteriliyor
        </p>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredHotspots.map((hotspot) => (
            <Marker
              key={hotspot.id}
              position={[hotspot.latitude || 0, hotspot.longitude || 0]}
              icon={new Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${getMarkerColor(hotspot.status)}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{hotspot.name || 'Hotspot'}</h3>
                  <p><strong>Durum:</strong> {hotspot.status || 'UNKNOWN'}</p>
                  <p><strong>Şehir:</strong> {hotspot.city || 'Belirtilmemiş'}</p>
                  <p><strong>Sahip:</strong> {hotspot.ownerId ? `${hotspot.ownerId.slice(0, 8)}...` : 'Bilinmiyor'}</p>
                  {hotspot.bandwidthShared && (
                    <p><strong>Paylaşılan Bant:</strong> {Math.round(hotspot.bandwidthShared / 1024)} GB</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

