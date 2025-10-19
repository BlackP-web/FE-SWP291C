"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ListingService } from "@/service/listing.service";

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
}

export default function FavoritesPage() {
  // Fake data tạm thời
  const [favorites, setFavorites] = useState<Listing[]>([]);

  // Giả lập fetch data từ API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await ListingService.getListingByType("car");
        setFavorites(res.listings.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container-tesla">
          <h1 className="text-3xl font-semibold text-tesla-black mb-8">
            Yêu thích của bạn
          </h1>

          {favorites.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              Bạn chưa có listing nào trong yêu thích.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item) => (
                <div key={item._id} className="relative">
                  <ProductCard
                    id={item._id}
                    title={item.title}
                    brand={item.brand.name}
                    model={item.type}
                    year={item.year}
                    mileage={item.kmDriven}
                    price={item.price}
                    image={
                      item.images?.[0] || "https://via.placeholder.com/400x300"
                    }
                    batteryHealth={item.batteryCapacity}
                    condition="good"
                    type={item.type as "vehicle" | "battery"}
                    isVerified={true}
                  />
                  <button
                    onClick={() => removeFavorite(item._id)}
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
