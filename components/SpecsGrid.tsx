import React from "react";
import {
  Car,
  Gauge,
  Zap,
  Droplets,
  Settings,
  ClipboardList,
  MapPin,
  Users,
} from "lucide-react";

// ✅ Hàm đọc dữ liệu an toàn hơn
const read = (listing: any, nestedKey: string, topKey?: string) => {
  if (!listing) return null;
  const car = listing?.carDetails || {};
  const battery = listing?.batteryDetails || {};
  const nested = car?.[nestedKey] ?? battery?.[nestedKey];
  const top = topKey ? listing?.[topKey] : listing?.[nestedKey];
  return nested ?? top ?? null;
};

export default function SpecsGrid({ listing }: { listing: any }) {
  // ✅ fallback đảm bảo không lỗi khi listing chưa có type
  const type = listing?.type || "";

  const details =
    type === "car"
      ? [
          {
            icon: <Car />,
            label: "Biển số",
            value: read(listing, "registrationNumber"),
          },
          {
            icon: <ClipboardList />,
            label: "Số chủ sở hữu",
            value: read(listing, "ownerNumber"),
          },
          {
            icon: <Zap />,
            label: "Nhiên liệu",
            value: read(listing, "fuelType"),
          },
          {
            icon: <Settings />,
            label: "Hộp số",
            value: read(listing, "transmission"),
          },
          {
            icon: <Droplets />,
            label: "Màu sắc",
            value: read(listing, "color"),
          },
          {
            icon: <Users />,
            label: "Số ghế ngồi",
            value: read(listing, "seats"),
          },
          {
            icon: <Gauge />,
            label: "Số km đã đi",
            value: (() => {
              const v = read(listing, "kmDriven");
              return v != null ? `${v} km` : null;
            })(),
          },
        ]
      : [
          {
            icon: <Zap />,
            label: "Thương hiệu",
            value: read(listing, "brand"),
          },
          {
            icon: <Zap />,
            label: "Dung lượng",
            value: (() => {
              const v = read(listing, "capacity", "batteryCapacity");
              return v != null ? `${v} kWh` : null;
            })(),
          },
          {
            icon: <Gauge />,
            label: "Điện áp",
            value: (() => {
              const v = read(listing, "voltage");
              return v != null ? `${v} V` : null;
            })(),
          },
          {
            icon: <Droplets />,
            label: "Số chu kỳ sạc/xả",
            value: read(listing, "cyclesUsed"),
          },
          {
            icon: <ClipboardList />,
            label: "Bảo hành",
            value: read(listing, "warranty"),
          },
          {
            icon: <MapPin />,
            label: "Khu vực",
            value: read(listing, "location"),
          },
        ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {details.map((d, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
              {d.icon}
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">
                {d.label}
              </div>
              <div className="text-sm font-bold text-gray-900 mt-1">
                {d.value || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
