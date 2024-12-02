import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MapComponent from "./components/MapComponent";
import ControlPanel from "./components/ControlPanel";
import "./styles.css";

function App() {
  const [data, setData] = useState([]);
  const [lat, setLat] = useState(37.7749);
  const [lon, setLon] = useState(-122.4194);
  const [startTime, setStartTime] = useState(new Date().toISOString());
  const [endTime, setEndTime] = useState(new Date().toISOString());

  const fetchData = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/data", {
        params: { lat, lon, start_time: startTime, end_time: endTime },
      })
      .then((response) => {
        console.log("Response data:", response.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [lat, lon, startTime, endTime]);

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
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          fetchData={fetchData}
        />
        <MapComponent data={data} setLat={setLat} setLon={setLon} />
      </div>
    </div>
  );
}

export default App;