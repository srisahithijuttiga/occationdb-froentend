import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import ThemePageRouter from "./pages/ThemePageRouter";
const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* ✅ User Journey */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/theme/:personId" element={<ThemePageRouter />} />
        <Route path="/surprise/:personId" element={<SurpriseLandingPage />} />
        <Route path="/cake/:personId" element={<CakeOrCardRouter />} />
        <Route path="/gallery/:personId" element={<GalleryPage />} />
        <Route path="/surprise/final/:personId" element={<SurprisePage />} />
        <Route path="/final/:personId" element={<SurpriseEndPage />} />

        {/* 🔐 Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/gallery/:personId/manage" element={<GalleryManager />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
