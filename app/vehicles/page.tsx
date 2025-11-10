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
  carDetails: any;
}

type Filters = {
  brand?: string;
  model?: string;
  year?: string | number;
  priceMin?: string | number;
  priceMax?: string | number;
  condition?: string;
  batteryHealth?: string;
};

const VehiclesPage = () => {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await ListingService.getListingApprove("car");

        const data = res?.listings || [];
        setAllListings(data);
        setListings(data);
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
      <SearchFilter
        value={filters}
        onChange={(k, v) => setFilters((s) => ({ ...(s || {}), [k]: v }))}
        onApply={(f) => {
          // apply client-side filtering
          const applied = (allListings || []).filter((item) => {
            // brand
            if (f.brand) {
              const b = (item as any).brand?.name || (item as any).brand || "";
              if (!b.toLowerCase().includes(String(f.brand).toLowerCase()))
                return false;
            }
            // year
            if (f.year) {
              if (Number(item.year) !== Number(f.year)) return false;
            }
            // condition
            if (f.condition) {
              if (((item as any).condition || "") !== String(f.condition))
                return false;
            }
            // batteryHealth range like '80-89' or '0-59'
            if (f.batteryHealth) {
              const bh = Number((item as any).batteryHealth ?? -1);
              const parts = String(f.batteryHealth).split("-");
              if (parts.length === 2) {
                const min = Number(parts[0]);
                const max = Number(parts[1]);
                if (isNaN(bh) || bh < min || bh > max) return false;
              }
            }
            // price
            if (f.priceMin) {
              const min = Number(f.priceMin);
              if (!isNaN(min) && Number(item.price ?? 0) < min) return false;
            }
            if (f.priceMax) {
              const max = Number(f.priceMax);
              if (!isNaN(max) && Number(item.price ?? 0) > max) return false;
            }

            return true;
          });
          setListings(applied);
        }}
        onClear={() => {
          setFilters({});
          setListings(allListings);
        }}
      />

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
                batteryPercentage={item?.carDetails?.batteryPercentage || 100}
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
