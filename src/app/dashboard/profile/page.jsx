"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { FaUser, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photo: "",
    role: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const { data: tokenData } = await authClient.token();
        // console.log("JWT Token:", tokenData?.token);

        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile?email=${session?.user?.email}`
        );
        const data = await res.json();
        // console.log("Profile response:", data);
        if (data.success) {
          setFormData({
            name: data.data.name || "",
            email: data.data.email || "",
            phone: data.data.phone || "",
            location: data.data.location || "",
            photo: data.data.photo || "",
            role: data.data.role || "",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    };
    if (session?.user?.email) fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (data.success) {
        await authClient.updateUser({
          name: formData.name,
          image: formData.photo,
          location: formData.location,
        });
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-black text-gray-800">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt={formData.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-green-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {formData.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-green-600 transition-all">
              <FaCamera size={10} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-black text-gray-800 text-lg">{formData.name}</p>
            <p className="text-gray-400 text-sm">{formData.email}</p>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full capitalize mt-1 inline-block">
              {formData.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-gray-800 mb-6">Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Location</label>
            <div className="relative">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all appearance-none"
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
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Profile Photo URL</label>
            <div className="relative">
              <FaCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 transition-all mt-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>

        </form>
      </div>

    </div>
  );
}