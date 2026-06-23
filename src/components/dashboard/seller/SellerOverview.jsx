"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCheckCircle, FaDollarSign, FaClock, FaClipboardList, FaTruck } from "react-icons/fa";
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

export default function SellerOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/seller?email=${session?.user?.email}`
        );
        const productsData = await productsRes.json();
        const totalProducts = productsData.success ? productsData.data.length : 0;

        const ordersRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/seller?email=${session?.user?.email}`
        );
        const ordersData = await ordersRes.json();
        const orders = ordersData.success ? ordersData.data : [];

        // Total sales = delivered orders
        const totalSales = orders.filter(o => o.orderStatus === "delivered").length;

        // Active orders = pending + accepted + processing + shipped
        const activeOrders = orders.filter(o =>
          ["pending", "accepted", "processing", "shipped"].includes(o.orderStatus)
        ).length;

        // Total revenue = sum of delivered orders
        const totalRevenue = orders
          .filter(o => o.orderStatus === "delivered")
          .reduce((acc, o) => acc + (o.amount || 0), 0);

        // Recent orders = last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recent = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
        setRecentOrders(recent);

        setStats({ totalProducts, totalSales, totalRevenue, activeOrders });
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
    { label: "Active Orders", value: stats.activeOrders, icon: <FaClock size={20} />, color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your seller activity summary</p>
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

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800">
            Recent Orders{" "}
            <span className="text-xs font-semibold text-gray-400">(Last 30 days)</span>
          </h3>
          <Link href="/dashboard/seller/manage-orders">
            <span className="text-xs font-bold text-green-600 hover:underline">View All</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaClipboardList size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">No Orders Yet</p>
              <p className="text-gray-400 text-sm mt-1">Start listing products to receive orders</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <FaTruck size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Order #{order._id?.toString().slice(-6).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MdVerified className="text-green-500" size={11} />
                      <p className="text-xs text-gray-400">{order.buyerInfo?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-green-600 text-sm">
                      ৳{order.amount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric"
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}