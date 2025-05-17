import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await fetch("https://filehub-gyll.onrender.com/api/uploads"); // update if needed
        const data = await res.json();
        setUploads(data);
      } catch (err) {
        console.error("Failed to fetch uploads", err);   
      }
      
    };

    fetchUploads();
  }, []);

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[Orbitron] px-8 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-8"
      >
        Admin Dashboard 📊
      </motion.h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700 bg-[#111111] rounded-xl overflow-hidden">
          <thead className="text-gray-400 uppercase bg-[#1f1f1f] border-b border-gray-700">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">File Name(s)</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-500">
                  No uploads found.
                </td>
              </tr>
            ) : (
              uploads.map((upload) => (
                <tr
                  key={upload.code}
                  className="border-b border-gray-700 hover:bg-[#181818] transition"
                >
                  <td className="px-4 py-3 text-xs text-gray-400">{upload.code}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {upload.files.map((f) => f.name).join(", ")}
                  </td>
                  <td className="px-4 py-3">{upload.name}</td>
                  <td className="px-4 py-3">{(upload.size / 1024 / 1024).toFixed(1)} MB</td>
                  <td className="px-4 py-3">{new Date(upload.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    {upload.files.map((f, i) => (
                      <div key={i} className="flex justify-center gap-2 mb-1">
                        <button
                          onClick={() => handleView(f.url)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(f.url, f.name)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-full text-xs"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
