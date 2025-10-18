import { api } from "@/lib/api";
import { register } from "module";

export const AuthService = {
  register: async (payload: any) => {
    const response = await api.post("/api/auth/register", payload);
    return response;
  },
  login: async (payload: any) => {
    const response = await api.post("/api/auth/login", payload);
    return response;
  },
};
