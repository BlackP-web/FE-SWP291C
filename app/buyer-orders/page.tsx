"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Rate,
  Modal,
  Button,
  message,
  Spin,
  Tag,
  Empty,
  Col,
  Row,
} from "antd";
import {
  ShoppingCart,
  MessageSquare,
  Clock,
  FileText,
  Battery,
  Gauge,
  Calendar,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { OrderService } from "@/service/order.service";
import { ReviewService } from "@/service/review.service";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function BuyerOrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const router = useRouter();

  const fetchOrders = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await OrderService.getOrdersByBuyer(user._id);
      setOrders(res.orders || res || []);
    } catch {
      message.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) fetchOrders();
  }, [isAuthenticated, authLoading, user]);

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    setRating(order.review?.rating || 0);
    setComment(order.review?.comment || "");
    setReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder || !user?._id) return;
    try {
      await ReviewService.createOrUpdateReview({
        reviewer: user._id,
        target: selectedOrder.seller?._id,
        listing: selectedOrder.listing?._id,
        rating,
        comment,
      });
      message.success("Đã gửi đánh giá!");
      setReviewModal(false);
      fetchOrders();
    } catch {
      message.error("Gửi đánh giá thất bại!");
    }
  };

  const renderStatus = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      pending: { color: "orange", text: "Chờ xử lý" },
      processing: { color: "blue", text: "Đang xử lý" },
      completed: { color: "green", text: "Hoàn tất giao dịch" },
      canceled: { color: "red", text: "Đã hủy" },
    };
    const item = map[status] || { color: "default", text: status };
    return (
      <Tag
        color={item.color}
        style={{
          borderRadius: 20,
          padding: "3px 12px",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      >
        {item.text}
      </Tag>
    );
  };

  if (authLoading || loading)
    return (
      <div className="flex justify-center items-center h-72">
        <Spin size="large" />
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-lg">
          Vui lòng đăng nhập để xem đơn hàng của bạn.
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      <div className="px-6 md:px-12 mt-20">
        {/* Nút quay về Home */}
        <Button
          type="default"
          icon={<ArrowLeft className="w-4 h-4" />}
          className="mb-6"
          onClick={() => router.push("/")}
        >
          Quay về Home
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Theo dõi đơn hàng
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="mt-20 flex justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Bạn chưa có đơn hàng nào."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white"
                bodyStyle={{ padding: "18px" }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={order.listing?.images?.[0] || "/car-placeholder.png"}
                    alt={order.listing?.title}
                    className="w-28 h-28 object-cover rounded-xl border border-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                      {order.listing?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Người bán:{" "}
                      <span className="font-medium">{order.seller?.name}</span>
                    </p>

                    {/* Thông tin xe chi tiết */}
                    <Row className="mt-2 gap-2 text-gray-600 text-sm">
                      <Col span={12}>
                        <Calendar className="w-4 h-4 inline" /> Năm đăng ký:{" "}
                        {order.listing?.carDetails?.registrationNumber || "—"}
                      </Col>
                      <Col span={12}>
                        <Battery className="w-4 h-4 inline" /> Pin:{" "}
                        {order.listing?.carDetails?.batteryCapacity
                          ? `${order.listing.carDetails.batteryCapacity} kWh`
                          : "—"}
                      </Col>
                      <Col span={12}>
                        Màu: {order.listing?.carDetails?.color || "—"}
                      </Col>
                      <Col span={12}>
                        Hạn bảo hiểm:{" "}
                        {order.listing?.carDetails?.insuranceExpiry
                          ? new Date(
                              order.listing.carDetails.insuranceExpiry
                            ).toLocaleDateString()
                          : "—"}
                      </Col>
                      <Col span={12}>
                        Hạn đăng kiểm:{" "}
                        {order.listing?.carDetails?.inspectionExpiry
                          ? new Date(
                              order.listing.carDetails.inspectionExpiry
                            ).toLocaleDateString()
                          : "—"}
                      </Col>
                      <Col span={12}>
                        Lịch sử tai nạn:{" "}
                        {order.listing?.carDetails?.accidentHistory || "—"}
                      </Col>
                      <Col span={12}>
                        Vị trí: {order.listing?.carDetails?.location || "—"}
                      </Col>
                    </Row>

                    <p className="text-green-600 font-semibold mt-2 text-lg">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(order.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>

                    <div className="mt-2">{renderStatus(order.status)}</div>
                  </div>
                </div>

                {/* Hợp đồng */}
                {order.listing?.contract && (
                  <div className="mt-3">
                    <Button
                      type="default"
                      icon={<FileText className="w-4 h-4" />}
                      href={order.listing.contract}
                      target="_blank"
                      className="text-blue-600 border-blue-500 hover:bg-blue-50"
                    >
                      Xem hợp đồng
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal đánh giá */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Đánh giá đơn hàng
          </div>
        }
        open={reviewModal}
        onCancel={() => setReviewModal(false)}
        onOk={handleSubmitReview}
        okText="Gửi đánh giá"
        centered
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  selectedOrder.listing?.images?.[0] || "/car-placeholder.png"
                }
                alt={selectedOrder.listing?.title}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedOrder.listing?.title}
                </p>
                <p className="text-gray-500 text-sm">
                  Người bán: {selectedOrder.seller?.name}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Đánh giá:</p>
              <Rate value={rating} onChange={setRating} />
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Nhận xét:</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Chia sẻ trải nghiệm của bạn về xe hoặc người bán..."
              />
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </main>
  );
}
