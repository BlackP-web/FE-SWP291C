"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingService } from "@/service/listing.service";
import Checkout from "@/components/Checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const listingId = searchParams.get("listingId");
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        const res = await ListingService.getById(listingId);
        setListing(res.listing);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Không tìm thấy xe</div>;

  return <Checkout listing={listing} />;
}
