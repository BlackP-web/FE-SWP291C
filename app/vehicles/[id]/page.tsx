"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Eye,
  Gauge,
  Battery,
  Calendar,
  MapPin,
  FileText,
  Car,
  Shield,
  Settings,
  Droplets,
  Zap,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ListingService } from "@/service/listing.service";
import { useRouter } from "next/navigation";
import RelatedVehicles from "@/components/RelatedVehicles";
import Reviews from "@/components/Reviews";
import { useAuth } from "@/hooks/useAuth";
import { message, Tag, Divider } from "antd";
import ModalCompareCars from "../ModalCompareCars";

export default function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [listing, setListing] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const [showCompareModal, setShowCompareModal] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải dữ liệu...
      </div>
    );

  // ⬇️ Dynamic Info Renderers
  const renderCarDetails = () => (
    <div className="space-y-3">
      <InfoRow
        icon={<Car />}
        label="Biển số"
        value={listing.carDetails?.registrationNumber}
      />
      <InfoRow
        icon={<ClipboardList />}
        label="Số chủ sở hữu"
        value={listing.carDetails?.ownerNumber}
      />
      <InfoRow
        icon={<Zap />}
        label="Nhiên liệu"
        value={listing.carDetails?.fuelType}
      />
      <InfoRow
        icon={<Settings />}
        label="Hộp số"
        value={listing.carDetails?.transmission}
      />
      <InfoRow
        icon={<Droplets />}
        label="Màu sắc"
        value={listing.carDetails?.color}
      />
      <InfoRow
        icon={<Gauge />}
        label="Số km đã đi"
        value={`${listing.carDetails?.kmDriven ?? 0} km`}
      />
      <InfoRow
        icon={<Battery />}
        label="Dung lượng pin"
        value={`${listing.carDetails?.batteryCapacity ?? 0} kWh`}
      />
      <InfoRow
        icon={<Shield />}
        label="Bảo hiểm hết hạn"
        value={formatDate(listing.carDetails?.insuranceExpiry)}
      />
      <InfoRow
        icon={<FileText />}
        label="Đăng kiểm hết hạn"
        value={formatDate(listing.carDetails?.inspectionExpiry)}
      />
      <InfoRow
        icon={<CheckCircle />}
        label="Lịch sử tai nạn"
        value={listing.carDetails?.accidentHistory || "Không có"}
      />
      <InfoRow
        icon={<MapPin />}
        label="Khu vực"
        value={listing.carDetails?.location}
      />
    </div>
  );

  const renderBatteryDetails = () => (
    <div className="space-y-3">
      <InfoRow
        icon={<Battery />}
        label="Thương hiệu"
        value={listing.batteryDetails?.brand}
      />
      <InfoRow
        icon={<Zap />}
        label="Dung lượng"
        value={`${listing.batteryDetails?.capacity} kWh`}
      />
      <InfoRow
        icon={<Gauge />}
        label="Điện áp"
        value={`${listing.batteryDetails?.voltage} V`}
      />
      <InfoRow
        icon={<Droplets />}
        label="Số chu kỳ sạc/xả"
        value={listing.batteryDetails?.cyclesUsed}
      />
      <InfoRow
        icon={<Shield />}
        label="Tình trạng pin"
        value={`${listing.batteryDetails?.healthPercentage}%`}
      />
      <InfoRow
        icon={<ClipboardList />}
        label="Bảo hành"
        value={listing.batteryDetails?.warranty}
      />
      <InfoRow
        icon={<Calendar />}
        label="Ngày sản xuất"
        value={formatDate(listing.batteryDetails?.manufactureDate)}
      />
      <InfoRow
        icon={<FileText />}
        label="Số seri"
        value={listing.batteryDetails?.serialNumber}
      />
      <InfoRow
        icon={<MapPin />}
        label="Khu vực"
        value={listing.batteryDetails?.location}
      />
      <InfoRow
        icon={<Car />}
        label="Mẫu xe tương thích"
        value={
          listing.batteryDetails?.compatibleModels?.length
            ? listing.batteryDetails.compatibleModels.join(", ")
            : "Không có"
        }
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container-tesla grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* IMAGE GALLERY */}
          <div>
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <img
                src={mainImage || listing.images?.[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
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

          {/* INFO SIDE */}
          <div className="flex flex-col justify-between">
            {/* Title */}
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
                <Tag color={getStatusColor(listing.status)}>
                  {listing.status.toUpperCase()}
                </Tag>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 shadow-sm mb-6">
                {listing.type === "car"
                  ? renderCarDetails()
                  : renderBatteryDetails()}
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(listing.price)}
                </div>
                {listing.aiSuggestedPrice && (
                  <div className="text-gray-500 text-sm">
                    Giá gợi ý AI: {formatPrice(listing.aiSuggestedPrice)}
                  </div>
                )}
              </div>
            </div>

            <Divider />
            <div className="p-5 bg-white border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Người bán
              </h3>
              <p className="text-gray-700">👤 {listing.seller.name}</p>
            </div>

            {/* Actions */}
            {listing.status !== "sold" && (
              <div className="mt-6 flex flex-wrap gap-4">
                {listing.type === "car" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCompareModal(true)}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:bg-blue-600"
                  >
                    So sánh xe
                  </motion.button>
                )}

                <ModalCompareCars
                  open={showCompareModal}
                  onClose={() => setShowCompareModal(false)}
                  listingId={listing._id}
                />

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    handleRequireLogin("mua ngay") &&
                    message.success("Chuyển sang trang thanh toán...")
                  }
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium shadow-lg hover:bg-green-600"
                >
                  Liên hệ người bán
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>

      <RelatedVehicles currentType={listing.type} currentId={listing._id} />
      <Reviews listingId={listing._id} />
      <Footer />
    </main>
  );
}

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 text-gray-700">
    <div className="w-5 h-5 text-gray-500">{icon}</div>
    <span className="font-medium">{label}:</span>
    <span className="text-gray-600">{value || "—"}</span>
  </div>
);

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "—";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "green";
    case "pending":
      return "orange";
    case "sold":
      return "volcano";
    case "rejected":
      return "red";
    default:
      return "blue";
  }
};
