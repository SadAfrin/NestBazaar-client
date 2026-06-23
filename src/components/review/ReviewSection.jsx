"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Button } from "@heroui/react";

function StarRating({ rating, setRating, interactive = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
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
            size={interactive ? 24 : 14}
            className={`transition-colors ${
              star <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-200"
            }`}
          />
        </button>
      ))}
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

  // Calculate average rating
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-10 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
            <span className="text-sm text-gray-400">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
          </div>
        </div>

        {/* Write Review Button — only buyers */}
        {session && userRole === "buyer" && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md"
            startContent={<FaStar size={13} />}
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
        >
          <h3 className="font-black text-gray-800 mb-4">Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 block">Rating</label>
              <StarRating rating={rating} setRating={setRating} interactive={true} />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-bold text-gray-600 mb-2 block">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all resize-none"
              />
            </div>

            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md w-full"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
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
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-3">
            <FaStar size={28} className="text-yellow-400" />
          </div>
          <p className="font-black text-gray-700">No Reviews Yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {review.reviewerInfo?.image ? (
                    <img
                      src={review.reviewerInfo.image}
                      alt={review.reviewerInfo.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black">
                      {review.reviewerInfo?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-gray-800 text-sm">
                        {review.reviewerInfo?.name}
                      </p>
                      <MdVerified className="text-green-500" size={13} />
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}