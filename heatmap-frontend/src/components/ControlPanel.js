import React, { useState } from "react";

const ControlPanel = ({
  lat,
  setLat,
  lon,
  setLon,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  fetchData,
  fetchClusteredData,
}) => {
  const [queryType, setQueryType] = useState("unclustered");

  // Format the date to match the required format for the datetime-local input type
  const formatDate = (date) => {
    const d = new Date(date);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleFetchData = () => {
    if (queryType === "clustered") {
      fetchClusteredData();
    } else {
      fetchData();
    }
  };

  return (
    <div className="control-panel">
      <label>
        Latitude:
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
      </label>
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={formatDate(startTime)}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time:
        <input
          type="datetime-local"
          value={formatDate(endTime)}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <label>
        Query Type:
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
        >
          <option value="unclustered">Unclustered</option>
          <option value="clustered">Clustered</option>
        </select>
      </label>
      <button onClick={handleFetchData}>Fetch Data</button>
    </div>
  );
};

export default ControlPanel;
