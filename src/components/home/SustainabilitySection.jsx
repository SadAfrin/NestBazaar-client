"use client";

import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaTree, FaWater } from "react-icons/fa";
import { MdCo2 } from "react-icons/md";

const impacts = [
  {
    icon: <FaRecycle size={24} />,
    value: "15,000+",
    label: "Items Recycled",
    description: "Products given a second life instead of ending up in landfill",
    color: "from-green-400 to-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: <FaTree size={24} />,
    value: "5,000+",
    label: "Trees Saved",
    description: "Equivalent trees saved through sustainable buying and selling",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: <FaWater size={24} />,
    value: "2M+",
    label: "Liters Water Saved",
    description: "Water saved by reusing products instead of manufacturing new ones",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: <MdCo2 size={24} />,
    value: "500+",
    label: "Tons CO₂ Reduced",
    description: "Carbon emissions prevented through second-hand purchases",
    color: "from-teal-400 to-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
];

export default function SustainabilitySection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">
                Our Planet
              </p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Shopping That{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Saves The Planet
                </span>
              </h2>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg">
              Every second-hand purchase you make on NestBazaar helps reduce waste, save resources, and protect our environment for future generations.
            </p>

            <p className="text-gray-500 leading-relaxed">
              By choosing pre-owned products, you are not just saving money — you are making a conscious choice to reduce the environmental impact of manufacturing new products.
            </p>

            {/* Green Badge */}
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-md">
                <FaLeaf size={18} />
              </div>
              <div>
                <p className="font-black text-green-700 text-sm">Eco-Friendly Marketplace</p>
                <p className="text-xs text-green-500">Join 30,000+ conscious shoppers</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Impact Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {impacts.map((impact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`${impact.bg} ${impact.border} border rounded-3xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${impact.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  {impact.icon}
                </div>
                <p className="text-2xl font-black text-gray-800 mb-1">{impact.value}</p>
                <p className="text-sm font-bold text-gray-700 mb-2">{impact.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{impact.description}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}