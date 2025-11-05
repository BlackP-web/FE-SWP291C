import type { Metadata, Viewport } from "next";
import "./globals.css";
import TokenHandler from "@/components/TokenHandler";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "EV Trading Platform - Nền tảng giao dịch xe điện",
  description:
    "Nền tảng giao dịch xe điện và pin đã qua sử dụng hàng đầu Việt Nam",
  keywords:
    "xe điện, tesla, pin xe điện, giao dịch xe điện, xe điện đã qua sử dụng",
  authors: [{ name: "EV Trading Team" }],
  robots: "index, follow",
  openGraph: {
    title: "EV Trading Platform",
    description:
      "Nền tảng giao dịch xe điện và pin đã qua sử dụng hàng đầu Việt Nam",
    type: "website",
    locale: "vi_VN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-tesla antialiased">
        <TokenHandler />
        {children}
      </body>
    </html>
  );
}
