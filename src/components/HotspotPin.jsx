import { Marker } from 'react-leaflet';
import L from 'leaflet';

function createIcon(selected, clients) {
  const size = selected ? 44 : 36;
  const bg = selected ? '#6366f1' : '#0ea5e9';
  const glow = selected ? 'drop-shadow(0 0 8px #6366f1aa)' : 'drop-shadow(0 0 4px #0ea5e988)';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="${bg}" opacity="0.15"/>
      <circle cx="22" cy="22" r="16" fill="${bg}"/>
      <g fill="white" transform="translate(22,22)">
        <circle cx="0" cy="4" r="2.5"/>
        <path d="M-5.5,0 Q0,-5.5 5.5,0" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-9.5,-4 Q0,-12 9.5,-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`;
  const badgeColor = clients <= 3 ? '#10b981' : clients <= 6 ? '#f59e0b' : '#ef4444';
  const badge = `<div style="position:absolute;top:-6px;right:-6px;background:${badgeColor};color:white;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid #0f172a;font-family:sans-serif;line-height:1">${clients}</div>`;
  return L.divIcon({
    html: `<div style="position:relative;filter:${glow}">${svg}${badge}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function HotspotPin({ hotspot, clients, selected, onSelect }) {
  return (
    <Marker
      position={[hotspot.lat, hotspot.lng]}
      icon={createIcon(selected, clients)}
      eventHandlers={{ click: () => onSelect(hotspot) }}
    />
  );
}
