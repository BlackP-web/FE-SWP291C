import React from "react";
import { formatVND } from '@/lib/formatCurrency'

type Props = {
  min: number;
  avg: number;
  max: number;
};

const formatPrice = (p: number) => formatVND(p)

export default function PriceRangeBar({ min, avg, max }: Props) {
  const range = Math.max(1, max - min);
  const percent = Math.round(((avg - min) / range) * 100);

  return (
    <div className="mt-4">
      <div className="text-xs text-gray-600 mb-2">Khoảng giá thị trường</div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
        <div className="h-full bg-gray-700" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <span>{formatPrice(min)}</span>
        <span className="font-semibold text-gray-900">{formatPrice(avg)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}
