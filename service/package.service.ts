import { api } from "@/lib/api";

export const PackageService = {
  createPackage: async (payload: any) => {
    const response = await api.post("/api/packages", payload);
    return response.data;
  },

  updatePackage: async (id: string, payload: any) => {
    const response = await api.put(`/api/packages/${id}`, payload);
    return response.data;
  },

  getAllPackages: async () => {
    const response = await api.get("/api/packages");
    return response.data;
  },

  assignPackageToUser: async (payload: any) => {
    const response = await api.post("/api/packages/assign", payload);
    return response.data;
  },

  getUserPackages: async (userId: string) => {
    const response = await api.get(`/api/packages/user/${userId}`);
    return response.data;
  },

  getUserCountByPackage: async (packageId: string) => {
    const response = await api.get(`/api/packages/${packageId}/user-count`);
    return response.data;
  },

  getUsersByPackage: async (packageId: string) => {
    const response = await api.get(`/api/packages/${packageId}/users`);
    return response.data;
  },
};
