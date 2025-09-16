import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, analytics } from "./firebase"; // added analytics import
import { logEvent } from "firebase/analytics"; // import logEvent

export default function Home() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [showTopBanner, setShowTopBanner] = useState(true);
  const [showLeftBanner, setShowLeftBanner] = useState(true);
  const [showRightBanner, setShowRightBanner] = useState(true);
  const [showBottomBanner, setShowBottomBanner] = useState(true);

  // Changed from 100MB to 1GB (1024 MB)
  const MAX_TOTAL_SIZE = 1024 * 1024 * 1024;

  const onDrop = (acceptedFiles) => {
    const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      // Updated error message
      triggerToast("❌ Total upload limit is 1GB", "error");
      return;
    }
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 10,
    accept: { "*/*": [] },
  });

  // UPDATED: toast with configurable duration (default 15s)
  // UPDATED: keep duration in toast state so we can pass it down
const triggerToast = (message, type = "info", duration = 15000) => {
  setToast({ message, type, duration });
  setTimeout(() => setToast(null), duration); // you can keep this if you like
};


  const handleSubmit = async () => {
    if (name.trim() === "" || files.length === 0) {
      triggerToast("❌ Please enter your name and upload at least one file", "error");
      return;
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      // Updated error message
      triggerToast("❌ Total size exceeds 1GB", "error");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const uploadedFiles = [];
    setLoading(true);
    setProgress(0);

    try {
      for (const file of files) {
        await new Promise((resolve, reject) => {
          const storageRef = ref(storage, `uploads/${code}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const overallPercent = ((uploadedFiles.length + percent / 100) / files.length) * 100;
              setProgress(Math.floor(overallPercent));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedFiles.push({ name: file.name, url });
              resolve();
            }
          );
        });
      }

      if (uploadedFiles.length === 0) {
        triggerToast("❌ No files uploaded", "error");
        setLoading(false);
        return;
      }

      const res = await fetch("https://filehub-gyll.onrender.com/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          files: uploadedFiles,
          code,
          size: totalSize,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        // Log upload event to Firebase Analytics here:
        logEvent(analytics, "file_upload", {
          file_count: files.length,
          total_size_mb: (totalSize / 1024 / 1024).toFixed(2),
          uploader_name: name,
        });

        // REMOVED: navigator.clipboard.writeText(code) to avoid Allow/Block prompt
        // Show the code in the toast for ~15s
        triggerToast(`✅ Upload successful! Your code: ${code}`, "success", 15000);
        setFiles([]);
        setName("");
      } else {
        console.error(result);
        triggerToast("❌ Upload failed", "error");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      triggerToast("❌ Upload error", "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // === Banner data - edit only here to change banners ===
  const bannerAds = [
    {
      href: "https://www.w3schools.com/html/default.asp",
      img: "https://tpc.googlesyndication.com/simgad/9379794023110126497",
      alt: "W3Schools Banner",
      logoOnly: true,
    },
  ];

  const sideBanners = {
    left: {
      href: "https://example.com/left",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Left Banner",
    },
    right: {
      href: "https://example.com/right",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Right Banner",
    },
    bottom: {
      href: "https://example.com/bottom",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Bottom Banner",
    },
  };
  // === End banner data ===

  const CloseableBanner = ({ children, onClose }) => (
    <div className="relative rounded-md overflow-hidden select-none bg-transparent max-w-7xl mx-auto my-4 p-2 border border-transparent">
      <button
        onClick={onClose}
        aria-label="Close banner"
        title="Close"
        className="absolute top-1 right-2 text-white font-bold text-xl hover:text-gray-300 focus:outline-none select-none z-10"
      >
        ×
      </button>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[Orbitron] px-4 pt-24 relative">
      {/* Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center max-w-xs px-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-fuchsia-500 border-opacity-60 mx-auto"></div>
              <p className="mt-4 text-lg font-semibold text-white">
                {progress < 100 ? `🚀 Uploading... ${progress}% completed` : "✅ Upload complete!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    
     {/* Toast */}
<div className="fixed top-24 right-6 z-40">
  <AnimatePresence>
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        durationMs={toast.duration || 15000}   // show up to 15s
        onClose={() => setToast(null)}
      />
    )}
  </AnimatePresence>
</div>


      {/* Top Banner */}
      {showTopBanner && (
        <CloseableBanner onClose={() => setShowTopBanner(false)}>
          <div className="flex items-center justify-between text-white px-4 py-2 font-semibold text-center text-sm uppercase max-w-7xl mx-auto">
            ADVERTISEMENT
          </div>
          <div
            className="flex flex-wrap justify-center overflow-hidden md:overflow-x-auto scrollbar-hide no-scrollbar max-w-7xl mx-auto px-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {bannerAds.map(({ href, img, alt, text, logoOnly }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex flex-col items-center justify-center m-1 rounded-md shadow-lg"
                style={{
                  minWidth: logoOnly ? 140 : 180,
                  maxWidth: logoOnly ? 160 : 200,
                  backgroundColor: "#0074e8",
                  flexGrow: 1,
                  flexBasis: logoOnly ? "140px" : "180px",
                }}
              >
                <img
                  src={img}
                  alt={alt}
                  className="object-contain rounded-t-md"
                  style={{ width: "100%", height: logoOnly ? 80 : 120 }}
                  loading="lazy"
                />
                {!logoOnly && (
                  <div
                    className="text-white font-bold text-center text-lg py-2 px-1 select-text"
                    style={{ userSelect: "text" }}
                  >
                    {text}
                  </div>
                )}
              </a>
            ))}
          </div>
        </CloseableBanner>
      )}

      {/* Main upload grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        {/* Left Banner */}
        {showLeftBanner && (
          <CloseableBanner onClose={() => setShowLeftBanner(false)}>
            <a href={sideBanners.left.href} target="_blank" rel="noopener noreferrer">
              <img
                src={sideBanners.left.img}
                alt={sideBanners.left.alt}
                className="mx-auto rounded-md max-h-[250px]"
                style={{ width: "auto", backgroundColor: "transparent" }}
                loading="lazy"
              />
            </a>
          </CloseableBanner>
        )}

        {/* Upload center */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#111111] border border-[#2d2d2d] p-8 rounded-2xl shadow-[0_0_15px_#7f00ff33] space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-white">Upload Your File</h2>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-xl bg-[#0e0e0e] border border-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                isDragActive ? "border-fuchsia-500 bg-[#1a1a1a]" : "border-gray-600 bg-[#0f0f0f]"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-5xl">📁</span>
                <p className="text-sm text-gray-300">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  {/* Updated display text */}
                  Any file type — Max total 1GB
                </p>

                {files.length > 0 && (
                  <ul className="mt-2 text-sm text-green-400 space-y-1 font-medium">
                    {files.map((file, index) => (
                      <li key={index}>
                        ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </li>
                    ))}
                    <li className="text-xs text-gray-400 mt-2">
                      Total: {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-bold border border-white"
            >
              Upload Now
            </button>
          </motion.div>
        </div>

        {/* Right Banner */}
        {showRightBanner && (
          <CloseableBanner onClose={() => setShowRightBanner(false)}>
            <a href={sideBanners.right.href} target="_blank" rel="noopener noreferrer">
              <img
                src={sideBanners.right.img}
                alt={sideBanners.right.alt}
                className="mx-auto rounded-md max-h-[250px]"
                style={{ width: "auto", backgroundColor: "transparent" }}
                loading="lazy"
              />
            </a>
          </CloseableBanner>
        )}
      </div>

      {/* Bottom Banner */}
      {showBottomBanner && (
        <CloseableBanner onClose={() => setShowBottomBanner(false)}>
          <a href={sideBanners.bottom.href} target="_blank" rel="noopener noreferrer">
            <img
              id="lowerfeatureshowcase300"
              src={sideBanners.bottom.img}
              alt={sideBanners.bottom.alt}
              className="w-full rounded-xl max-h-[150px] object-contain"
              loading="lazy"
              style={{ backgroundColor: "transparent" }}
            />
          </a>
        </CloseableBanner>
      )}
    </div>
  );
}
