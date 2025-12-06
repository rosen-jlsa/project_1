"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon missing in Leaflet + Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapProps {
    pos: [number, number];
    zoom?: number;
}

const Map = ({ pos, zoom = 15 }: MapProps) => {
    // Default to Burgas coordinates if pos is not provided or is default
    const centerPos: [number, number] = [42.5200, 27.4508];

    return (
        <MapContainer
            center={centerPos}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-[300px] w-full rounded-lg shadow-md z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={centerPos} icon={icon}>
                <Popup>
                    Luxe Salon <br /> g.k. Petko R. Slaveykov, bl. 78 <br /> Burgas, Bulgaria
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
