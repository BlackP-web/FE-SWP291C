import { api } from "@/lib/api";

export const ListingService = {
  getAllListings: async () => {
    const response = await api.get(`/api/listings`);
    return response.data;
  },
  getListingByType: async (type: string) => {
    const response = await api.get(`/api/listings?type=${type}`);
    return response.data;
  },
  getById: async (listingId: string) => {
    const response = await api.get(`/api/listings/${listingId}`);
    return response.data;
  },
  approve: async (listingId: string) => {
    const response = await api.patch(`/api/listings/${listingId}/status`, {
      status: "approved",
    });
    return response.data;
  },
  reject: async (listingId: string) => {
    const response = await api.patch(`/api/listings/${listingId}/status`, {
      status: "rejected",
    });
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
