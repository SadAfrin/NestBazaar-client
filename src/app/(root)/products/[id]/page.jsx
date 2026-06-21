"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowLeft, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: session } = useSession();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-6xl mb-4">😕</p>
        <p className="text-xl font-black text-gray-700">Product not found</p>
        <Button
          onClick={() => router.push("/products")}
          className="mt-4 bg-green-500 text-white font-bold rounded-2xl"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 font-semibold"
        >
          <FaArrowLeft size={14} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={product.images?.[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-xl ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                {product.condition}
              </span>
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-green-500 shadow-md"
                        : "border-gray-100 hover:border-green-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right — Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Category */}
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-4xl font-black text-green-600">
                ৳{product.price?.toLocaleString()}
              </p>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                {product.condition}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-black text-gray-800 mb-3">Description</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <h3 className="font-black text-gray-800">Seller Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                  {product.sellerInfo?.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-black text-gray-800">{product.sellerInfo?.name}</p>
                    <MdVerified className="text-green-500" size={16} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={10} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">5.0</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaEnvelope className="text-green-500" size={14} />
                  <span>{product.sellerInfo?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaPhone className="text-green-500" size={14} />
                  <span>{product.sellerInfo?.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-green-500" size={14} />
                  <span>{product.sellerInfo?.location || "Bangladesh"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all"
                startContent={<FaShoppingCart size={14} />}
                onClick={async () => {
                    if (!session) {
                        toast.warn("Please login to place an order!");
                        router.push("/login");
                        return;
                    }
                    try {
                        toast.info("Redirecting to payment...");
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
                    }
                }}
              >
                Place Order
              </Button>
              <Button
                variant="bordered"
                className="border-2 border-green-500 text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all"
                startContent={<FaHeart size={14} />}
                onClick={async () => {
                    if (!session) {
                    toast.warn("Please login to add to wishlist!");
                    router.push("/login");
                    return;
                    }
                    try {
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        email: session.user.email,
                        productId: product._id,
                        }),
                    });
                    toast.success("Added to wishlist!");
                    } catch (error) {
                    toast.error("Failed to add to wishlist!");
                    }
                }}
                >
                Wishlist
              </Button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}