"use client";

import { motion } from "framer-motion";
import { FaStar, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const sellers = [
  {
    id: 1,
    name: "Rakib Hasan",
    avatar: "R",
    avatarColor: "from-blue-400 to-blue-600",
    location: "Dhaka",
    rating: 4.9,
    totalSales: 125,
    totalListings: 45,
    badge: "Top Seller",
    badgeColor: "bg-yellow-100 text-yellow-700",
    speciality: "Electronics",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    avatar: "N",
    avatarColor: "from-pink-400 to-pink-600",
    location: "Chittagong",
    rating: 4.8,
    totalSales: 98,
    totalListings: 32,
    badge: "Verified",
    badgeColor: "bg-green-100 text-green-700",
    speciality: "Fashion",
  },
  {
    id: 3,
    name: "Karim Ahmed",
    avatar: "K",
    avatarColor: "from-green-400 to-green-600",
    location: "Sylhet",
    rating: 4.7,
    totalSales: 87,
    totalListings: 28,
    badge: "Trusted",
    badgeColor: "bg-blue-100 text-blue-700",
    speciality: "Furniture",
  },
  {
    id: 4,
    name: "Sara Tabassum",
    avatar: "S",
    avatarColor: "from-purple-400 to-purple-600",
    location: "Rajshahi",
    rating: 4.9,
    totalSales: 156,
    totalListings: 60,
    badge: "Top Seller",
    badgeColor: "bg-yellow-100 text-yellow-700",
    speciality: "Mobile Phones",
  },
  {
    id: 5,
    name: "Hasan Mahmud",
    avatar: "H",
    avatarColor: "from-orange-400 to-orange-600",
    location: "Khulna",
    rating: 4.6,
    totalSales: 72,
    totalListings: 22,
    badge: "Verified",
    badgeColor: "bg-green-100 text-green-700",
    speciality: "Vehicles",
  },
  {
    id: 6,
    name: "Mitu Begum",
    avatar: "M",
    avatarColor: "from-teal-400 to-teal-600",
    location: "Barishal",
    rating: 4.8,
    totalSales: 110,
    totalListings: 38,
    badge: "Trusted",
    badgeColor: "bg-blue-100 text-blue-700",
    speciality: "Furniture",
  },
];

export default function TrustedSellers() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">
            Meet Our Best
          </p>
          <h2 className="text-4xl font-black text-gray-900">
            Trusted{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Sellers
            </span>
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Shop with confidence from our top-rated and verified sellers
          </p>
        </motion.div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">

                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${seller.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {seller.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-black text-gray-800">{seller.name}</h3>
                      <MdVerified className="text-green-500" size={16} />
                    </div>
                    <p className="text-xs text-gray-400">{seller.location}</p>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">{seller.speciality} Specialist</p>
                  </div>
                </div>

                {/* Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${seller.badgeColor}`}>
                  {seller.badge}
                </span>

              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaStar className="text-yellow-400" size={12} />
                    <p className="font-black text-gray-800 text-sm">{seller.rating}</p>
                  </div>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaCheckCircle className="text-green-500" size={12} />
                    <p className="font-black text-gray-800 text-sm">{seller.totalSales}</p>
                  </div>
                  <p className="text-xs text-gray-400">Sales</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FaShoppingBag className="text-blue-500" size={12} />
                    <p className="font-black text-gray-800 text-sm">{seller.totalListings}</p>
                  </div>
                  <p className="text-xs text-gray-400">Listings</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}