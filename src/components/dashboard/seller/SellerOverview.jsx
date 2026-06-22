"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaCheckCircle, FaDollarSign, FaClock, FaClipboardList } from "react-icons/fa";

export default function SellerOverview() {
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
        // Fetch seller products
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
        <h3 className="font-black text-gray-800 mb-4">Recent Orders</h3>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
            <FaClipboardList size={40} className="text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-black text-lg">No Orders Yet</p>
            <p className="text-gray-400 text-sm mt-1">Start listing products to receive orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}