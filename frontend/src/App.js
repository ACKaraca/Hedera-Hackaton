import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { HotspotMap } from './components/HotspotMap';
import { UserPanel } from './pages/UserPanel';
import { ProviderPanel } from './pages/ProviderPanel';
import { HCSMessages } from './components/HCSMessages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<HotspotMap />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/provider" element={<ProviderPanel />} />
          <Route path="/hcs" element={<HCSMessages />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
