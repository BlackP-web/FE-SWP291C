import { api } from "@/lib/api";

export const ListingService = {
  getAllListings: async () => {
    const response = await api.get(`/api/listings`);
    return response.data;
  },
  getListingsBySeller: async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.warn("Chưa có user trong localStorage");
      return;
    }

    const userData = JSON.parse(userString);
    if (!userData?._id) {
      console.warn("User không có _id");
      return;
    }

    const res = await api.get(`/api/listings/seller/${userData._id}`);
    return res.data;
  },
  createListing: async (payload: any) => {
    const response = await api.post("/api/listings", payload);
    return response.data;
  },
  updateListing: async (listingId: string, payload: any) => {
    const response = await api.patch(`/api/listings/${listingId}`, payload);
    return response.data;
  },
  deleteListing: async (listingId: string) => {
    const response = await api.delete(`/api/listings/${listingId}`);
    return response.data;
  },
};
