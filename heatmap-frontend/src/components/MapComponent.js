import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

const MapComponent = ({ data, setLat, setLon }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
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
          { radius: 25 }
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
    </MapContainer>
  );
};

export default MapComponent;
