"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="group bg-card border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-lg ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
          {product.condition}
        </span>
        <span className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-xs font-semibold text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1">
          <FaTag size={10} className="text-green-500" />
          {product.category}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-foreground text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-xl font-black text-green-600">
          ৳{product.price?.toLocaleString()}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MdVerified className="text-green-500" size={12} />
            <span>{product.sellerInfo?.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FaMapMarkerAlt className="text-green-500" size={10} />
            <span>{product.sellerInfo?.location || "Bangladesh"}</span>
          </div>
        </div>
        <Link href={`/products/${product._id}`} className="block">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md hover:shadow-green-200 transition-all"
          >
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
