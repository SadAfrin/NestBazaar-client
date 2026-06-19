"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaLeaf, FaShieldAlt, FaUsers, FaHandshake } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const values = [
  {
    icon: <FaShieldAlt size={24} />,
    title: "Trust & Safety",
    description: "We verify all sellers and ensure secure transactions for every buyer.",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: <FaLeaf size={24} />,
    title: "Sustainability",
    description: "Every second-hand purchase helps reduce waste and protect our planet.",
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
  },
  {
    icon: <FaUsers size={24} />,
    title: "Community",
    description: "We bring buyers and sellers together in a friendly marketplace.",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: <FaHandshake size={24} />,
    title: "Fair Deals",
    description: "We ensure fair pricing and honest dealings for everyone.",
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-50",
  },
];

const team = [
  { name: "Arafat Hossain", role: "Founder & CEO", avatar: "A", color: "from-blue-400 to-blue-600" },
  { name: "Nusrat Jahan", role: "Head of Operations", avatar: "N", color: "from-pink-400 to-pink-600" },
  { name: "Karim Ahmed", role: "Lead Developer", avatar: "K", color: "from-green-400 to-green-600" },
  { name: "Sara Tabassum", role: "Marketing Manager", avatar: "S", color: "from-purple-400 to-purple-600" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6"
          >
            <MdVerified className="text-white" size={16} />
            <span className="text-white text-sm font-semibold">Bangladesh's Trusted Marketplace</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-white mb-4"
          >
            About NestBazaar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-green-100 text-lg max-w-2xl mx-auto"
          >
            We are on a mission to make second-hand buying and selling safe, easy and sustainable for everyone in Bangladesh.
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">Our Story</p>
              <h2 className="text-4xl font-black text-gray-900">
                Why We Built{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  NestBazaar
                </span>
              </h2>
            </div>
            <p className="text-gray-500 leading-relaxed">
              NestBazaar was born from a simple idea — there are millions of perfectly usable products sitting unused in homes across Bangladesh. At the same time, many people are looking for affordable alternatives to buying new.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We built NestBazaar to bridge this gap. Our platform makes it easy for anyone to list their unused items and find buyers who need them. It's good for your wallet, good for the community, and good for the planet.
            </p>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 px-8">
                Join NestBazaar
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((value, index) => (
              <div key={index} className={`${value.bg} rounded-3xl p-6`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  {value.icon}
                </div>
                <h3 className="font-black text-gray-800 mb-2">{value.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">The People</p>
            <h2 className="text-4xl font-black text-gray-900">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-2xl shadow-lg mx-auto mb-4`}>
                  {member.avatar}
                </div>
                <h3 className="font-black text-gray-800">{member.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}