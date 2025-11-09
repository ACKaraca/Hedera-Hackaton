# 🌊 MeshFi - DePIN Platformu

**MeshFi**, Hedera Hashgraph blockchain'i üzerine kurulu, mesh wireless ağları için merkezi olmayan fiziksel altyapı (DePIN) platformudur.

## 📋 İçindekiler

- [Proje Tanımı](#proje-tanımı)
- [Teknoloji Stack'i](#teknoloji-stacki)
- [Kurulum](#kurulum)
- [Başlangıç](#başlangıç)
- [Yapı](#yapı)
- [Hedera Entegrasyonu](#hedera-entegrasyonu)

---

## 🎯 Proje Tanımı

MeshFi, mesh wireless ağlarının kurulması, yönetimi ve gözlemlenmesi için tamamen merkezi olmayan bir platform sunar. Hedera Hashgraph'ın hızlı, düşük maliyetli işlemleri sayesinde gerçek zamanlı ağ operasyonları mümkün hale getirilir.

### Temel Özellikler

- ✅ Mesh Hotspot ağlarının yönetimi
- ✅ Hedera Token Service (HTS) üzerine kurulu verimi paylaşımı
- ✅ Hedera Consensus Service (HCS) ile gerçek zamanlı veri akışı
- ✅ Cüzdan entegrasyonu (HashPack, MetaMask)
- ✅ Coğrafi tabanlı hotspot haritası

---

## 🛠️ Teknoloji Stack'i

### Backend
- **Node.js** 18+ (JavaScript runtime)
- **Express.js** (REST API framework)
- **Hedera SDK** (@hashgraph/sdk)
- **WebSocket** (Gerçek zamanlı iletişim)
- **Dotenv** (Ortam değişkenleri)

### Frontend
- **React** 18 (UI framework)
- **Axios** (HTTP client)
- **React Icons** (İkon kütüphanesi)

### Blockchain
- **Hedera Testnet** (Test ortamı)
- **Hedera Account ID**: 0.0.7221982
- **EVM Uyumlu Adres**: 0x969d0569541503653f8551a7a8e0729ae6e2b44c

---

## 📦 Kurulum

### Gereksinimler

- Node.js 18 veya üstü
- npm veya yarn
- Git

### Adımlar

#### 1. Repository'yi klonla

\`\`\`bash
git clone https://github.com/ACKaraca/Hedera-Hackaton.git
cd Hedera-Hackaton
\`\`\`

#### 2. Backend'i kur ve çalıştır

\`\`\`bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyasını yapılandır (Hedera credentials ekle)
# .env dosyası zaten mevcut, bilgileri kontrol et

# Development sunucusunu başlat
npm run dev

# Çıktı: 🚀 Backend sunucusu 3001 portunda çalışıyor
\`\`\`

#### 3. Frontend'i kur ve çalıştır

\`\`\`bash
# Yeni terminal açın
cd frontend

# Bağımlılıkları yükle
npm install

# React development sunucusunu başlat
npm start

# Tarayıcı otomatik olarak http://localhost:3000 açılacak
\`\`\`

---

## 🚀 Başlangıç

### Backend Testleri

Backend sağlıklı çalışıyor mu kontrol et:

\`\`\`bash
curl http://localhost:3001/health
# Çıktı: {"status":"OK","message":"MeshFi Backend is running","timestamp":"..."}

curl http://localhost:3001/api/v1/status
# Çıktı: {"version":"1.0.0","network":"testnet","account":"0.0.7221982"}
\`\`\`

### Frontend Testleri

Frontend'e git: http://localhost:3000

- Sistem durumu kontrol paneli görmeli
- Backend bağlantı durumu görülmelidir
- "Backend Bağlandı ✅" mesajı görülmelidir

---

## 📁 Yapı

\`\`\`
Hedora/
├── backend/
│   ├── src/
│   │   ├── config/          # Hedera client konfigürasyonu
│   │   ├── services/        # HCS, HTS, Hotspot servisleri
│   │   ├── routes/          # Express API rotaları
│   │   ├── utils/           # Yardımcı fonksiyonlar
│   │   └── index.js         # Entry point
│   ├── .env                 # Hedera credentials (gitignore'da)
│   └── package.json
│
├── frontend/
│   ├── public/              # Static dosyalar
│   ├── src/
│   │   ├── components/      # React bileşenleri
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API ve WebSocket servisleri
│   │   ├── App.js           # Ana bileşen
│   │   └── index.js         # Entry point
│   ├── .env                 # Frontend konfigürasyonu
│   └── package.json
│
├── docs/                    # Dokümantasyon
├── .gitignore               # Git'ten hariç dosyalar
└── README.md                # Bu dosya
\`\`\`

---

## ⛓️ Hedera Entegrasyonu

### Yapılandırma

Hedera kimlik bilgileri \`backend/.env\` dosyasında saklanır:

\`\`\`env
MY_ACCOUNT_ID=0.0.7221982
MY_PRIVATE_KEY=e5db195ae1ba131a102416d3a46cbc92c5fbd209d42016bf94e26d41ef1b4f09
PRIVATE_KEY_DER=3030020100300706052b8104000a04220420e5db195ae1ba131a102416d3a46cbc92c5fbd209d42016bf94e26d41ef1b4f09
PUBLIC_KEY_DER=302d300706052b8104000a032200028bc6923e231b815e1c47532da4bf71599b78375c471034e0561029f806ab5149
EVM_ADDRESS=0x969d0569541503653f8551a7a8e0729ae6e2b44c
HCS_TOPIC_ID=0.0.7225007
MESH_TOKEN_ID=
HEDERA_NETWORK=testnet
\`\`\`
> **Not**: Backend otomatik olarak private key tipini (ECDSA/ED25519) algılar ve `PUBLIC_KEY_DER` değeriyle eşleştirir.
> Anahtarları Hedera Portal'dan kopyalarken hem ham hex değerini hem de DER sürümünü sakladığınızdan emin olun.
> HCS mesaj gönderim adımlarının tamamı için [Submit Your First Message](https://docs.hedera.com/hedera/tutorials/consensus/submit-your-first-message) rehberini inceleyebilirsiniz.

### Hedera Testnet

- **Portal**: https://portal.hedera.com
- **Faucet**: Testnet hesabına HBAR tahsisi için
- **Explorer**: https://testnet.hashscan.io/

---

## 🔐 Güvenlik

⚠️ **Önemli**: Hiçbir zaman private key'leri repository'ye commit etmeyin!

- `.env` dosyası otomatik olarak `.gitignore`'da
- Private key'ler sadece sunucu ortamında kullanılmalı
- Production'da secret management service kullan (AWS Secrets Manager vb.)

---

## 📝 Geliştirme

### Yeni Backend Route Eklemek

\`\`\`javascript
// backend/src/index.js
app.get('/api/v1/hotspots', (req, res) => {
  // Hotspot listesi döndür
  res.json({ hotspots: [] });
});
\`\`\`

### Yeni Frontend Component Oluşturmak

\`\`\`javascript
// frontend/src/components/HotspotMap.jsx
import React from 'react';

export const HotspotMap = () => {
  return <div>Harita Bileşeni</div>;
};
\`\`\`

---

## 🐛 Sorun Giderme

| Problem | Çözüm |
|---------|-------|
| Backend başlamazsa | `npm cache clean --force` ve tekrar `npm install` yap |
| Frontend hataları | Node.js sürümünü kontrol et (>=18) |
| CORS hatası | Backend'de CORS middleware doğru yapılandırıldığını kontrol et |
| Hedera bağlantı hatası | `.env` dosyasında account ID ve private key doğru mu kontrol et |

---

## 📞 İletişim

**GitHub**: https://github.com/ACKaraca/Hedera-Hackaton

---

**Son Güncelleme**: 9 Kasım 2025  
**Versiyon**: 1.0.0
