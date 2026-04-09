import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons (though we're using custom ones, but keep for safety)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom pulsing green marker
const createPulsingMarker = () => {
    return L.divIcon({
        className: 'custom-pulsing-marker',
        html: `<div class="relative">
                <div class="w-6 h-6 bg-green-500 rounded-full animate-ping absolute opacity-75"></div>
                <div class="w-6 h-6 bg-green-600 rounded-full relative"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

export default function WelcomeMap({ center = [8.521279, 124.574188], zoom = 15 }) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100vh', width: '100vw' }}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={center} icon={createPulsingMarker()} />
        </MapContainer>
    );
}
