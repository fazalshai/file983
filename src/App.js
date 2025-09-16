import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./Home";
import Search from "./Search";
import Header from "./Header";
import Admin from "./Admin";
import Analysis from "./analytics";
import AboutUs from "./about";
import DataDump from "./data";

import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Log each page view to Firebase Analytics
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/analytics" element={<Analysis />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/data" element={<DataDump />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-[Orbitron]">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
