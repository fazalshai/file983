import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Toast from "./Toast";

export default function Search() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSearch = async () => {
    if (code.trim().length !== 6 || isNaN(code)) {
      setResult(null);
      triggerToast("Enter a valid 6-digit code", "error");
      return;
    }

    try {
      const res = await fetch(`https://filehub-gyll.onrender.com/api/uploads/${code}`);
      if (res.status === 404) {
        setResult(null);
        triggerToast("No file found for this code.", "warning");
        return;
      }

      const data = await res.json();
      setResult(data);
      triggerToast("File found successfully!", "success");
    } catch (error) {
      console.error(error);
      triggerToast("Error searching for file", "error");
    }
  };

  const triggerToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleView = (fileUrl) => {
  window.open(fileUrl, "_blank");
};

const handleDownload = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  a.click();
};


 

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen px-4 pt-24 font-[Orbitron] relative">
      {/* Toast */}
      <div className="fixed top-24 right-6 z-50">
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-[#27002a] to-[#3e005c] rounded-xl py-4 text-center shadow-md">
          🔍 Need help finding files? FileHub AI Search will assist you!
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <div className="hidden md:block">
          <div className="bg-[#1c1c1c] text-sm rounded-xl px-4 py-16 text-center shadow-inner">
            🧾 Side Ad <br /> Ultra  pro Search Powered by Quantum AI
          </div>
        </div>

        <div className="md:col-span-3 text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Search Your Files
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Enter the 6-digit code provided at upload to access your file.
          </p>

          <div className="flex justify-center mt-6">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="w-full sm:w-2/3 px-5 py-3 rounded-lg bg-gray-900 border-2 border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-center tracking-widest text-lg text-white"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {!result && code.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-left bg-[#111111] border border-gray-800 rounded-xl p-6 shadow-md w-full sm:w-2/3 mx-auto"
            >
              <p className="text-sm text-gray-400 mb-2">🔍 Example Result:</p>
              <p className="text-base sm:text-lg">
                <span className="text-gray-400">Name:</span>{" "}
                <span className="text-white">John Doe</span>
              </p>
              <p className="text-base sm:text-lg">
                <span className="text-gray-400">File:</span>{" "}
                <span className="text-white">sample_document.pdf</span>
              </p>
              <div className="flex gap-4 mt-4 justify-center">
                <button className="p-3 bg-gray-800 text-blue-400 rounded-full shadow">
                  <i className="fas fa-eye text-xl"></i>
                </button>
                <button className="p-3 bg-gray-800 text-green-400 rounded-full shadow">
                  <i className="fas fa-download text-xl"></i>
                </button>
              </div>
            </motion.div>
          )}

          {result && (
            <div className="relative mt-10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-75 animate-pulse"></div>

              <div className="relative bg-[#101010] border border-gray-800 p-6 rounded-xl shadow-xl overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-lg sm:text-xl font-semibold">
                    <span className="text-gray-400">Name:</span>{" "}
                    <span className="text-white">{result.name}</span>
                  </p>

                  {result.files?.map((f, index) => (
                    <div key={index} className="border-t pt-3">
                      <p className="text-base">
                        <span className="text-gray-400">File:</span>{" "}
                        <span className="text-white">{f.originalName}</span>
                      </p>
                      <div className="flex gap-4 mt-2 justify-center">
                        <button
  onClick={() => handleView(f.url)}
  className="p-3 bg-gray-800 hover:bg-gray-700 text-blue-500 rounded-full transition shadow-md"
>
  <i className="fas fa-eye text-xl"></i>
</button>
<button
  onClick={() => handleDownload(f.url, f.name)}
  className="p-3 bg-gray-800 hover:bg-gray-700 text-green-500 rounded-full transition shadow-md"
>
  <i className="fas fa-download text-xl"></i>
</button>

                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <div className="bg-[#1c1c1c] text-sm rounded-xl px-4 py-16 text-center shadow-inner">
            📡 Ads by FileHub <br /> Store & Find Like a Pro!
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <div className="bg-gradient-to-r from-[#2a005f] to-[#37004a] rounded-xl py-4 text-center shadow-md">
          📁 Want full history access? Enable Admin Mode in settings!
        </div>
      </div>
    </div>
  );
}
