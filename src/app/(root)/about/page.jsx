"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaLaptop, FaCouch, FaCar, FaTshirt, FaMobileAlt, FaBoxOpen } from "react-icons/fa";

const categories = [
  {
    name: "Electronics",
    icon: <FaLaptop size={40} />,
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    count: "120+ items",
    description: "Laptops, TVs, Cameras, Gaming consoles and more",
    href: "/categories/electronics",
  },
  {
    name: "Furniture",
    icon: <FaCouch size={40} />,
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    count: "85+ items",
    description: "Sofas, Tables, Chairs, Beds and more",
    href: "/categories/furniture",
  },
  {
    name: "Vehicles",
    icon: <FaCar size={40} />,
    color: "from-red-400 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    count: "60+ items",
    description: "Motorcycles, Bicycles, Cars and more",
    href: "/categories/vehicles",
  },
  {
    name: "Fashion",
    icon: <FaTshirt size={40} />,
    color: "from-pink-400 to-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    count: "200+ items",
    description: "Clothes, Shoes, Bags, Accessories and more",
    href: "/categories/fashion",
  },
  {
    name: "Mobile Phones",
    icon: <FaMobileAlt size={40} />,
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    count: "150+ items",
    description: "Smartphones, Tablets, Accessories and more",
    href: "/categories/mobile-phones",
  },
  {
    name: "Other",
    icon: <FaBoxOpen size={40} />,
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    count: "300+ items",
    description: "Books, Sports, Toys, Kitchen items and more",
    href: "/categories/other",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-2"
          >
            All Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-green-100"
          >
            Browse products by category
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={cat.href}>
                <div className={`${cat.bg} ${cat.border} border rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-black text-gray-800 text-xl mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{cat.description}</p>
                  <span className="text-xs font-bold text-green-600 bg-white px-3 py-1.5 rounded-full border border-green-100">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}