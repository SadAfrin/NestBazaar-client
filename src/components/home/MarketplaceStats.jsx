"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FaUsers, FaShoppingBag, FaStore, FaCheckCircle } from "react-icons/fa";

const stats = [
  {
    icon: <FaShoppingBag size={28} />,
    value: 50000,
    suffix: "K+",
    label: "Total Products",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <FaStore size={28} />,
    value: 10000,
    suffix: "K+",
    label: "Total Sellers",
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
  },
  {
    icon: <FaUsers size={28} />,
    value: 20000,
    suffix: "K+",
    label: "Total Buyers",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: <FaCheckCircle size={28} />,
    value: 35000,
    suffix: "K+",
    label: "Completed Orders",
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-50",
  },
];

function Counter({ value, suffix, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, start]);

  const display = () => {
    if (suffix === "K+") return `${Math.floor(count / 1000)}K+`;
    return `${count}${suffix}`;
  };

  return <span>{display()}</span>;
}

export default function MarketplaceStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-2">
            Our Impact
          </p>
          <h2 className="text-4xl font-black text-white">
            Marketplace{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto">
            Numbers that speak for themselves — NestBazaar is growing every day
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
                {stat.icon}
              </div>

              {/* Value */}
              <p className="text-4xl font-black text-white mb-2">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  start={isInView}
                />
              </p>

              {/* Label */}
              <p className="text-gray-400 font-medium text-sm">{stat.label}</p>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}