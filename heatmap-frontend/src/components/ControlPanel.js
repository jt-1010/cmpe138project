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
  const [category, setCategory] = useState("");

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
      fetchClusteredData(category);
    } else {
      fetchData(category);
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
      <label>
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="ARSON">ARSON</option>
          <option value="ASSAULT">ASSAULT</option>
          <option value="BAD CHECKS">BAD CHECKS</option>
          <option value="BRIBERY">BRIBERY</option>
          <option value="BURGLARY">BURGLARY</option>
          <option value="DISORDERLY CONDUCT">DISORDERLY CONDUCT</option>
          <option value="DRIVING UNDER THE INFLUENCE">DRIVING UNDER THE INFLUENCE</option>
          <option value="DRUG/NARCOTIC">DRUG/NARCOTIC</option>
          <option value="DRUNKENNESS">DRUNKENNESS</option>
          <option value="EMBEZZLEMENT">EMBEZZLEMENT</option>
          <option value="EXTORTION">EXTORTION</option>
          <option value="FAMILY OFFENSES">FAMILY OFFENSES</option>
          <option value="FORGERY/COUNTERFEITING">FORGERY/COUNTERFEITING</option>
          <option value="FRAUD">FRAUD</option>
          <option value="GAMBLING">GAMBLING</option>
          <option value="KIDNAPPING">KIDNAPPING</option>
          <option value="LARCENY/THEFT">LARCENY/THEFT</option>
          <option value="LIQUOR LAWS">LIQUOR LAWS</option>
          <option value="LOITERING">LOITERING</option>
          <option value="MISSING PERSON">MISSING PERSON</option>
          <option value="OTHER OFFENSES">OTHER OFFENSES</option>
          <option value="PORNOGRAPHY/OBSCENE MAT">PORNOGRAPHY/OBSCENE MAT</option>
          <option value="PROSTITUTION">PROSTITUTION</option>
          <option value="RECOVERED VEHICLE">RECOVERED VEHICLE</option>
          <option value="ROBBERY">ROBBERY</option>
          <option value="RUNAWAY">RUNAWAY</option>
          <option value="SECONDARY CODES">SECONDARY CODES</option>
          <option value="SEX OFFENSES, FORCIBLE">SEX OFFENSES, FORCIBLE</option>
          <option value="SEX OFFENSES, NON FORCIBLE">SEX OFFENSES, NON FORCIBLE</option>
          <option value="STOLEN PROPERTY">STOLEN PROPERTY</option>
          <option value="SUICIDE">SUICIDE</option>
          <option value="SUSPICIOUS OCC">SUSPICIOUS OCC</option>
          <option value="TREA">TREA</option>
          <option value="TRESPASS">TRESPASS</option>
          <option value="VANDALISM">VANDALISM</option>
          <option value="VEHICLE THEFT">VEHICLE THEFT</option>
          <option value="WARRANTS">WARRANTS</option>
          <option value="WEAPON LAWS">WEAPON LAWS</option>
        </select>
      </label>
      <button onClick={handleFetchData}>Fetch Data</button>
    </div>
  );
};

export default ControlPanel;