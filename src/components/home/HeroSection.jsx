"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaShieldAlt, FaTruck, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

// ── Typing words ──────────────────────────────────────────────
const typingWords = ["Electronics", "Furniture", "Fashion", "Vehicles", "Mobile Phones"];

// ── Slides ────────────────────────────────────────────────────
const slides = [
  {
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    tag: "Electronics",
    title: "Latest Gadgets",
    subtitle: "Find amazing deals on electronics",
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    tag: "Furniture",
    title: "Home & Living",
    subtitle: "Quality furniture at low prices",
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    tag: "Fashion",
    title: "Trendy Fashion",
    subtitle: "Style at affordable prices",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    tag: "Vehicles",
    title: "Vehicles & More",
    subtitle: "Best deals on pre-owned vehicles",
  },
];

// ── Stats ─────────────────────────────────────────────────────
const stats = [
  { value: 50000, label: "Products Listed", suffix: "K+" },
  { value: 20000, label: "Happy Buyers", suffix: "K+" },
  { value: 10000, label: "Trusted Sellers", suffix: "K+" },
  { value: 99, label: "Satisfaction Rate", suffix: "%" },
];

const badges = [
  { icon: <FaShieldAlt className="text-green-500" />, text: "Secure Payments" },
  { icon: <FaTruck className="text-green-500" />, text: "Fast Delivery" },
  { icon: <MdVerified className="text-green-500" size={18} />, text: "Verified Sellers" },
  { icon: <FaStar className="text-green-500" />, text: "Top Rated" },
];

// ── Counter Hook ──────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ── Single Counter ────────────────────────────────────────────
function AnimatedCounter({ value, label, suffix, start }) {
  const count = useCounter(value, 2000, start);

  const display = () => {
    if (suffix === "K+") return `${Math.floor(count / 1000)}K+`;
    return `${count}${suffix}`;
  };

  return (
    <div className="p-4 text-center border-r border-gray-100 last:border-r-0">
      <p className="text-lg font-black text-green-600">{display()}</p>
      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [counterStarted, setCounterStarted] = useState(false);
  const statsRef = useRef(null);

  // ── Auto slide ──────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ── Typing effect ───────────────────────────────────────────
  useEffect(() => {
    const word = typingWords[wordIndex];
    let timeout;

    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length + 1));
      }, 100);
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length - 1));
      }, 60);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % typingWords.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  // ── Counter observer ────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCounterStarted(true);
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden flex items-center">

      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left Content ── */}
          <div className="space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2"
            >
              <MdVerified className="text-green-500" size={16} />
              <span className="text-sm font-semibold text-green-700">
                Bangladesh's Trusted Marketplace
              </span>
            </motion.div>

            {/* Heading with typing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Buy & Sell
                <span className="block bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent min-h-[1.2em]">
                  {displayed}
                  <span className="animate-pulse text-green-500">|</span>
                </span>
                Easily
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 leading-relaxed max-w-lg"
            >
              NestBazaar is your go-to platform for buying and selling second-hand products safely. Save money, reduce waste, and find great deals!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 rounded-2xl shadow-xl shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all duration-200"
                  endContent={<FaArrowRight size={14} />}
                >
                  Browse Products
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="bordered"
                  className="border-2 border-green-500 text-green-600 font-bold px-8 rounded-2xl hover:bg-green-50 transition-all duration-200"
                >
                  Start Selling
                </Button>
              </Link>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl px-3 py-2 shadow-sm"
                >
                  {badge.icon}
                  <span className="text-xs font-semibold text-gray-600">{badge.text}</span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── Right Content - Slider ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-green-100 overflow-hidden">

              {/* Image slider */}
              <div className="relative h-80 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current}
                    src={slides[current].image}
                    alt={slides[current].title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Slide info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-4 left-4"
                  >
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {slides[current].tag}
                    </span>
                    <h3 className="text-white font-black text-xl mt-1">{slides[current].title}</h3>
                    <p className="text-white/80 text-sm">{slides[current].subtitle}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Arrows */}
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                >
                  <FaChevronLeft size={12} className="text-gray-700" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                >
                  <FaChevronRight size={12} className="text-gray-700" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated Stats Bar */}
              <div
                ref={statsRef}
                className="grid grid-cols-4"
              >
                {stats.map((stat, index) => (
                  <AnimatedCounter
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    start={counterStarted}
                  />
                ))}
              </div>

            </div>

            {/* Floating card top left */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-3 border border-green-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaStar className="text-green-500" size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Top Rated</p>
                  <p className="text-xs text-gray-400">4.9/5 Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Floating card bottom right */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-green-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="text-emerald-500" size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">100% Secure</p>
                  <p className="text-xs text-gray-400">Safe Payments</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}