"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaCheckCircle, FaShoppingCart, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function PaymentSuccessClient({ session, productId, sellerEmail, sellerName }) {
  const { data: userSession } = useSession();
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const saveOrder = async () => {
      if (orderSaved || !userSession?.user) return;

      try {
        // Check if order already exists
        const checkRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/check?transactionId=${session.payment_intent?.id}`
        );
        const checkData = await checkRes.json();

        if (checkData.exists) {
          setOrderSaved(true);
          return;
        }

        // Save order
        const orderRes = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
          {
            method: "POST",
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
          }
        );
        const orderData = await orderRes.json();
        if (orderData.result?.insertedId) {
          setOrderId(orderData.result.insertedId);
        }

        // Save payment
        await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments`,
          {
            method: "POST",
            body: JSON.stringify({
              orderId: session.id,
              transactionId: session.payment_intent?.id,
              buyerId: userSession.user.id,
              buyerEmail: userSession.user.email,
              amount: session.amount_total / 100,
              paymentStatus: "paid",
              paymentMethod: "stripe",
              paymentDate: new Date(),
            }),
          }
        );

        // Remove from wishlist after ordering
        try {
          await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist`,
            {
              method: "DELETE",
              body: JSON.stringify({
                email: userSession.user.email,
                productId: productId,
              }),
            }
          );
        } catch (err) {
          console.error("Failed to remove from wishlist:", err);
        }

        setOrderSaved(true);
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("Failed to save order:", error);
        toast.error("Failed to save order: " + error.message);
      }
    };

    saveOrder();
  }, [userSession]);

  const paymentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
        <p className="text-gray-400 text-sm mb-6">Your order has been placed successfully</p>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Order Summary
          </p>

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
            <span className="text-sm font-bold text-gray-700 truncate max-w-[180px]">
              {session.customer_details?.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Payment Date</span>
            <span className="text-xs font-bold text-gray-700">
              {paymentDate}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-bold text-green-600 capitalize">
              {session.payment_status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* View Order Details */}
          <Link href="/dashboard/buyer/orders" className="flex-1">
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-md"
              startContent={<FaEye size={14} />}
            >
              View Orders
            </Button>
          </Link>

          {/* Continue Shopping */}
          <Link href="/products" className="flex-1">
            <Button
              variant="bordered"
              className="w-full border-2 border-gray-200 text-gray-600 font-bold rounded-2xl"
              startContent={<FaShoppingCart size={14} />}
            >
              Shop More
            </Button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}