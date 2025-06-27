import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";


function URLStats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("shortenedLinks") || "[]");
    const clicks = JSON.parse(localStorage.getItem("clickStats") || "{}");

    const formatted = links.map((item) => {
      const stats = clicks[item.shortcode] || { count: 0, logs: [] };
      const expiryLeft = item.expiresAt - Date.now();
      return {
        long: item.originalUrl,
        short: item.shortcode,
        expiry:
          expiryLeft > 0 ? `${Math.floor(expiryLeft / 60000)} min` : "Expired",
        clicks: stats.count,
        logs: stats.logs || [],
      };
    });    

    setData(formatted);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Shortened URL Stats</Typography>
      {data.length === 0 ? (
        <Typography mt={2}>No data available.</Typography>
      ) : (
        data.map((item, i) => (
          <Box
            key={i}
            mt={2}
            p={2}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: item.expiry === "Expired" ? "#ffe6e6" : "white",
            }}
          >
            <Typography>
              <strong>Original:</strong> {item.long}
            </Typography>
            <Typography>
              <strong>Short:</strong> http://localhost:3000/{item.short}
            </Typography>
            <Typography>
              <strong>Expires in:</strong> {item.expiry}
            </Typography>
            <Typography>
              <strong>Clicks:</strong> {item.clicks}
            </Typography>
            {item.expiry === "Expired" && (
              <Typography color="error">This link has expired.</Typography>
            )}
            <Typography>
              <strong>Click Logs:</strong>
            </Typography>
            <ul>
              {item.logs.map((log, idx) => (
                <li key={idx}>
                  Time: {new Date(log.time).toLocaleString()}, Source:{" "}
                  {log.source}, Location: {log.location}
                </li>
              ))}
            </ul>
          </Box>
        ))
      )}
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        sx={{ mt: 3 }}
      >
        Clear All Data
      </Button>
    </Box>
  );
}

export default URLStats;
