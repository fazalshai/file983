import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const iconMap = {
  success: "fas fa-check-circle",
  error: "fas fa-times-circle",
  warning: "fas fa-exclamation-triangle",
  info: "fas fa-info-circle",
};

const colorMap = {
  success: "bg-green-600 border-green-400",
  error: "bg-red-600 border-red-400",
  warning: "bg-yellow-500 text-black border-yellow-300",
  info: "bg-blue-600 border-blue-400",
};

/**
 * Props:
 *  - message: string
 *  - type: "success" | "error" | "warning" | "info"
 *  - durationMs: number (how long to show the toast)
 *  - onClose: () => void
 */
const Toast = ({ message, type = "info", durationMs = 3000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar: 100 → 0 over `durationMs`
    const stepMs = Math.max(10, Math.floor(durationMs / 100)); // ~100 steps
    const stepPct = 100 / Math.ceil(durationMs / stepMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - stepPct;
        return next <= 0 ? 0 : next;
      });
    }, stepMs);

    const timeout = setTimeout(() => {
      onClose?.();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [durationMs, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`relative w-80 px-5 py-3 rounded-lg shadow-lg text-sm flex items-start gap-3 text-white border-l-4 ${colorMap[type]}`}
      role="status"
      aria-live="polite"
    >
      <i className={`${iconMap[type]} text-lg mt-1`} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white text-xs font-bold ml-2 hover:opacity-80">
        ✕
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white bg-opacity-20 rounded-b overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${
            type === "success" ? "bg-green-400"
            : type === "error" ? "bg-red-400"
            : type === "warning" ? "bg-yellow-300"
            : "bg-blue-400"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
