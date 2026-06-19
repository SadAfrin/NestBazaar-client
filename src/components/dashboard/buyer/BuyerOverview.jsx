"use client";

import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FaShoppingBag, FaHeart, FaCreditCard, FaBoxOpen } from "react-icons/fa";

export default function BuyerOverview() {
  const { data: session } = useSession();

  const cards = [
    { label: "Total Orders", value: "0", icon: <FaShoppingBag size={20} />, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
    { label: "Wishlist Items", value: "0", icon: <FaHeart size={20} />, color: "from-pink-400 to-pink-600", bg: "bg-pink-50" },
    { label: "Total Spent", value: "৳0", icon: <FaCreditCard size={20} />, color: "from-green-400 to-green-600", bg: "bg-green-50" },
    { label: "Recent Purchases", value: "0", icon: <FaBoxOpen size={20} />, color: "from-purple-400 to-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your buying activity summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-md`}>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders placeholder */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-gray-800 mb-4">Recent Orders</h3>
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="text-gray-400 font-medium">No orders yet</p>
          <p className="text-gray-300 text-sm mt-1">Start shopping to see your orders here</p>
        </div>
      </div>
    </div>
  );
}