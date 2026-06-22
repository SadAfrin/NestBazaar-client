"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaHeart, FaCreditCard, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";

export default function BuyerOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    totalSpent: 0,
    recentPurchases: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch wishlist count
        const wishlistRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist?email=${session?.user?.email}`
        );
        const wishlistData = await wishlistRes.json();
        const wishlistCount = wishlistData.success ? wishlistData.data.length : 0;

        // Fetch orders
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?email=${session?.user?.email}`
        );
        const ordersData = await ordersRes.json();
        const orders = ordersData.success ? ordersData.data : [];
        const totalOrders = orders.length;

        // Fetch payments to calculate total spent
        const paymentsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments?email=${session?.user?.email}`
        );
        const paymentsData = await paymentsRes.json();
        const payments = paymentsData.success ? paymentsData.data : [];
        const totalSpent = payments
          .filter(p => p.paymentStatus === "success")
          .reduce((acc, p) => acc + (p.amount || 0), 0);

        setStats({
          totalOrders,
          wishlistCount,
          totalSpent,
          recentPurchases: totalOrders,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (session?.user?.email) fetchStats();
  }, [session]);

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag size={20} />, color: "from-blue-400 to-blue-600", href: "/dashboard/buyer/orders" },
    { label: "Wishlist Items", value: stats.wishlistCount, icon: <FaHeart size={20} />, color: "from-pink-400 to-pink-600", href: "/dashboard/buyer/wishlist" },
    { label: "Total Spent", value: `৳${stats.totalSpent.toLocaleString()}`, icon: <FaCreditCard size={20} />, color: "from-green-400 to-green-600", href: "/dashboard/buyer/payments" },
    { label: "Recent Purchases", value: stats.recentPurchases, icon: <FaBoxOpen size={20} />, color: "from-purple-400 to-purple-600", href: "/dashboard/buyer/orders" },
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

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-gray-800 mb-4">Recent Orders</h3>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-inner">
            <FaShoppingBag size={40} className="text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-black text-lg">No Orders Yet</p>
            <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
          </div>
        </div>
      </div>
    </div>
  );
}