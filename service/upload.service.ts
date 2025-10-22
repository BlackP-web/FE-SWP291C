import { api } from "@/lib/api";

export const UploadService = {
  uploadSingleImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  uploadMultipleImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await api.post("/api/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  deleteImage: async (publicId: string) => {
    const response = await api.delete(`/api/upload/${publicId}`);
    return response.data;
  },
};
