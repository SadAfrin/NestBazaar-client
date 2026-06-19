"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const activities = [
  { user: "Rakib H.", action: "just bought", item: "Dell Laptop", time: "2s ago", color: "from-blue-400 to-blue-600" },
  { user: "Nusrat J.", action: "listed", item: "iPhone 13 Pro", time: "5s ago", color: "from-pink-400 to-pink-600" },
  { user: "Karim A.", action: "just bought", item: "Sofa Set", time: "8s ago", color: "from-green-400 to-green-600" },
  { user: "Sara T.", action: "listed", item: "Winter Jacket", time: "12s ago", color: "from-purple-400 to-purple-600" },
  { user: "Hasan M.", action: "just bought", item: "PS4 Console", time: "15s ago", color: "from-orange-400 to-orange-600" },
  { user: "Mitu B.", action: "listed", item: "Dining Table", time: "20s ago", color: "from-teal-400 to-teal-600" },
  { user: "Farhan R.", action: "just bought", item: "Canon Camera", time: "25s ago", color: "from-red-400 to-red-600" },
  { user: "Rina A.", action: "listed", item: "Samsung TV", time: "30s ago", color: "from-indigo-400 to-indigo-600" },
];

export default function LiveActivityFeed() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activity = activities[current];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -50, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-gray-200 p-3 flex items-center gap-3 max-w-[260px]"
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
              {activity.user.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-black text-gray-800 truncate">
                  {activity.user}
                </p>
                <MdVerified className="text-green-500 shrink-0" size={12} />
              </div>
              <p className="text-xs text-gray-500 truncate">
                {activity.action}{" "}
                <span className="font-bold text-green-600">{activity.item}</span>
              </p>
            </div>

            {/* Time */}
            <div className="shrink-0 text-right">
              <FaShoppingBag className="text-green-500 mx-auto mb-0.5" size={12} />
              <p className="text-[10px] text-gray-400">{activity.time}</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}