import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Log } from "../utils/logger";

function RedirectPage() {
  const { code } = useParams();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortenedLinks") || "[]");
    const match = saved.find((entry) => entry.shortcode === code);

    if (match && Date.now() < match.expiresAt) {
      Log(
        "frontend",
        "info",
        "handler",
        `Redirecting ${code} to ${match.originalUrl}`
      );

      // Track clicks
      const updatedClicks = JSON.parse(
        localStorage.getItem("clickStats") || "{}"
      );
      if (updatedClicks[code]) {
        updatedClicks[code].count += 1;
        updatedClicks[code].logs.push({
          time: Date.now(),
          source: document.referrer || "direct",
          location: "unknown", // You can simulate if needed
        });
      } else {
        updatedClicks[code] = {
          count: 1,
          logs: [
            {
              time: Date.now(),
              source: document.referrer || "direct",
              location: "unknown",
            },
          ],
        };
      }

      localStorage.setItem("clickStats", JSON.stringify(updatedClicks));

      window.location.href = match.originalUrl;
    } else {
      Log("frontend", "error", "handler", `Expired or invalid code: ${code}`);
      document.body.innerHTML = "<h2>Link expired or not found.</h2>";
    }
  }, [code]);
  

  return <div>Redirecting...</div>;
}

export default RedirectPage;
