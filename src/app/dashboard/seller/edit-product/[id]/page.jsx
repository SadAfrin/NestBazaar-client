"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@heroui/react";
import { FaBoxOpen, FaTag, FaDollarSign, FaList, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const categories = ["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones", "Other"];
const conditions = ["Like New", "Good", "Refurbished"];

export default function EditProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    images: [""],
    stock: 1,
    status: "available",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Public route — no token needed
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`
        );
        const data = await res.json();
        if (data.success) {
          const p = data.data;
          setFormData({
            title: p.title || "",
            category: p.category || "",
            condition: p.condition || "",
            price: p.price || "",
            description: p.description || "",
            images: p.images?.length > 0 ? p.images : [""],
            stock: p.stock || 1,
            status: p.status || "available",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if (formData.images.length < 4) {
      setFormData({ ...formData, images: [...formData.images, ""] });
    } else {
      toast.warn("Maximum 4 images allowed!");
    }
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/update/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...formData,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock),
            images: formData.images.filter((img) => img !== ""),
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Product updated successfully!");
        router.push("/dashboard/seller/my-products");
      } else {
        toast.error("Failed to update product!");
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
        <h1 className="text-2xl font-black text-gray-800">Edit Product</h1>
        <p className="text-gray-400 text-sm mt-1">Update your product information</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Product Title</label>
            <div className="relative">
              <FaBoxOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Category</label>
              <div className="relative">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Condition</label>
              <div className="relative">
                <FaList className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select Condition</option>
                  {conditions.map((con) => (
                    <option key={con} value={con}>{con}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Price (৳)</label>
              <div className="relative">
                <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all appearance-none"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">
              Product Images (URL) — Max 4
            </label>
            <div className="space-y-2">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="w-10 h-10 mt-1 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-sm text-green-600 font-bold hover:underline"
                >
                  + Add another image
                </button>
              )}
            </div>
          </div>

          {formData.images[0] && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-600">Preview</label>
              <div className="flex gap-3 flex-wrap">
                {formData.images.filter(img => img !== "").map((img, index) => (
                  <div key={index} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={img}
                      alt={`preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = "https://via.placeholder.com/80"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="bordered"
              className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl"
              onClick={() => router.push("/dashboard/seller/my-products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all"
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}