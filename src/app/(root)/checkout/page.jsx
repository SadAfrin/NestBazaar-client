"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaShoppingCart, FaMapMarkerAlt, FaUser, FaEnvelope, FaArrowLeft, FaLock } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  const productId = searchParams.get("productId");

  useEffect(() => {
    if (!session?.user) return;
    if (!productId) {
      router.push("/products");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`
        );
        const productData = await productRes.json();
        if (productData.success) setProduct(productData.data);

        // Fetch buyer profile
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile?email=${session.user.email}`
        );
        const profileData = await profileRes.json();
        if (profileData.success) setBuyerProfile(profileData.data);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load checkout!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, productId]);

  const handleProceedToPayment = async () => {
    setPayLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          buyerEmail: session.user.email,
          buyerName: session.user.name,
          sellerEmail: product.sellerInfo?.email,
          sellerName: product.sellerInfo?.name,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate payment!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setPayLoading(false);
    }
  };

  if (!session) {
    router.push("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">😕</p>
        <p className="text-xl font-black text-gray-700">Product not found!</p>
        <Link href="/products">
          <Button className="bg-green-500 text-white font-bold rounded-2xl">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 font-semibold"
        >
          <FaArrowLeft size={14} />
          Back to Product
        </button>

        <h1 className="text-2xl font-black text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-black text-gray-700 text-lg">Order Summary</h2>

            {/* Product Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-sm line-clamp-2">
                    {product.title}
                  </h3>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <MdVerified className="text-green-500" size={13} />
                    <p className="text-xs text-gray-400">{product.sellerInfo?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-black text-gray-800">Price Details</h3>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Product Name</span>
                <span className="text-sm font-bold text-gray-800 text-right max-w-[200px] line-clamp-1">
                  {product.title}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Product Price</span>
                <span className="text-sm font-bold text-gray-800">
                  ৳{product.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Quantity</span>
                <span className="text-sm font-bold text-gray-800">1</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Condition</span>
                <span className="text-sm font-bold text-gray-800">{product.condition}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-sm font-black text-gray-800">Total Amount</span>
                <span className="text-lg font-black text-green-600">
                  ৳{product.price?.toLocaleString()}
                </span>
              </div>
            </div>

          </motion.div>

          {/* Right — Delivery Info + Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-black text-gray-700 text-lg">Delivery Information</h2>

            {/* Buyer Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-black text-gray-800">Your Information</h3>

              <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                <FaUser className="text-green-500 shrink-0" size={14} />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="text-sm font-bold text-gray-800">{buyerProfile?.name || session?.user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                <FaEnvelope className="text-green-500 shrink-0" size={14} />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-bold text-gray-800">{buyerProfile?.email || session?.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <FaMapMarkerAlt className="text-green-500 shrink-0" size={14} />
                <div>
                  <p className="text-xs text-gray-400">Delivery Location</p>
                  <p className="text-sm font-bold text-gray-800">
                    {buyerProfile?.location || "Not set — update in profile"}
                  </p>
                </div>
              </div>

              {!buyerProfile?.location && (
                <Link href="/dashboard/profile">
                  <p className="text-xs text-green-600 font-bold hover:underline">
                    + Add delivery location in profile
                  </p>
                </Link>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-black text-gray-800">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-md">
                  {product.sellerInfo?.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-black text-gray-800 text-sm">{product.sellerInfo?.name}</p>
                    <MdVerified className="text-green-500" size={14} />
                  </div>
                  <p className="text-xs text-gray-400">{product.sellerInfo?.email}</p>
                </div>
              </div>
            </div>

            {/* Secure Payment Notice */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <FaLock className="text-green-500 shrink-0" size={14} />
              <p className="text-xs font-semibold text-green-700">
                Your payment is secured by Stripe. We never store your card details.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Cancel */}
              <Button
                variant="bordered"
                className="flex-1 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl"
                onClick={() => router.back()}
                disabled={payLoading}
              >
                Cancel
              </Button>

              {/* Proceed to Payment */}
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200"
                isLoading={payLoading}
                disabled={payLoading}
                startContent={!payLoading && <FaLock size={13} />}
                onClick={handleProceedToPayment}
              >
                {payLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}