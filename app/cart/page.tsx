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

export default function CartPage() {
  // Fake cart data tạm thời
  const [cart, setCart] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Tạm thời lấy 3 listing đầu từ API để giả lập giỏ hàng
        const res = await ListingService.getListingByType("car");
        setCart(res.listings.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container-tesla">
          <h1 className="text-3xl font-semibold text-tesla-black mb-8">
            Giỏ hàng của bạn
          </h1>

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {cart.map((item) => (
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
                        item.images?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      batteryHealth={item.batteryCapacity}
                      condition="good"
                      type={item.type as "vehicle" | "battery"}
                      isVerified={true}
                    />
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>

              {/* Tổng giá & Clear Cart */}
              <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="text-xl font-medium text-tesla-black mb-4 md:mb-0">
                  Tổng tiền: {formatPrice(totalPrice)}
                </div>
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Xóa tất cả
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
