"use client";

import { useEffect, useState } from "react";
import { Heart, Eye, Gauge, Battery, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ListingService } from "@/service/listing.service";
import { useRouter } from "next/navigation";
import RelatedVehicles from "@/components/RelatedVehicles";
import Reviews from "@/components/Reviews";
import { useAuth } from "@/hooks/useAuth";
import { message } from "antd";

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
  const [mainImage, setMainImage] = useState<string>("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await ListingService.getById(id as string);
        setListing(res.listing);
        setMainImage(res.listing?.images?.[0] || "");
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

  const handleRequireLogin = (action: string) => {
    if (!isAuthenticated) {
      message.info("Vui lòng đăng nhập để " + action + "!");
      router.push("/login");
      return false;
    }
    router.push("/checkout?listingId=" + listing?._id);
    return true;
  };

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
        <div className="container-tesla grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ==== IMAGE GALLERY ==== */}
          <div>
            {/* Main Image */}
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <img
                src={
                  mainImage ||
                  "https://images2.thanhnien.vn/528068263637045248/2024/5/7/edit-vf-3dynamic-opt-1original-wheel-1715080408626820177534.png"
                }
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />

              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-white/30 text-gray-900 hover:bg-white/50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnail List */}
            {listing.images.length > 1 && (
              <div className="flex gap-3 mt-3 justify-center flex-wrap">
                {listing.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      mainImage === img
                        ? "border-blue-500 scale-105"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ==== INFO SIDE ==== */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {listing.title}
              </h1>

              <div className="flex items-center mb-5 space-x-3">
                {listing.brand?.logo && (
                  <img
                    src={listing.brand.logo}
                    alt={listing.brand.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-700 font-medium">
                  {listing.brand.name}
                </span>
                <span className="text-gray-500">• {listing.year}</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  <span>{listing.kmDriven.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  <span>Pin: {listing.batteryCapacity} Wh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Năm: {listing.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>Trạng thái: {listing.status}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {formatPrice(listing.price)}
                </div>
                {listing.aiSuggestedPrice && (
                  <div className="text-gray-500 text-sm">
                    Giá gợi ý AI: {formatPrice(listing.aiSuggestedPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Seller */}
            <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Người bán
              </h3>
              <p className="text-gray-700">Tên: {listing.seller.name}</p>
              <p className="text-gray-700">Email: {listing.seller.email}</p>
              <p className="text-gray-700">SĐT: {listing.seller.phone}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  handleRequireLogin("liên hệ người bán") &&
                  message.success(
                    `Liên hệ ${listing.seller.name} qua số ${listing.seller.phone}`
                  )
                }
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all"
              >
                Liên hệ người bán
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  handleRequireLogin("mua ngay") &&
                  message.success("Chuyển sang trang thanh toán...")
                }
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium shadow-lg hover:bg-green-600 transition-all"
              >
                Mua ngay
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <RelatedVehicles currentType={listing.type} currentId={listing._id} />
      <Reviews listingId={listing._id} />
      <Footer />
    </main>
  );
}
