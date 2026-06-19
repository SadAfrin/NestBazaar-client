"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaShoppingBag, FaDollarSign } from "react-icons/fa";

export default function AdminOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`);
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers size={20} />, color: "from-blue-400 to-blue-600" },
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen size={20} />, color: "from-green-400 to-green-600" },
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag size={20} />, color: "from-purple-400 to-purple-600" },
    { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign size={20} />, color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Welcome, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and statistics</p>
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

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-center py-10">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-400 font-medium">No recent activity</p>
        </div>
      </div>
    </div>
  );
}