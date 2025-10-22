import { api } from "@/lib/api";

export const ReviewService = {
  createOrUpdateReview: async (payload: any) => {
    const response = await api.post("/api/review", payload);
    return response.data;
  },
  getReviewsByListing: async (listingId: string) => {
    const response = await api.get(`/api/review/listing/${listingId}`);
    return response.data;
  },
};
