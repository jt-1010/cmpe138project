import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);

  // Fetch data from FastAPI back-end
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        console.log("Response data:", response.data);
        setItems(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // WebSocket connection
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
      // Handle real-time updates here
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>Items</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
        <h1>hi</h1>
      </ul>
      {console.log("Items state:", items)}
    </div>
  );
}

export default App;
