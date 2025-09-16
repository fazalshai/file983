import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [uploads, setUploads] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState(""); // "main" or "team"

  useEffect(() => {
    if (authenticated) {
      fetchUploads();
    }
  }, [authenticated]);

  const fetchUploads = async () => {
    try {
      const res = await fetch("https://filehub-gyll.onrender.com/api/uploads");
      const data = await res.json();
      setUploads(data);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "fazal" && password === "983") {
      setAuthenticated(true);
      setRole("main");
      setError("");
    } else if (username === "team" && password === "team") {
      setAuthenticated(true);
      setRole("team");
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;
    try {
      const res = await fetch(`https://filehub-gyll.onrender.com/api/uploads/${code}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("✅ File deleted successfully");
        fetchUploads(); // Refresh list
      } else {
        alert("❌ Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting file");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[Orbitron]">
        <form onSubmit={handleLogin} className="bg-[#111111] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-fuchsia-400">🔐 Admin Login</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block mb-1 text-sm text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-fuchsia-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-fuchsia-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-md text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

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
              {role === "main" && <th className="px-4 py-3">Code</th>}
              <th className="px-4 py-3">File Name(s)</th>
              <th className="px-4 py-3">Uploaded By</th>
              {role === "main" && (
                <>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {uploads.length === 0 ? (
              <tr>
                <td colSpan={role === "main" ? 6 : 2} className="text-center px-4 py-6 text-gray-500">
                  No uploads found.
                </td>
              </tr>
            ) : (
              uploads.map((upload) => (
                <tr key={upload.code} className="border-b border-gray-700 hover:bg-[#181818] transition">
                  {role === "main" && (
                    <td className="px-4 py-3 text-xs text-gray-400">{upload.code}</td>
                  )}
                  <td className="px-4 py-3 font-medium text-white">
                    {upload.files.map((f) => f.name).join(", ")}
                  </td>
                  <td className="px-4 py-3">{upload.name}</td>
                  {role === "main" && (
                    <>
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
                        <button
                          onClick={() => handleDelete(upload.code)}
                          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
