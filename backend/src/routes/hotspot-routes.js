import express from 'express';
import {
  getAllHotspots,
  getHotspotById,
  createHotspot,
  updateHotspot,
  deleteHotspot
} from '../services/hotspot-service.js';

const router = express.Router();

// GET /api/hotspots - Tüm hotspot'ları getir
router.get('/', (req, res) => {
  try {
    const hotspots = getAllHotspots();
    res.json({ count: hotspots.length, hotspots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hotspots/:id - Tek hotspot
router.get('/:id', (req, res) => {
  try {
    const hotspot = getHotspotById(req.params.id);

    if (!hotspot) {
      return res.status(404).json({ error: 'Hotspot not found' });
    }

    res.json(hotspot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/hotspots - Yeni hotspot
router.post('/', (req, res) => {
  try {
    const hotspot = createHotspot(req.body);
    res.status(201).json(hotspot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/hotspots/:id - Güncelle
router.patch('/:id', (req, res) => {
  try {
    const hotspot = updateHotspot(req.params.id, req.body);
    res.json(hotspot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/hotspots/:id - Sil
router.delete('/:id', (req, res) => {
  try {
    const hotspot = deleteHotspot(req.params.id);
    res.json({ message: 'Hotspot deleted', hotspot });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

