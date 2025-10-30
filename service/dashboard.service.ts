import { api } from "@/lib/api";

export const DashboardService = {
  getDashboardAdmin: async () => {
    const response = await api.get("/api/dashboard/summary");
    return response.data;
  },
  getSellerDashboard: async (userId: string) => {
    const res = await api.get(`/api/dashboard/seller/${userId}`);
    return res.data;
  },
};
