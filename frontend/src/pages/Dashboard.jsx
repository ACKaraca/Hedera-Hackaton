import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHotspots: 0,
    totalUptime: 0,
    totalBandwidth: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [hotspotsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/hotspots`),
          axios.get(`${API_BASE_URL}/api/users`)
        ]);

        const hotspots = hotspotsRes.data || [];
        const users = usersRes.data || [];

        // Calculate statistics
        const totalHotspots = hotspots.length;
        const activeHotspots = hotspots.filter(h => h.status === 'ACTIVE').length;
        const totalUptime = hotspots.reduce((sum, h) => sum + (h.uptime || 0), 0);
        const totalBandwidth = hotspots.reduce((sum, h) => sum + (h.bandwidthShared || 0), 0);
        const activeUsers = users.filter(u => u.isActive).length;

        setStats({
          totalHotspots,
          activeHotspots,
          totalUptime: Math.round(totalUptime / 3600), // Convert to hours
          totalBandwidth: (totalBandwidth / (1024 ** 3)).toFixed(2), // Convert to GB
          activeUsers
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('İstatistikler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📡</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalHotspots}</h3>
            <p className="stat-label">Toplam Hotspot</p>
            <p className="stat-sublabel">{stats.activeHotspots} aktif</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalUptime}</h3>
            <p className="stat-label">Toplam Çalışma Süresi</p>
            <p className="stat-sublabel">saat</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBandwidth}</h3>
            <p className="stat-label">Paylaşılan Bant Genişliği</p>
            <p className="stat-sublabel">GB</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.activeUsers}</h3>
            <p className="stat-label">Aktif Kullanıcı</p>
            <p className="stat-sublabel">şu anda çevrimiçi</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>MeshFi Hakkında</h2>
        <p>
          MeshFi, Hedera Hashgraph üzerinde çalışan merkeziyetsiz bir WiFi ağı platformudur.
          Kullanıcılar hotspot sağlayarak $MESH token kazanabilir ve ağa bağlanarak internet erişimi sağlayabilirler.
        </p>
      </div>
    </div>
  );
};

