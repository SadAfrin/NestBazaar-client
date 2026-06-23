"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import RoleSelectionModal from "@/components/shared/RoleSelectionModal";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!session?.user) return;
    if (!isLoggingIn) return;
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
  }, [session, isLoggingIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error } = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        setError(error.message || "Login failed. Please try again.");
        return;
      }

      setIsLoggingIn(true);
      toast.success("Welcome back to NestBazaar!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/login",
      });
    } catch (err) {
      toast.error("Google login failed. Please try again.");
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
            <h1 className="text-2xl font-black text-gray-800">Welcome Back!</h1>
            <p className="text-sm text-gray-500 mt-1">Login to your NestBazaar account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.01] transition-all duration-200 mt-2"
            >
              {loading ? "Logging in..." : "Login"}
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
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
          >
            <FaGoogle size={16} className="text-red-500" />
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-600 font-bold hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>

      {/* Role Selection Modal */}
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