"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Spin, Empty } from "antd";
import { ReviewService } from "@/service/review.service";

interface Review {
  _id: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsProps {
  listingId: string;
}

const Reviews = ({ listingId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await ReviewService.getReviewsByListing(listingId);
      setReviews(res.reviews || []);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) fetchReviews();
  }, [listingId]);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );

  if (reviews.length === 0)
    return (
      <div className="flex justify-center py-12">
        <Empty description="Chưa có đánh giá nào cho sản phẩm này." />
      </div>
    );

  return (
    <section className="pt-10 pb-12 bg-white">
      <div className="container-tesla">
        <h2 className="text-2xl font-semibold text-tesla-black mb-6">
          Đánh giá từ người mua
        </h2>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {review.reviewer?.avatar ? (
                    <img
                      src={review.reviewer.avatar}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      {review.reviewer?.name?.[0] || "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.reviewer?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
