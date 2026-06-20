"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaChartBar, FaBoxOpen, FaCheckCircle, FaDollarSign, FaClock } from "react-icons/fa";

// Fake data for charts (will be replaced with real data after orders are built)
const monthlySales = [
  { month: "Jan", sales: 4, revenue: 120000 },
  { month: "Feb", sales: 6, revenue: 185000 },
  { month: "Mar", sales: 3, revenue: 95000 },
  { month: "Apr", sales: 8, revenue: 240000 },
  { month: "May", sales: 5, revenue: 155000 },
  { month: "Jun", sales: 10, revenue: 310000 },
];

const topProducts = [
  { name: "iPhone 14 Pro", sales: 5 },
  { name: "Sony Headphones", sales: 3 },
  { name: "Samsung S23", sales: 4 },
  { name: "MacBook Air", sales: 2 },
];

const orderStatusData = [
  { name: "Delivered", value: 15, color: "#22c55e" },
  { name: "Processing", value: 5, color: "#8b5cf6" },
  { name: "Pending", value: 3, color: "#f59e0b" },
  { name: "Cancelled", value: 2, color: "#ef4444" },
];

export default function SalesAnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch seller products count
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/seller?email=${session?.user?.email}`
        );
        const productsData = await productsRes.json();
        const totalProducts = productsData.success ? productsData.data.length : 0;

        // Fetch seller orders
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/seller?email=${session?.user?.email}`
        );
        const ordersData = await ordersRes.json();
        const orders = ordersData.success ? ordersData.data : [];
        const totalSales = orders.filter(o => o.orderStatus === "delivered").length;
        const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
        const totalRevenue = orders
          .filter(o => o.orderStatus === "delivered")
          .reduce((acc, o) => acc + (o.amount || 0), 0);

        setStats({ totalProducts, totalSales, totalRevenue, pendingOrders });
      } catch (error) {
        console.error(error);
      }
    };
    if (session?.user?.email) fetchStats();
  }, [session]);

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen size={20} />, color: "from-blue-400 to-blue-600" },
    { label: "Total Sales", value: stats.totalSales, icon: <FaCheckCircle size={20} />, color: "from-green-400 to-green-600" },
    { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign size={20} />, color: "from-emerald-400 to-emerald-600" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: <FaClock size={20} />, color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">Sales Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Your business performance overview</p>
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

        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="sales" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Monthly Revenue (৳)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="sales" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-800 mb-6">Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
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

      </div>

    </div>
  );
}