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
import { message, Tag } from "antd";
import ModalCompareCars from "../ModalCompareCars";
import Lightbox from "@/components/Lightbox";
import PriceRangeBar from "@/components/PriceRangeBar";
import PriceCard from "@/components/PriceCard";
import SpecsGrid from "@/components/SpecsGrid";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await ListingService.getById(id as string);
        // DEBUG: log response shape to confirm where car details live
        // (remove this log after verification)
        console.debug("ListingService.getById response:", res);
        setListing(res.listing ?? res);
        setMainImage(res.listing?.images?.[0] || "");
        setCurrentImageIndex(0);
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

  // tolerant reader: accept either listing.carDetails.* / listing.batteryDetails.* OR top-level listing.*
  const read = (nestedKey: string, topKey?: string) => {
    const cd = listing?.carDetails || listing?.batteryDetails || {};
    const nested = cd?.[nestedKey as any];
    const top = topKey ? (listing as any)[topKey] : (listing as any)[nestedKey];
    return nested ?? top ?? null;
  };

  // ⬇️ Dynamic Info Renderers
  const renderCarDetails = () => {
    const details = [
      {
        icon: <Car />,
        label: "Biển số",
        value: read("registrationNumber", "registrationNumber"),
      },
      {
        icon: <ClipboardList />,
        label: "Số chủ sở hữu",
        value: read("ownerNumber", "ownerNumber"),
      },
      {
        icon: <Zap />,
        label: "Nhiên liệu",
        value: read("fuelType", "fuelType"),
      },
      {
        icon: <Settings />,
        label: "Hộp số",
        value: read("transmission", "transmission"),
      },
      { icon: <Droplets />, label: "Màu sắc", value: read("color", "color") },
      {
        icon: <Gauge />,
        label: "Số km đã đi",
        value: (() => {
          const v = read("kmDriven", "kmDriven");
          return v != null ? `${v} km` : null;
        })(),
      },
      {
        icon: <Battery />,
        label: "Dung lượng pin",
        value: (() => {
          const v = read("batteryCapacity", "batteryCapacity");
          return v != null ? `${v} kWh` : null;
        })(),
      },
      {
        icon: <Shield />,
        label: "Bảo hiểm hết hạn",
        value: formatDate(read("insuranceExpiry", "insuranceExpiry")),
      },
      {
        icon: <FileText />,
        label: "Đăng kiểm hết hạn",
        value: formatDate(read("inspectionExpiry", "inspectionExpiry")),
      },
      {
        icon: <CheckCircle />,
        label: "Lịch sử tai nạn",
        value: read("accidentHistory", "accidentHistory") || "Không có",
      },
      {
        icon: <MapPin />,
        label: "Khu vực",
        value: read("location", "location"),
      },
    ];

    return details.map((detail, index) => <InfoRow key={index} {...detail} />);
  };

  const renderBatteryDetails = () => {
    const details = [
      {
        icon: <Battery />,
        label: "Thương hiệu",
        value: read("brand", "brand"),
      },
      {
        icon: <Zap />,
        label: "Dung lượng",
        value: (() => {
          const v = read("capacity", "batteryCapacity");
          return v != null ? `${v} kWh` : null;
        })(),
      },
      {
        icon: <Gauge />,
        label: "Điện áp",
        value: (() => {
          const v = read("voltage", "voltage");
          return v != null ? `${v} V` : null;
        })(),
      },
      {
        icon: <Droplets />,
        label: "Số chu kỳ sạc/xả",
        value: read("cyclesUsed", "cyclesUsed"),
      },
      {
        icon: <Shield />,
        label: "Tình trạng pin",
        value: (() => {
          const v = read("healthPercentage", "healthPercentage");
          return v != null ? `${v}%` : null;
        })(),
      },
      {
        icon: <ClipboardList />,
        label: "Bảo hành",
        value: read("warranty", "warranty"),
      },
      {
        icon: <Calendar />,
        label: "Ngày sản xuất",
        value: formatDate(read("manufactureDate", "manufactureDate")),
      },
      {
        icon: <FileText />,
        label: "Số seri",
        value: read("serialNumber", "serialNumber"),
      },
      {
        icon: <MapPin />,
        label: "Khu vực",
        value: read("location", "location"),
      },
      {
        icon: <Car />,
        label: "Mẫu xe tương thích",
        value: read("compatibleModels", "compatibleModels")?.length
          ? read("compatibleModels", "compatibleModels").join(", ")
          : "Không có",
      },
    ];

    return details.map((detail, index) => <InfoRow key={index} {...detail} />);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-300 to-cyan-300 rounded-full blur-3xl"
        />
      </div>

      <section className="pt-24 pb-12 relative z-10">
        <div className="container-tesla">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 text-sm text-gray-600"
          >
            <span
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => router.push("/")}
            >
              Trang chủ
            </span>
            <span>/</span>
            <span
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => router.push("/vehicles")}
            >
              Xe điện
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{listing.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: IMAGE GALLERY - 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/60">
                {/* Main Image */}
                <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group">
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={mainImage || listing.images?.[0]}
                    alt={listing.title}
                    onClick={() => {
                      const idx = listing.images?.indexOf(mainImage) ?? 0;
                      setCurrentImageIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                  />

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-xl transition-all shadow-xl ${
                      isLiked
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                    />
                  </motion.button>

                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    <span
                      className={`text-base font-bold px-4 py-2 rounded-full shadow-lg inline-block ${getStatusColorClass(
                        listing.status
                      )}`}
                    >
                      {getStatusLabel(listing.status)}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {listing.images?.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 mt-5 overflow-x-auto pb-2 scrollbar-hide"
                  >
                    {listing.images.map((img: string, i: number) => (
                      <motion.img
                        key={i}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        src={img}
                        alt={`thumb-${i}`}
                        onClick={() => {
                          setMainImage(img);
                          setCurrentImageIndex(i);
                        }}
                        className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-3 transition-all duration-300 shadow-md flex-shrink-0 ${
                          mainImage === img
                            ? "border-blue-500 ring-4 ring-blue-200"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* RIGHT: INFO PANEL - 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <PriceCard
                listing={listing}
                onCompare={() => setShowCompareModal(true)}
                onContact={() => handleRequireLogin("mua ngay")}
              />
            </motion.div>
          </div>

          {/* DETAILS SECTION - Full Width Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Thông tin chi tiết
              </h2>
              <SpecsGrid listing={listing} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Lịch sử tai nạn
              </h2>

              {/* Mô tả nội dung */}
              <div className="text-gray-700 leading-relaxed text-base">
                {listing?.description ? (
                  <p className="whitespace-pre-line">{listing.description}</p>
                ) : (
                  <p className="italic text-gray-500">
                    Chưa có mô tả cho dịch vụ này.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ModalCompareCars
        open={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        listingId={listing._id}
      />

      <Lightbox
        images={listing.images || []}
        initialIndex={currentImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onChange={(i: number) => {
          setCurrentImageIndex(i);
          setMainImage(listing.images?.[i] || mainImage);
        }}
      />

      <RelatedVehicles currentType={listing.type} currentId={listing._id} />
      <Reviews listingId={listing._id} />
      <Footer />
    </main>
  );
}

const InfoRow = ({ icon, label, value }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl group cursor-pointer"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
        {icon}
      </div>
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-gray-900 font-bold text-lg pl-1">{value || "—"}</div>
  </motion.div>
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

const getStatusColorClass = (status: string) => {
  // Monochrome palette: use grayscale tones to match site UI (black/white/gray)
  switch (status) {
    case "approved":
      return "bg-gray-800 text-white";
    case "pending":
      return "bg-gray-600 text-white";
    case "sold":
      return "bg-gray-700 text-white";
    case "rejected":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-800 text-white";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "approved":
      return "Đã kiểm định";
    case "pending":
      return "Lưu trữ";
    case "sold":
      return "Đã bán";
    case "rejected":
      return "Vi phạm";
    default:
      return status?.toUpperCase() || "—";
  }
};
