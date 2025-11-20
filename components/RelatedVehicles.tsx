"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Eye, Gauge, Battery, Calendar } from "lucide-react";
import { ListingService } from "@/service/listing.service";
import { formatVND } from "@/lib/formatCurrency";
import { useRouter } from "next/navigation";

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

interface RelatedVehiclesProps {
  currentType: string;
  currentId?: string;
}

const RelatedVehicles = ({ currentType, currentId }: RelatedVehiclesProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await ListingService.getListingByType(currentType);
        // Lọc bỏ xe hiện tại nếu truyền currentId
        const filtered = currentId
          ? res.listings.filter((item: Listing) => item._id !== currentId)
          : res.listings;
        setListings(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [currentType, currentId]);

  const formatPrice = (price: number) => formatVND(price);

  if (!listings.length) return null; // Không hiển thị nếu không có dữ liệu

  return (
    <section className="pt-12 pb-12 bg-gray-50">
      <div className="container-tesla">
        <h2 className="text-2xl font-semibold text-tesla-black mb-6">
          Xe liên quan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              onClick={() => router.push(`/vehicles/${item._id}`)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={
                    item.images?.[0] ||
                    "https://images2.thanhnien.vn/528068263637045248/2024/5/7/edit-vf-3dynamic-opt-1original-wheel-1715080408626820177534.png"
                  }
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 rounded-full backdrop-blur-md bg-white/20 text-black hover:bg-white/30">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full backdrop-blur-md bg-white/20 text-black hover:bg-white/30">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-tesla-black mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {item.brand.name} • {item.year}
                </p>
                <div className="flex items-center text-gray-700 text-sm mb-2 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-4 h-4" />
                    <span>{item.kmDriven?.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4" />
                    <span>{item.batteryCapacity}</span>
                  </div>
                </div>
                <div className="text-green-600 font-medium text-lg">
                  {formatPrice(item.price)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedVehicles;
