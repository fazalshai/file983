import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Share2,
  BarChart,
  Activity,
  Monitor, // for system users icon
  Eye,     // for total views icon
} from "lucide-react";

const StatCard = ({ title, value, subtitle, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-3 rounded-xl shadow-sm"
    style={{
      backgroundColor: "#1f1f2e",
      borderColor: "#3a3153",
      border: "1px solid #3a3153",
    }}
  >
    <div className="flex items-center gap-2">
      <div
        className="p-2 rounded-lg shrink-0"
        style={{ backgroundColor: "#2e2846" }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <motion.p
          className="text-lg font-bold truncate text-white"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {value}
        </motion.p>
        <p className="text-xs font-medium truncate text-gray-400">{title}</p>
        {subtitle && (
          <motion.p
            className="text-xs mt-0.5 truncate text-gray-500"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  </motion.div>
);

const TrendChart = ({ data }) => (
  <div className="flex items-end justify-between h-32 px-2 mt-4 gap-1">
    {data.map((height, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
        className="w-full rounded-t-lg"
        style={{ backgroundColor: "#7f00ff" }}
      />
    ))}
  </div>
);

function randomFluctuate(value, variance = 0.1) {
  const fluctuation = value * variance * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(value + fluctuation));
}

export default function Analysis() {
  const timeFrames = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ];

  const [selectedFrame, setSelectedFrame] = useState(timeFrames[0]);

  const [stats, setStats] = useState([
    {
      title: "Active Users",
      baseValue: 2845,
      value: 2845,
      subtitle: "↑ 12% from last week",
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Avg. Session Duration (min)",
      baseValue: 4.53,
      value: 4.53,
      subtitle: "Users spend more time sharing files",
      icon: <Clock className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Conversion Rate",
      baseValue: 8.7,
      value: 8.7,
      subtitle: "Of visitors complete file sharing",
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Global Reach",
      baseValue: 42,
      value: 42,
      subtitle: "Countries with active users",
      icon: <Globe className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Total Views",
      baseValue: 2300000,
      value: "2.3M",
      subtitle: "Website views",
      icon: <Eye className="w-5 h-5 text-purple-400" />,
    },
  ]);

  // Device Distribution stat separate, since value is string with % mobile and system counts
  const engagementStatsBase = [
    {
      title: "Device Distribution",
      mobileBase: 68,
      systemBase: 32,
      value: "68% Mobile",
      subtitle: "Users on mobile vs system",
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Sharing Rate",
      baseValue: 3.2,
      value: 3.2,
      subtitle: "Avg. shares per upload",
      icon: <Share2 className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Peak Hours",
      baseValue: "2-5 PM",
      value: "2-5 PM",
      subtitle: "Highest activity period",
      icon: <Activity className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "User Growth",
      baseValue: 24,
      value: 24,
      subtitle: "Month over month",
      icon: <BarChart className="w-5 h-5 text-purple-400" />,
    },
  ];

  const [engagementStats, setEngagementStats] = useState(engagementStatsBase);

  // Animate numeric stats values every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.title === "Total Views") {
            // fluctuate total views slightly around base 2.3M
            const fluctuation = Math.floor(Math.random() * 50000); // ±50k
            const newVal = stat.baseValue + fluctuation - 25000;
            return { ...stat, value: `${(newVal / 1000000).toFixed(2)}M` };
          }
          if (typeof stat.baseValue === "number") {
            let newValue = randomFluctuate(stat.baseValue, 0.1);
            if (stat.title.includes("Duration")) newValue = (newValue / 100).toFixed(2);
            else if (stat.title.includes("Conversion")) newValue = newValue.toFixed(1);
            else newValue = newValue.toLocaleString();
            return { ...stat, value: newValue };
          }
          return stat;
        })
      );

      // Animate Device Distribution mobile/system counts dynamically
      setEngagementStats((prev) =>
        prev.map((stat) => {
          if (stat.title === "Device Distribution") {
            const mobile = Math.min(100, Math.max(50, stat.mobileBase + (Math.random() * 10 - 5)));
            const system = 100 - mobile;
            return {
              ...stat,
              mobileBase: mobile,
              systemBase: system,
              value: `${mobile.toFixed(0)}% Mobile, ${system.toFixed(0)}% System`,
              subtitle: `Mobile: ${mobile.toFixed(0)} users, System: ${system.toFixed(0)} users`,
            };
          }
          return stat;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update subtitles based on timeframe
  useEffect(() => {
    const suffix = ` - data from last ${selectedFrame.days} days`;
    setStats((prevStats) =>
      prevStats.map((stat) => ({
        ...stat,
        subtitle: stat.subtitle.split(" - ")[0] + suffix,
      }))
    );
  }, [selectedFrame]);

  const chartDataByTimeframe = {
    7: [40, 65, 45, 75, 55, 85, 70],
    30: [55, 50, 60, 70, 65, 75, 60],
    90: [70, 60, 65, 75, 80, 90, 85],
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-6 md:px-6 text-white font-[Orbitron] bg-[#130722] min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 md:mt-10 rounded-xl shadow-sm p-4 md:p-6"
        style={{
          backgroundColor: "#1f1f2e",
          borderColor: "#3a3153",
          border: "1px solid #3a3153",
        }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold">Weekly Engagement Trend</h3>
          <select
            className="px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm bg-[#2e2846] text-white border border-gray-700"
            value={selectedFrame.label}
            onChange={(e) =>
              setSelectedFrame(timeFrames.find((t) => t.label === e.target.value))
            }
          >
            {timeFrames.map((frame) => (
              <option key={frame.days} value={frame.label}>
                {frame.label}
              </option>
            ))}
          </select>
        </div>
        <TrendChart data={chartDataByTimeframe[selectedFrame.days]} />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
        {engagementStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1 + 0.6} />
        ))}
      </div>
    </div>
  );
}
