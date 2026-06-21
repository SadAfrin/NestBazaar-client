"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaUsers, FaBoxOpen, FaShoppingBag, FaDollarSign } from "react-icons/fa";

// Fake data — will be replaced with real data after orders are built
const userGrowth = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 185 },
  { month: "Mar", users: 150 },
  { month: "Apr", users: 280 },
  { month: "May", users: 320 },
  { month: "Jun", users: 410 },
];

const monthlyOrders = [
  { month: "Jan", orders: 45 },
  { month: "Feb", orders: 62 },
  { month: "Mar", orders: 38 },
  { month: "Apr", orders: 85 },
  { month: "May", orders: 71 },
  { month: "Jun", orders: 110 },
];

const categoryPerformance = [
  { name: "Electronics", value: 35, color: "#3b82f6" },
  { name: "Mobile Phones", value: 25, color: "#22c55e" },
  { name: "Furniture", value: 15, color: "#f59e0b" },
  { name: "Fashion", value: 15, color: "#ec4899" },
  { name: "Vehicles", value: 10, color: "#ef4444" },
];

const topCategories = [
  { category: "Electronics", orders: 85, revenue: 2500000 },
  { category: "Mobile Phones", orders: 62, revenue: 1800000 },
  { category: "Furniture", orders: 38, revenue: 950000 },
  { category: "Fashion", orders: 45, revenue: 320000 },
  { category: "Vehicles", orders: 25, revenue: 3200000 },
];

export default function PlatformAnalyticsPage() {
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">Platform Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Overall platform performance and insights</p>
      </div>

      {/* Stats Cards */}
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Performance Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Category Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryPerformance.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Categories Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold text-gray-700">{cat.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-600">৳{cat.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{cat.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  );
}