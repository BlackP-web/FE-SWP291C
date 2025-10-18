import { api } from "@/lib/api";

export const BrandService = {
  getAllBrands: async () => {
    const res = await api.get("/api/brands");
    return res.data;
  },
};
