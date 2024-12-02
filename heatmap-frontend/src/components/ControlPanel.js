import React from "react";

const ControlPanel = ({
  lat,
  setLat,
  lon,
  setLon,
  time,
  setTime,
  fetchData,
}) => {
  // Format the date to match the required format for the datetime-local input type
  const formatDate = (date) => {
    const d = new Date(date);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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
        Time:
        <input
          type="datetime-local"
          value={formatDate(time)}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

export default ControlPanel;
