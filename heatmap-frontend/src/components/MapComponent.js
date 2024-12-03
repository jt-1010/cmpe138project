import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  useMap,
  Marker,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Define a custom icon for the marker
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MapComponent = ({ data, setLat, setLon }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [circlePosition, setCirclePosition] = useState(null);
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
        setMarkerPosition(e.latlng); // For Marker
        setCirclePosition(e.latlng); // For Circle
      },
    });
    return null;
  };

  const HeatmapLayer = ({ points }) => {
    const map = useMap();

    useEffect(() => {
      if (!map) return; // Ensure map is defined

      try {
        const heatLayer = L.heatLayer(
          points.map((point) => [point.latitude, point.longitude, point.value]),
          {
            radius: 20, // Increase the radius for more accuracy
            blur: 15, // Adjust the blur for better visualization
            maxZoom: 17, // Adjust the maxZoom for better accuracy
          }
        ).addTo(map);

        return () => {
          map.removeLayer(heatLayer);
        };
      } catch (error) {
        console.error("Error creating heatmap layer:", error);
      }
    }, [points, map]);

    return null;
  };

  // Define the bounds for San Francisco with tighter left and top sides
  const bounds = [
    [37.7, -122.5155], // Southwest corner (tightened left and top sides)
    [37.81, -122.35], // Northeast corner
  ];

  return (
    <MapContainer
      className="map-container"
      center={[37.7749, -122.4194]}
      zoom={13}
      minZoom={12} // Set minimum zoom level
      maxZoom={16} // Set maximum zoom level (reduced)
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatmapLayer points={data} />
      <MapClickHandler />
      {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
      {circlePosition && <Circle center={circlePosition} radius={1100} />}
    </MapContainer>
  );
};

export default MapComponent;
