import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Log } from "../utils/logger";
import DeleteIcon from "@mui/icons-material/Delete";

function URLShortenerForm() {
  const [urlList, setUrlList] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleInputChange = (index, field, value) => {
    const updated = [...urlList];
    updated[index][field] = value;
    setUrlList(updated);
  };

  const validateUrl = (url) => /^https?:\/\/.+\..+/.test(url);

  const validateInputs = ({ url, validity, shortcode }) => {
    if (!validateUrl(url)) {
      alert("Please enter a valid URL (including http/https).");
      return false;
    }
    if (validity && (isNaN(validity) || Number(validity) <= 0)) {
      alert("Validity must be a positive number.");
      return false;
    }
    if (shortcode && !/^[a-zA-Z0-9-_]{4,12}$/.test(shortcode)) {
      alert("Shortcode must be 4-12 characters (alphanumeric, - or _).");
      return false;
    }
    return true;
  };

  const handleShorten = () => {
    const results = [];

    for (const entry of urlList) {
      if (!validateInputs(entry)) {
        Log("frontend", "error", "handler", "Validation failed for entry");
        return;
      }

      const result = {
        shortcode:
          entry.shortcode || Math.random().toString(36).substring(2, 8),
        originalUrl: entry.url,
        expiresAt: Date.now() + (entry.validity || 30) * 60 * 1000, // validity in ms
      };

      results.push(result);
    }
    const updatedUrls = [...shortenedUrls, ...results];
    setShortenedUrls(updatedUrls);
    localStorage.setItem("shortenedLinks", JSON.stringify(updatedUrls));

    Log("frontend", "info", "handler", "URLs shortened successfully");

    // Optional: Reset input list
    setUrlList([{ url: "", validity: "", shortcode: "" }]);
  };

  const handleAddURL = () => {
    if (urlList.length >= 5) return;
    setUrlList([...urlList, { url: "", validity: "", shortcode: "" }]);
  };

  const handleRemoveURL = (index) => {
    const updated = [...urlList];
    updated.splice(index, 1);
    setUrlList(updated);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shorten URLs (Max 5)
      </Typography>

      {urlList.map((entry, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Long URL"
                fullWidth
                value={entry.url}
                onChange={(e) =>
                  handleInputChange(index, "url", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Validity (minutes)"
                type="number"
                fullWidth
                value={entry.validity}
                onChange={(e) =>
                  handleInputChange(index, "validity", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Custom Shortcode (optional)"
                fullWidth
                value={entry.shortcode}
                onChange={(e) =>
                  handleInputChange(index, "shortcode", e.target.value)
                }
              />
            </Grid>
          </Grid>

          {urlList.length > 1 && (
            <IconButton
              onClick={() => handleRemoveURL(index)}
              sx={{ position: "absolute", top: 5, right: 5 }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Box mb={2}>
        <Button
          onClick={handleAddURL}
          disabled={urlList.length >= 5}
          sx={{ mr: 2 }}
        >
          + Add More
        </Button>
        <Button variant="contained" color="primary" onClick={handleShorten}>
          Shorten All
        </Button>
      </Box>

      {shortenedUrls.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {shortenedUrls.map((item, idx) => (
            <Box
              key={idx}
              sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography>
                <strong>Original:</strong> {item.originalUrl}
              </Typography>
              <Typography>
                <strong>Short:</strong> http://localhost:3000/{item.shortcode}
              </Typography>
              <Typography>
                <strong>Expires At:</strong>{" "}
                {new Date(item.expiresAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default URLShortenerForm;