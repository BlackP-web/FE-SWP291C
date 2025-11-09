export function formatVND(value: number | string | null | undefined) {
  const n = Number(value ?? 0)
  if (Number.isNaN(n)) return "0 VNĐ"
  // Use vi-VN grouping then append VNĐ to match project requirement
  return n.toLocaleString("vi-VN") + " VNĐ"
}

export default formatVND
