"use client";
import React from "react";
import PriceRangeBar from "@/components/PriceRangeBar";
import { formatVND } from '@/lib/formatCurrency'
import SellerCard from "@/components/SellerCard";
import { FileText, Eye } from "lucide-react";

type Listing = any;

export default function PriceCard({ listing, onCompare, onContact }: { listing: Listing; onCompare: () => void; onContact: () => void; }) {
  const market = listing.marketRange
    ? listing.marketRange
    : listing.price
    ? { min: Math.round(listing.price * 0.95), avg: listing.price, max: Math.round(listing.price * 1.05) }
    : null;

  const formatPrice = (price: number) => formatVND(price)

  return (
    <aside className="sticky top-24">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="mb-4">
          <div className="text-sm text-gray-600">Giá bán</div>
          <div className="text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</div>
        </div>

        {market && <PriceRangeBar min={market.min} avg={market.avg} max={market.max} />}

        <div className="mt-6 space-y-3">
          <button onClick={onCompare} className="w-full px-4 py-3 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Eye className="w-5 h-5 text-white" /> So sánh xe
          </button>
          <button onClick={onContact} className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50">
            <FileText className="w-5 h-5 text-gray-700" /> Xem hợp đồng xe
          </button>
        </div>

        <div className="mt-6">
          <SellerCard seller={listing.seller || {}} />
        </div>
      </div>

      {/* Contract view is handled by parent (onContact -> navigates to /checkout). Modal removed to restore original behavior. */}

    </aside>
  );
}
