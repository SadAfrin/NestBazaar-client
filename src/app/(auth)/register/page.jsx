"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn, signOut, useSession } from "@/lib/auth-client";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaShoppingBag, FaStore, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import RoleSelectionModal from "@/components/shared/RoleSelectionModal";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEmailRegistering, setIsEmailRegistering] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    role: "buyer",
  });

  const passwordConditions = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
  ];

  const isPasswordValid = passwordConditions.every((c) => c.test(formData.password));

  useEffect(() => {
    if (!session?.user) return;
    if (isEmailRegistering) return;
    const checkUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/check?email=${session.user.email}`
        );
        const data = await res.json();
        if (!data.exists) {
          setShowRoleModal(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkUser();
  }, [session, isEmailRegistering]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEmailRegistering(true);

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements!");
      setIsEmailRegistering(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signUp.email({
        name: formData.name,
        email: formData.email.toLowerCase(), // ← fixed
        password: formData.password,
        callbackURL: "/login",
        role: formData.role,
        location: formData.location,
      });

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.toLowerCase(), // ← fixed
          role: formData.role,
          location: formData.location,
        }),
      });

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created successfully! Please login.");
            window.location.href = "/login";
          },
        },
      });
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/register",
      });
    } catch (err) {
      toast.error("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-green-100 p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-start mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-green-600 transition-colors text-sm font-semibold"
              >
                <FaArrowLeft size={12} />
                Back to Home
              </Link>
            </div>
            <div className="flex justify-center mb-4">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-base">NB</span>
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">NestBazaar</span>
                  <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Marketplace</span>
                </div>
              </Link>
            </div>
            <h1 className="text-2xl font-black text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join thousands of buyers and sellers</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "buyer" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                formData.role === "buyer"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300"
              }`}
            >
              <FaShoppingBag size={14} />
              I'm a Buyer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "seller" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                formData.role === "seller"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300"
              }`}
            >
              <FaStore size={14} />
              I'm a Seller
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all appearance-none"
              >
                <option value="">Select Location</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 mb-2">Password Requirements:</p>
                {passwordConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      condition.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}>
                      {condition.test(formData.password) ? (
                        <FaCheck size={8} className="text-white" />
                      ) : (
                        <FaTimes size={8} className="text-gray-400" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      condition.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}>
                      {condition.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              disabled={loading || !isPasswordValid}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.01] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
          >
            <FaGoogle size={16} className="text-red-500" />
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-bold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* Role Selection Modal — Google only */}
      {showRoleModal && (
        <RoleSelectionModal
          session={session}
          onComplete={() => {
            setShowRoleModal(false);
            router.push("/");
          }}
        />
      )}

    </div>
  );
}