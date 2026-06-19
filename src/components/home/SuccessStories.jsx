"use client";

import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const stories = [
  {
    id: 1,
    name: "Rakib Hasan",
    role: "Buyer",
    location: "Dhaka",
    avatar: "R",
    avatarColor: "from-blue-400 to-blue-600",
    rating: 5,
    story: "I found an amazing Dell laptop at half the market price! The seller was very honest about the condition and the transaction was smooth. NestBazaar saved me a lot of money!",
    product: "Dell Inspiron Laptop",
    saving: "Saved ৳20,000",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "Seller",
    location: "Chittagong",
    avatar: "N",
    avatarColor: "from-pink-400 to-pink-600",
    rating: 5,
    story: "I sold my old iPhone within 2 days of listing! The platform is so easy to use. I made good money from items I no longer needed. Highly recommend to everyone!",
    product: "iPhone 12 Pro",
    saving: "Earned ৳55,000",
  },
  {
    id: 3,
    name: "Karim Ahmed",
    role: "Buyer",
    location: "Sylhet",
    avatar: "K",
    avatarColor: "from-green-400 to-green-600",
    rating: 5,
    story: "Bought a almost new sofa set for my new apartment at a great price. The seller even helped with delivery. NestBazaar is the best marketplace in Bangladesh!",
    product: "Sofa Set 3+1+1",
    saving: "Saved ৳12,000",
  },
  {
    id: 4,
    name: "Sara Tabassum",
    role: "Seller",
    location: "Rajshahi",
    avatar: "S",
    avatarColor: "from-purple-400 to-purple-600",
    rating: 5,
    story: "As a seller I have made over ৳1 lakh by selling unused items from my home. The buyer protection system gives both parties confidence. Amazing platform!",
    product: "Multiple Items",
    saving: "Earned ৳1,00,000+",
  },
];

export default function SuccessStories() {
  return (
    <section className="py-20 bg-white">
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
            Real Experiences
          </p>
          <h2 className="text-4xl font-black text-gray-900">
            Success{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Hear from our happy buyers and sellers about their NestBazaar experience
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Quote Icon */}
              <FaQuoteLeft className="text-green-200" size={24} />

              {/* Story Text */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {story.story}
              </p>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(story.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={12} />
                ))}
              </div>

              {/* Product & Saving */}
              <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">{story.product}</span>
                <span className="text-xs font-black text-green-600">{story.saving}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${story.avatarColor} flex items-center justify-center text-white font-black shadow-md`}>
                  {story.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-black text-gray-800">{story.name}</p>
                    <MdVerified className="text-green-500" size={14} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {story.role} • {story.location}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}