import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-white font-[Orbitron] px-6 py-16 flex flex-col justify-center items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-4 text-fuchsia-500"
      >
        Welcome to FylShare 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-3xl text-lg sm:text-xl text-gray-300"
      >
        FylShare is a futuristic file-sharing platform designed for seamless access,
        secure sharing, and stylish interaction. Our mission is to revolutionize how users share and search files using simple 6-digit codes with elegance and performance in mind.
      </motion.p>

      <div className="mt-12 space-y-4 text-gray-400 text-sm">
        <p>💡 Designed for developers, creators, and the curious.</p>
        <p>🔐 Safe, ephemeral, and zero-ad clutter (unless banners are enabled).</p>
        <p>🚧 Built using React, Tailwind, Framer Motion, and Firebase.</p>
      </div>
    </div>
  );
}
