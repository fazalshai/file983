import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import Header from "./Header";
import Admin from "./Admin"; // import at top
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-[Orbitron]">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />

          {/* Optional future routes */}
          <Route path="/analytics" element={<div className="p-8 text-center text-xl">📊 Analytics coming soon...</div>} />
          <Route path="/about" element={<div className="p-8 text-center text-xl">📘 About FileHub 2100</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
