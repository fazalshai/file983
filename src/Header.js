import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navItems = [
    { name: "Upload", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Analytics", path: "/analytics" },
    { name: "About Us", path: "/about" },

  ];

  return (
    <header className="w-full px-6 py-4 bg-gradient-to-r from-[#16001f] to-[#1a0431] shadow-md font-[Orbitron] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
        {/* Logo */}
        <div className="flex items-center text-white text-2xl font-bold tracking-wider mb-2 sm:mb-0">
           FileHub <span className="text-fuchsia-400 ml-1"></span>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-6 text-white text-sm sm:text-base font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}gcloud storage buckets list

              to={item.path}
              className={`hover:text-fuchsia-400 transition ${
                location.pathname === item.path ? "text-fuchsia-500" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
