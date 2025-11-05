"use client";

import { useEffect } from "react";

export default function TokenHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    if (token) {
      localStorage.setItem("token", token);

      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem("user", JSON.stringify(parsedUser));
        } catch (err) {
          console.error("❌ Lỗi parse userData:", err);
        }
      }

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return null;
}
