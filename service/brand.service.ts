import { api } from "@/lib/api";

export const BrandService = {
  getAllBrands: async () => {
    const res = await api.get("/api/brands");
    return res.data;
  },
  createBrand: async (payload: any) => {
    const res = await api.post("/api/brands", payload);
    return res.data;
  },
  updateBrand: async (brandId: string, payload: any) => {
    const res = await api.put(`/api/brands/${brandId}`, payload);
    return res.data;
  },
};
