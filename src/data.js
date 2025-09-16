import React, { useEffect, useState } from "react";

export default function DataDump() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await fetch("https://filehub-gyll.onrender.com/api/uploads");
        const data = await res.json();
        const publicFiles = data.filter((upload) => upload.name.startsWith("~~"));
        setUploads(publicFiles);
      } catch (err) {
        console.error("Error fetching uploads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-[Orbitron] px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-fuchsia-500 mb-8">
        Public Files
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Go to the Search tab and paste the code to access the file.
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : uploads.length === 0 ? (
        <p className="text-center text-gray-500">No public files available.</p>
      ) : (
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full border border-gray-700 bg-[#111111] rounded-xl text-sm">
            <thead className="bg-[#1f1f1f] text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">File Name(s)</th>
                <th className="px-4 py-3 text-left">Code</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => {
                const type = upload.name.replace(/^~~/, "").trim() || "Uncategorized";
                const fileNames = upload.files.map((f) => f.name).join(", ");
                return (
                  <tr key={upload.code} className="border-b border-gray-700 hover:bg-[#181818]">
                    <td className="px-4 py-3">{type}</td>
                    <td className="px-4 py-3 text-white">{fileNames}</td>
                    <td className="px-4 py-3 text-fuchsia-400 font-semibold">{upload.code}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
