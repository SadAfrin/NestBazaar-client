"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import { toast } from "react-toastify";

export default function PaymentSuccessClient({ session, productId, sellerEmail, sellerName }) {
  const { data: userSession } = useSession();
  const router = useRouter();
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    const saveOrder = async () => {
      if (orderSaved || !userSession?.user) return;

      try {
        // Save order to DB
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerInfo: {
              userId: userSession.user.id,
              name: userSession.user.name,
              email: userSession.user.email,
            },
            sellerInfo: {
              email: sellerEmail,
              name: sellerName,
            },
            productId,
            amount: session.amount_total / 100,
            paymentStatus: "paid",
            orderStatus: "pending",
            transactionId: session.payment_intent?.id,
          }),
        });

        // Save payment to DB
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: session.id,
            transactionId: session.payment_intent?.id,
            buyerEmail: userSession.user.email,
            amount: session.amount_total / 100,
            paymentStatus: "success",
            paymentMethod: "stripe",
            paymentDate: new Date(),
          }),
        });

        setOrderSaved(true);
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("Failed to save order:", error);
      }
    };

    saveOrder();
  }, [userSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
        >
          <FaCheckCircle size={40} className="text-white" />
        </motion.div>

        <h1 className="text-2xl font-black text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-400 text-sm mb-6">
          Your order has been placed successfully
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount Paid</span>
            <span className="text-sm font-black text-green-600">
              ৳{(session.amount_total / 100).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Transaction ID</span>
            <span className="text-xs font-bold text-gray-700 truncate max-w-[180px]">
              {session.payment_intent?.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-bold text-gray-700">
              {session.customer_details?.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-bold text-green-600 capitalize">
              {session.payment_status}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/dashboard/buyer/orders" className="flex-1">
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-md"
              startContent={<FaShoppingBag size={14} />}
            >
              My Orders
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="bordered"
              className="w-full border-2 border-green-500 text-green-600 font-bold rounded-2xl"
              startContent={<FaHome size={14} />}
            >
              Home
            </Button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}