"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  listingId: string;
}

// Fake data tạm thời
const fakeReviews: Review[] = [
  {
    id: "1",
    name: "Nguyen Van A",
    rating: 5,
    comment: "Xe đẹp, chất lượng tốt!",
    date: "2025-10-19",
  },
  {
    id: "2",
    name: "Tran Thi B",
    rating: 4,
    comment: "Tạm ổn, hơi mắc so với giá thị trường.",
    date: "2025-10-18",
  },
  {
    id: "3",
    name: "Le Van C",
    rating: 3,
    comment: "Xe bình thường, cần kiểm tra kỹ trước khi mua.",
    date: "2025-10-17",
  },
];

const Reviews = ({ listingId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(fakeReviews);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;

    const review: Review = {
      id: (reviews.length + 1).toString(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([review, ...reviews]);
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  return (
    <section className="pt-12 pb-12 bg-white">
      <div className="container-tesla">
        <h2 className="text-2xl font-semibold text-tesla-black mb-6">
          Đánh giá
        </h2>

        {/* Form thêm đánh giá */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Viết đánh giá
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="px-4 py-2 border border-gray-200 rounded-xl w-full"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="px-4 py-2 border border-gray-200 rounded-xl w-full"
            >
              <option value={0}>Chọn đánh giá</option>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <textarea
            placeholder="Viết bình luận của bạn..."
            className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddReview}
            className="px-6 py-3 bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Gửi đánh giá
          </motion.button>
        </div>

        {/* List đánh giá */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-gray-50 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{review.name}</span>
                <span className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <span className="text-gray-400 text-sm">{review.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
