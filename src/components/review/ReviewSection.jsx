"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Button } from "@heroui/react";

function StarRating({ rating, setRating, interactive = false, size = 14 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <FaStar
            size={size}
            className={`transition-all duration-150 ${
              star <= (hover || rating)
                ? "text-yellow-400 drop-shadow-sm"
                : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-500 w-8">{label}★</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
        />
      </div>
      <span className="text-xs font-bold text-gray-400 w-4">{count}</span>
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews/${productId}`
      );
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/role?email=${session.user.email}`
        );
        const data = await res.json();
        if (data.success) setUserRole(data.role);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRole();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`,
        {
          method: "POST",
          body: JSON.stringify({
            productId,
            reviewerInfo: {
              userId: session.user.id,
              name: session.user.name,
              image: session.user.image || null,
            },
            rating,
            comment,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Review added successfully!");
        setComment("");
        setRating(5);
        setShowForm(false);
        fetchReviews();
      } else {
        toast.error("Failed to add review!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    label: star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="mt-12">

      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Customer Reviews</h2>
          <p className="text-gray-400 text-sm mt-1">
            What buyers are saying about this product
          </p>
        </div>
        {session && userRole === "buyer" && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className={`font-bold rounded-xl shadow-md transition-all ${
              showForm
                ? "bg-gray-100 text-gray-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            }`}
            startContent={<FaStar size={13} />}
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
      </div>

      {/* Stats + Form Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Rating Summary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-7xl font-black text-gray-800">{avgRating}</p>
          <StarRating rating={Math.round(avgRating)} size={20} />
          <p className="text-sm text-gray-400 mt-2 font-semibold">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Bars */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3 lg:col-span-2">
          <p className="text-sm font-black text-gray-700 mb-4">Rating Breakdown</p>
          {ratingCounts.map((item) => (
            <RatingBar
              key={item.label}
              label={item.label}
              count={item.count}
              total={reviews.length}
            />
          ))}
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6">
              <h3 className="font-black text-gray-800 text-lg mb-5">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-3 block">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rating} setRating={setRating} interactive={true} size={32} />
                    <span className="text-sm font-bold text-gray-500 ml-2">
                      {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 block">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your honest experience with this product..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all resize-none shadow-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">{comment.length}/500 characters</p>
                </div>

                <Button
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 w-full py-3"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 animate-pulse space-y-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FaStar size={36} className="text-yellow-400" />
          </div>
          <p className="font-black text-gray-700 text-lg">No Reviews Yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-green-100 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {review.reviewerInfo?.image ? (
                    <img
                      src={review.reviewerInfo.image}
                      alt={review.reviewerInfo.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                      {review.reviewerInfo?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-black text-gray-800 text-sm">
                        {review.reviewerInfo?.name}
                      </p>
                      <MdVerified className="text-green-500" size={14} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={16} />
              </div>

              <div className="relative">
                <FaQuoteLeft className="text-green-100 absolute -top-1 -left-1" size={20} />
                <p className="text-sm text-gray-600 leading-relaxed pl-6">
                  {review.comment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}