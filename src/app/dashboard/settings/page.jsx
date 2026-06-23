"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Check if new passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check minimum length
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      // BetterAuth changePassword function
      // currentPassword = old password to verify identity
      // newPassword = the new password to set
      // revokeOtherSessions = logout from all other devices
      const { data, error } = await authClient.changePassword({
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Failed to change password!");
        return;
      }

      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error) {
      toast.error("Failed to change password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Change Password</h1>
        <p className="text-gray-400 text-sm mt-1">Update your account password securely</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleChangePassword} className="space-y-4">

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Current Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showOldPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Confirm New Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all mt-2"
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>

        </form>
      </div>

    </div>
  );
}

// password changing code is here in this file