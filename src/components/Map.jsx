import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HotspotPin from './HotspotPin';
import { HOTSPOTS } from '../config/hotspots';

const CENTER = [41.6941, 44.8033];
const ZOOM = 15;

// Stable random client counts per hotspot (1–10), generated once
const CLIENT_COUNTS = Object.fromEntries(
  HOTSPOTS.map(h => [h.id, Math.floor(Math.random() * 10) + 1])
);

export default function Map({ selectedHotspot, onSelectHotspot }) {
  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {HOTSPOTS.map(hotspot => (
        <HotspotPin
          key={hotspot.id}
          hotspot={hotspot}
          clients={CLIENT_COUNTS[hotspot.id]}
          selected={selectedHotspot?.id === hotspot.id}
          onSelect={(h) => onSelectHotspot({ ...h, clients: CLIENT_COUNTS[h.id] })}
        />
      ))}
    </MapContainer>
  );
}
