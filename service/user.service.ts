import { api } from "@/lib/api";

export const UserService = {
  getAll: async () => {
    const response = await api.get("/api/users");
    return response.data;
  },
  getById: async (userId: string) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
  update: async (userId: string, payload: any) => {
    const response = await api.patch(`/api/users/${userId}`, payload);
    return response.data;
  },
  banToggle: async (userId: string, payload: any) => {
    const response = await api.patch(`/api/users/${userId}/ban`);
    return response.data;
  },
};
