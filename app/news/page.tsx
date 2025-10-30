"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, Pagination } from "antd";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

// Fake data
const fakeNews: NewsItem[] = [
  {
    id: "1",
    title: "Tesla ra mắt mẫu xe mới Model Z",
    description:
      "Tesla vừa công bố mẫu xe mới với thiết kế hiện đại, pin cải tiến và khả năng tự lái nâng cao.",
    image: "https://source.unsplash.com/400x300/?tesla,car",
    createdAt: "2025-10-30",
  },
  {
    id: "2",
    title: "Năng lượng xanh lên ngôi",
    description:
      "Công nghệ pin và năng lượng xanh ngày càng phát triển, thúc đẩy xu hướng xe điện trên toàn cầu.",
    image: "https://source.unsplash.com/400x300/?electric,car",
    createdAt: "2025-10-29",
  },
  {
    id: "3",
    title: "Khuyến mãi tháng 11 cho xe điện",
    description:
      "Những ưu đãi hấp dẫn dành cho khách hàng mua xe điện trong tháng 11, giảm giá tới 15%.",
    image: "https://source.unsplash.com/400x300/?car,promotion",
    createdAt: "2025-10-28",
  },
  {
    id: "4",
    title: "Công nghệ tự lái Level 5 sắp ra mắt",
    description:
      "Các hãng xe đang đẩy mạnh nghiên cứu công nghệ tự lái Level 5, hứa hẹn thay đổi tương lai giao thông.",
    image: "https://source.unsplash.com/400x300/?self-driving,car",
    createdAt: "2025-10-27",
  },
  {
    id: "5",
    title: "Pin xe điện hiệu suất cao",
    description:
      "Những tiến bộ về pin lithium giúp xe điện đi được quãng đường dài hơn mà vẫn sạc nhanh.",
    image: "https://source.unsplash.com/400x300/?battery,car",
    createdAt: "2025-10-26",
  },
  {
    id: "6",
    title: "Tesla mở rộng thị trường châu Á",
    description:
      "Tesla mở rộng thị trường sang nhiều quốc gia châu Á với nhà máy mới và chính sách giá hợp lý.",
    image: "https://source.unsplash.com/400x300/?tesla,asia",
    createdAt: "2025-10-25",
  },
  {
    id: "7",
    title: "Xe điện và xu hướng 2026",
    description:
      "Những dự đoán về thị trường xe điện 2026: tăng trưởng mạnh, pin tốt hơn và công nghệ AI tiên tiến.",
    image: "https://source.unsplash.com/400x300/?electric,vehicle",
    createdAt: "2025-10-24",
  },
];

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const currentNews = fakeNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Tin tức nổi bật
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentNews.map((item) => (
              <Card
                key={item.id}
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={item.image}
                    className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                }
                className="rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <span className="text-gray-400 text-xs mt-auto">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {fakeNews.length > pageSize && (
            <div className="mt-12 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={fakeNews.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
