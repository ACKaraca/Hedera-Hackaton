import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Temel route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MeshFi Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API version endpoint
app.get('/api/v1/status', (req, res) => {
  res.json({
    version: '1.0.0',
    network: process.env.HEDERA_NETWORK || 'testnet',
    account: process.env.MY_ACCOUNT_ID || 'Not configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend sunucusu ${PORT} portunda çalışıyor`);
  console.log(`📡 Hedera Ağı: ${process.env.HEDERA_NETWORK || 'testnet'}`);
});
