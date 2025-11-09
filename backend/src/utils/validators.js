export function isValidCoordinate(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function validateHotspot(hotspot) {
  if (!hotspot.name || hotspot.name.trim().length === 0) {
    throw new Error('Hotspot name is required');
  }

  if (!hotspot.location || !isValidCoordinate(hotspot.location.lat, hotspot.location.lon)) {
    throw new Error('Invalid hotspot coordinates');
  }

  if (!hotspot.owner) {
    throw new Error('Hotspot owner is required');
  }

  return true;
}

