"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/hooks/useAuth";
import { FavoriteService } from "@/service/favorite.service";

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
  country: string;
}

interface Listing {
  _id: string;
  seller: Seller;
  type: string;
  title: string;
  brand: Brand;
  year: number;
  batteryCapacity: number;
  kmDriven: number;
  price: number;
  images: string[];
  status: string;
  carDetails: any;
}

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // Lấy danh sách yêu thích từ API khi user có dữ liệu
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoadingFavorites(true);
      try {
        const res = await FavoriteService.getFavorites(user._id);
        console.log({ res });
        // Giả sử API trả về array các listing
        setFavorites(res?.favorites?.listings || []);
      } catch (err) {
        console.error("Lỗi khi fetch favorites:", err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Xóa favorite cả local và gọi API toggle
  const handleRemoveFavorite = async (listingId: string) => {
    if (!user) return;
    try {
      await FavoriteService.toggleFavorite({ userId: user._id, listingId });
      setFavorites((prev) => prev.filter((item) => item._id !== listingId));
    } catch (err) {
      console.error("Lỗi khi xóa favorite:", err);
    }
  };

  if (loading || loadingFavorites) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span>Đang tải...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container-tesla">
          <h1 className="text-3xl font-semibold text-tesla-black mb-8">
            Yêu thích của bạn
          </h1>

          {favorites?.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              Bạn chưa có listing nào trong yêu thích.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites?.map((item) => (
                <div key={item._id} className="relative">
                  <ProductCard
                    id={item._id}
                    title={item.title}
                    brand={item.brand.name}
                    model={item.type}
                    year={item.year}
                    batteryPercentage={
                      item?.carDetails?.batteryPercentage || 100
                    }
                    mileage={item.kmDriven}
                    price={item.price}
                    image={
                      item.images?.[0] || "https://via.placeholder.com/400x300"
                    }
                    batteryHealth={item.batteryCapacity}
                    condition="good"
                    type={item.type as "vehicle" | "battery"}
                    isVerified={item.status} // có thể map status sang "approved"/"sold"
                    initialLiked={true} // vì đây là danh sách favorite
                  />
                  <button
                    onClick={() => handleRemoveFavorite(item._id)}
                    className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
