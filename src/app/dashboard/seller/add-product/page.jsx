"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { FaBoxOpen, FaTag, FaDollarSign, FaList, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

const categories = ["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones", "Other"];
const conditions = ["Like New", "Good", "Refurbished"];

export default function AddProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    images: [""],
    stock: 1,
  });

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

    if (!formData.category) {
      toast.error("Please select a category!");
      return;
    }
    if (!formData.condition) {
      toast.error("Please select a condition!");
      return;
    }
    if (formData.images[0] === "") {
      toast.error("Please add at least one image URL!");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title: formData.title,
        category: formData.category,
        condition: formData.condition,
        price: parseInt(formData.price),
        description: formData.description,
        images: formData.images.filter((img) => img !== ""),
        stock: parseInt(formData.stock),
        sellerInfo: {
          userId: session?.user?.id,
          name: session?.user?.name,
          email: session?.user?.email,
          phone: "",
        },
        status: "available",
        createdAt: new Date(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product listed successfully!");
        router.push("/dashboard/my-products");
      } else {
        toast.error("Failed to add product!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Add Product</h1>
        <p className="text-gray-400 text-sm mt-1">List a new product for sale</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Product Title</label>
            <div className="relative">
              <FaBoxOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Dell Inspiron 15 Laptop"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Category + Condition */}
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

          {/* Price + Stock */}
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
                  placeholder="e.g. 35000"
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
                placeholder="e.g. 1"
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Images */}
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

          {/* Image Preview */}
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

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all mt-2"
          >
            {loading ? "Listing Product..." : "List Product"}
          </Button>

        </form>
      </div>
    </div>
  );
}