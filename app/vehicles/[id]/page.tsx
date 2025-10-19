"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Eye, Gauge, Battery, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ListingService } from "@/service/listing.service";
import { useRouter } from "next/navigation";
import RelatedVehicles from "@/components/RelatedVehicles";

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
  aiSuggestedPrice?: number;
  images: string[];
  status: string;
}

export default function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await ListingService.getById(id as string);
        setListing(res.listing);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListing();
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  if (!listing)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container-tesla grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src={
                listing.images?.[0] ||
                "https://images2.thanhnien.vn/528068263637045248/2024/5/7/edit-vf-3dynamic-opt-1original-wheel-1715080408626820177534.png"
              }
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />

            {/* Like Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-black hover:bg-white/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            {/* Title & Brand */}
            <div>
              <h1 className="text-3xl font-semibold text-tesla-black mb-2">
                {listing.title}
              </h1>
              <div className="flex items-center mb-4 space-x-3">
                <img
                  src={listing.brand.logo}
                  alt={listing.brand.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-700 font-medium">
                  {listing.brand.name}
                </span>
                <span className="text-gray-500">• {listing.year}</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5" />
                  <span>{listing.kmDriven.toLocaleString()} km</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery className="w-5 h-5" />
                  <span>Pin: {listing.batteryCapacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Năm: {listing.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Trạng thái: {listing.status}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-light text-tesla-black mb-4">
                {formatPrice(listing.price)}
              </div>
              {listing.aiSuggestedPrice && (
                <div className="text-gray-500 mb-4">
                  Giá gợi ý AI: {formatPrice(listing.aiSuggestedPrice)}
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Người bán
              </h3>
              <p className="text-gray-700">Tên: {listing.seller.name}</p>
              <p className="text-gray-700">Email: {listing.seller.email}</p>
              <p className="text-gray-700">SĐT: {listing.seller.phone}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Liên hệ người bán
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300"
              >
                Mua ngay
              </motion.button>
            </div>
          </div>
        </div>
      </section>
      <RelatedVehicles currentType={listing.type} currentId={listing._id} />

      <Footer />
    </main>
  );
}
