"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchFilter from "@/components/SearchFilter";
import { ListingService } from "@/service/listing.service";
import Navbar from "@/components/Navbar";

interface Listing {
  _id: string;
  title: string;
  brand?: { name: string };
  year?: number;
  kmDriven?: number;
  price?: number;
  images?: string[];
  status?: string;
}

const VehiclesPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await ListingService.getListingApprove("car");

        setListings(res?.listings || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SearchFilter />

      <div className="container-tesla py-10">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có xe nào được tìm thấy.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                title={item.title || "Không có tên"}
                brand={item.brand?.name || ""}
                model={"-"}
                year={item.year || 0}
                mileage={item.kmDriven || 0}
                price={item.price || 0}
                image={
                  item.images?.[0] ||
                  "https://images2.thanhnien.vn/528068263637045248/2024/5/7/edit-vf-3dynamic-opt-1original-wheel-1715080408626820177534.png"
                }
                batteryHealth={90}
                condition={"good"}
                type={"vehicle"}
                isVerified={item.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
