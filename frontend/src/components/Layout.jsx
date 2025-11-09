import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import './Layout.css';

export const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>MeshFi</h1>
            <span className="logo-subtitle">DePIN WiFi Network</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Ana Sayfa
            </Link>
            <Link to="/map" className={`nav-link ${isActive('/map')}`}>
              Hotspot Haritası
            </Link>
            <Link to="/user" className={`nav-link ${isActive('/user')}`}>
              Kullanıcı Paneli
            </Link>
            <Link to="/provider" className={`nav-link ${isActive('/provider')}`}>
              Sağlayıcı Paneli
            </Link>
            <Link to="/hcs" className={`nav-link ${isActive('/hcs')}`}>
              HCS Kanıt Akışı
            </Link>
          </nav>

          <WalletConnect />
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 MeshFi. Hedera Hashgraph üzerinde DePIN platformu.</p>
          <div className="footer-links">
            <a href="https://hedera.com" target="_blank" rel="noopener noreferrer">
              Hedera
            </a>
            <a href="https://hashpack.app" target="_blank" rel="noopener noreferrer">
              HashPack
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

