import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GalleryManager from "./pages/GalleryManager";

// User Journey Pages
import SurpriseLandingPage from "./pages/SurpriseLandingPage";
import CakeOrCardRouter from "./components/CakeOrCardRouter";
import GalleryPage from "./pages/GalleryPage";
import SurprisePage from "./pages/SurprisePage";
import SurpriseEndPage from "./pages/SurpriseEndPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/gallery/:personId/manage" element={<GalleryManager />} />

        {/* User Journey */}
        <Route path="/surprise/:personId" element={<SurpriseLandingPage />} />
        <Route path="/cake/:personId" element={<CakeOrCardRouter />} />
        <Route path="/gallery/:personId" element={<GalleryPage />} />
        <Route path="/surprise/final/:personId" element={<SurprisePage />} />
        <Route path="/final/:personId" element={<SurpriseEndPage />} />
      </Routes>
    </Router>
  );
};

export default App;
