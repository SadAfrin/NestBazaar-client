"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaSearch, FaTrash, FaBan, FaCheck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSession } from "@/lib/auth-client";

const roleColors = {
  "buyer": "bg-blue-100 text-blue-700",
  "seller": "bg-green-100 text-green-700",
  "admin": "bg-purple-100 text-purple-700",
};

const statusColors = {
  "active": "bg-green-100 text-green-700",
  "blocked": "bg-red-100 text-red-700",
};

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`
      );
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (email, status) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ email, status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`User ${status} successfully!`);
        fetchUsers();
      } else {
        toast.error("Failed to update user status!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleUpdateRole = async (email, role) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/update-role`,
        {
          method: "PATCH",
          body: JSON.stringify({ email, role }),
        }
      );
      const data = await res.json();

      if (data.success) {
        await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/update-betterauth-role`,
          {
            method: "PATCH",
            body: JSON.stringify({ email, role }),
          }
        );
        toast.success(`User role updated to ${role}!`);
        fetchUsers();
      } else {
        toast.error("Failed to update role!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (email) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users?email=${email}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to delete user!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Check if user is protected (admin or current logged in user)
  const isProtected = (user) =>
    user.role === "admin" || user.email === session?.user?.email;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Manage Users</h1>
        <p className="text-gray-400 text-sm mt-1">{users.length} total users</p>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-inner">
              <FaUsers size={40} className="text-blue-400" />
            </div>
            <p className="text-gray-700 font-black text-lg">No Users Found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== filteredUsers.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                    <MdVerified className="text-green-500 shrink-0" size={12} />
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${roleColors[user.role] || "bg-gray-100 text-gray-700"}`}>
                  {user.role}
                </span>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <p className="text-sm text-gray-500">{user.location || "N/A"}</p>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[user.status] || "bg-gray-100 text-gray-700"}`}>
                  {user.status || "active"}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                {isProtected(user) ? (
                  // Show label for protected users
                  <span className="text-xs text-gray-400 font-bold px-2 py-1 bg-gray-50 rounded-lg">
                    {user.email === session?.user?.email ? "You" : "Admin"}
                  </span>
                ) : (
                  <>
                    {/* Role Change */}
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.email, e.target.value)}
                      className="text-xs font-bold text-gray-600 bg-gray-100 border-0 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Block/Unblock */}
                    {user.status === "blocked" ? (
                      <button
                        onClick={() => handleUpdateStatus(user.email, "active")}
                        className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-all"
                        title="Unblock"
                      >
                        <FaCheck size={13} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(user.email, "blocked")}
                        className="w-8 h-8 rounded-lg bg-yellow-50 hover:bg-yellow-100 flex items-center justify-center text-yellow-600 transition-all"
                        title="Block"
                      >
                        <FaBan size={13} />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all"
                      title="Delete"
                    >
                      <FaTrash size={13} />
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}