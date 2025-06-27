import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import URLShortenerForm from "./components/URLShortenerForm";
import URLStats from "./components/URLStats";
import RedirectPage from "./pages/RedirectPage";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/stats">
            Stats
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<URLShortenerForm />} />
        <Route path="/stats" element={<URLStats />} />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
