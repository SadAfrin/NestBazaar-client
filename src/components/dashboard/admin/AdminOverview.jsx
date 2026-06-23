"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaShoppingBag, FaDollarSign, FaUserPlus, FaClipboardList, FaTruck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const statusColors = {
  "pending": "bg-yellow-100 text-yellow-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-green-100 text-green-700",
  "cancelled": "bg-red-100 text-red-700",
};

export default function AdminOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`
        );
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch recent orders
        const ordersRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/orders`
        );
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recent = ordersData.data
            .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
            .slice(0, 5);
          setRecentOrders(recent);
        }

        // Fetch recent users
        const usersRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`
        );
        const usersData = await usersRes.json();
        if (usersData.success) {
          const recent = usersData.data.slice(0, 3);
          setRecentUsers(recent);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers size={20} />, color: "from-blue-400 to-blue-600", href: "/dashboard/admin/manage-users" },
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen size={20} />, color: "from-green-400 to-green-600", href: "/dashboard/admin/manage-products" },
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag size={20} />, color: "from-purple-400 to-purple-600", href: "/dashboard/admin/manage-orders" },
    { label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign size={20} />, color: "from-orange-400 to-orange-600", href: "/dashboard/admin/analytics" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Welcome, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link href={card.href} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                {card.icon}
              </div>
              <p className="text-2xl font-black text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800">
              Recent Orders
              <span className="text-xs font-semibold text-gray-400 ml-2">(Last 30 days)</span>
            </h3>
            <Link href="/dashboard/admin/manage-orders">
              <span className="text-xs font-bold text-green-600 hover:underline">View All</span>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <FaClipboardList size={32} className="text-gray-300" />
              <p className="text-gray-400 text-sm font-bold">No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      <FaTruck size={14} className="text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-xs">
                        #{order._id?.toString().slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">{order.buyerInfo?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-green-600 text-xs">
                      ৳{order.amount?.toLocaleString()}
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800">Recent Users</h3>
            <Link href="/dashboard/admin/manage-users">
              <span className="text-xs font-bold text-green-600 hover:underline">View All</span>
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <FaUsers size={32} className="text-gray-300" />
              <p className="text-gray-400 text-sm font-bold">No recent users</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-gray-800 text-xs">{user.name}</p>
                        <MdVerified className="text-green-500" size={11} />
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "seller" ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${
                      user.status === "blocked" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {user.status || "active"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}