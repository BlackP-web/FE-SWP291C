"use client";

import React, { useEffect, useState } from "react";
import { Modal, Card, Button, message, Spin, Table, Tag } from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ListingService } from "@/service/listing.service";

interface ModalCompareCarsProps {
  open: boolean;
  onClose: () => void;
  listingId: string; // xe hiện tại
}

export default function ModalCompareCars({
  open,
  onClose,
  listingId,
}: ModalCompareCarsProps) {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [comparing, setComparing] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await ListingService.getListingByType("car");
      const list = res.listings || res || [];
      setCars(list.filter((x: any) => x._id !== listingId));
    } catch (err) {
      message.error("Không thể tải danh sách xe!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCars();
      setSelectedCars([listingId]);
      setCompareResult(null);
    }
  }, [open, listingId]);

  const handleSelect = (id: string) => {
    if (selectedCars.includes(id)) {
      if (id === listingId) {
        message.warning("Không thể bỏ chọn xe hiện tại!");
        return;
      }
      setSelectedCars(selectedCars.filter((x) => x !== id));
    } else {
      if (selectedCars.length >= 2) {
        message.warning("Chỉ có thể so sánh 2 xe!");
        return;
      }
      setSelectedCars([...selectedCars, id]);
    }
  };

  const handleCompare = async () => {
    if (selectedCars.length !== 2) {
      message.warning("Vui lòng chọn thêm 1 xe để so sánh!");
      return;
    }

    const [listing1, listing2] = selectedCars;
    try {
      setComparing(true);
      const res = await ListingService.compareListings(listing1, listing2);
      setCompareResult(res.data);
      message.success("Đã tải kết quả so sánh!");
    } catch (err) {
      message.error("Lỗi khi so sánh xe!");
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  const renderCompareResult = () => {
    if (!compareResult) return null;

    const { listing1, listing2, comparison } = compareResult;

    return (
      <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm overflow-auto max-h-[60vh]">
        <h3 className="text-lg font-semibold text-center mb-4">
          Kết quả so sánh chi tiết
        </h3>

        <div className="grid grid-cols-3 gap-6 text-center items-start">
          {/* Xe 1 */}
          <div>
            <h4 className="text-blue-600 font-semibold text-lg mb-2">
              {listing1.title}
            </h4>
            <img
              src={listing1.images?.[0] || "/car-placeholder.png"}
              alt={listing1.title}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <p className="mt-2 text-green-700 font-semibold">
              {formatCurrency(listing1.price)}
            </p>
          </div>

          {/* Giữa */}
          <div className="flex flex-col items-start justify-start">
            <div className="space-y-3 text-gray-700 text-left w-full">
              <p>
                <b>Chênh lệch giá:</b>{" "}
                <Tag color="blue">
                  {formatCurrency(comparison.priceDifference)}
                </Tag>
              </p>
              <p>
                <b>Chênh lệch năm:</b>{" "}
                <Tag color="purple">{comparison.yearDifference}</Tag>
              </p>
              <p>
                <b>Chênh lệch pin:</b>{" "}
                <Tag color="orange">{comparison.batteryDifference}</Tag>
              </p>
              <p>
                <b>Chênh lệch km:</b>{" "}
                <Tag color="green">{comparison.kmDifference}</Tag>
              </p>
            </div>
          </div>

          {/* Xe 2 */}
          <div>
            <h4 className="text-blue-600 font-semibold text-lg mb-2">
              {listing2.title}
            </h4>
            <img
              src={listing2.images?.[0] || "/car-placeholder.png"}
              alt={listing2.title}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <p className="mt-2 text-green-700 font-semibold">
              {formatCurrency(listing2.price)}
            </p>
          </div>
        </div>

        {/* Bảng chi tiết */}
        <div className="mt-6">
          <Table
            pagination={false}
            bordered
            scroll={{ x: true }}
            dataSource={[
              {
                key: "year",
                label: "Năm sản xuất",
                car1: listing1.year,
                car2: listing2.year,
              },
              {
                key: "battery",
                label: "Dung lượng pin",
                car1: listing1.batteryCapacity + " mAh",
                car2: listing2.batteryCapacity + " mAh",
              },
              {
                key: "km",
                label: "Số km đã đi",
                car1: listing1.kmDriven + " km",
                car2: listing2.kmDriven + " km",
              },
              {
                key: "status",
                label: "Trạng thái",
                car1: <Tag color="blue">{listing1.status}</Tag>,
                car2: <Tag color="blue">{listing2.status}</Tag>,
              },
            ]}
            columns={[
              { title: "Thông tin", dataIndex: "label", key: "label" },
              { title: listing1.title, dataIndex: "car1", key: "car1" },
              { title: listing2.title, dataIndex: "car2", key: "car2" },
            ]}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="🚗 So sánh xe"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      centered
      bodyStyle={{
        maxHeight: "80vh",
        overflowY: "auto",
        paddingRight: 16,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto">
            {cars.map((car) => {
              const selected = selectedCars.includes(car._id);
              return (
                <Card
                  key={car._id}
                  hoverable
                  cover={
                    <img
                      alt={car.title}
                      src={car.images?.[0] || "/car-placeholder.png"}
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                  }
                  className={`border-2 transition-all ${
                    selected ? "border-blue-500 shadow-lg" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-semibold text-gray-800">{car.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {car.brand?.name || "Không rõ hãng"}
                    </p>
                    <p className="text-green-600 font-medium">
                      {formatCurrency(car.price)}
                    </p>

                    <Button
                      type={selected ? "primary" : "default"}
                      icon={<CarOutlined />}
                      onClick={() => handleSelect(car._id)}
                      className="mt-3 w-full"
                    >
                      {selected ? "Đã chọn" : "Chọn để so sánh"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleCompare}
              loading={comparing}
            >
              So sánh ngay
            </Button>
          </div>

          {renderCompareResult()}
        </>
      )}
    </Modal>
  );
}
