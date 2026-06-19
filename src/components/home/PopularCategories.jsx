"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaLaptop, FaCouch, FaCar, FaTshirt, FaMobileAlt, FaBoxOpen } from "react-icons/fa";

const categories = [
  {
    name: "Electronics",
    icon: <FaLaptop size={28} />,
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    count: "120+ items",
    href: "/categories/electronics",
  },
  {
    name: "Furniture",
    icon: <FaCouch size={28} />,
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    count: "85+ items",
    href: "/categories/furniture",
  },
  {
    name: "Vehicles",
    icon: <FaCar size={28} />,
    color: "from-red-400 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    count: "60+ items",
    href: "/categories/vehicles",
  },
  {
    name: "Fashion",
    icon: <FaTshirt size={28} />,
    color: "from-pink-400 to-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    count: "200+ items",
    href: "/categories/fashion",
  },
  {
    name: "Mobile Phones",
    icon: <FaMobileAlt size={28} />,
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    count: "150+ items",
    href: "/categories/mobile-phones",
  },
  {
    name: "Other",
    icon: <FaBoxOpen size={28} />,
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    count: "300+ items",
    href: "/categories/other",
  },
];

export default function PopularCategories() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">
            Browse By
          </p>
          <h2 className="text-4xl font-black text-gray-900">
            Popular{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Find exactly what you are looking for by browsing our most popular categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <Link href={cat.href}>
                <div className={`${cat.bg} ${cat.border} border rounded-3xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 group`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  {/* Name */}
                  <h3 className="font-black text-gray-800 text-sm mb-1">
                    {cat.name}
                  </h3>
                  {/* Count */}
                  <p className="text-xs text-gray-400 font-medium">
                    {cat.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}