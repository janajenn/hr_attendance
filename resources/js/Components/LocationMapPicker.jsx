import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function DraggableMarker({ position, setPosition }) {
    const markerRef = React.useRef(null);

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker) {
                setPosition(marker.getLatLng());
            }
        },
    };

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
}

function ClickHandler({ setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return null;
}

export default function LocationMapPicker({ lat, lng, radius = 100, onPositionChange }) {
    const [position, setPosition] = useState({ lat: Number(lat), lng: Number(lng) });

    const handlePositionChange = (newPos) => {
        setPosition(newPos);
        onPositionChange(newPos.lat, newPos.lng);
    };

    return (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={17}
            style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <ClickHandler setPosition={handlePositionChange} />
            <DraggableMarker position={position} setPosition={handlePositionChange} />
            <Circle
                center={[position.lat, position.lng]}
                radius={radius}
                pathOptions={{ color: '#09da1e', fillColor: '#10dc2b', fillOpacity: 0.2, weight: 2 }}
            />
        </MapContainer>
    );
}
