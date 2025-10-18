import { api } from "@/lib/api";

export const ListingService = {
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
};
