import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MapComponent from "./components/MapComponent";
import ControlPanel from "./components/ControlPanel";
import "./styles.css";

function App() {
  const [data, setData] = useState([]);
  const [lat, setLat] = useState(37.7749);
  const [lon, setLon] = useState(-122.4194);
  const [time, setTime] = useState(new Date().toISOString());

  const fetchData = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/data", {
        params: { lat, lon, time },
      })
      .then((response) => {
        console.log("Response data:", response.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [lat, lon, time]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <div className="header">
        <h1>San Francisco Crime Heatmap</h1>
      </div>
      <div className="map-container-wrapper">
        <ControlPanel
          lat={lat}
          setLat={setLat}
          lon={lon}
          setLon={setLon}
          time={time}
          setTime={setTime}
          fetchData={fetchData}
        />
        <MapComponent data={data} setLat={setLat} setLon={setLon} />
      </div>
    </div>
  );
}

export default App;
