import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  onChange?: (index: number) => void;
};

export default function Lightbox({ images, initialIndex = 0, open, onClose, onChange }: Props) {
  const [index, setIndex] = React.useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index]);

  useEffect(() => {
    onChange?.(index);
  }, [index]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-4xl h-full md:h-[80vh] bg-transparent flex items-center justify-center">
        <button
          aria-label="Close lightbox"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          aria-label="Previous image"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[index]}
          alt={`image-${index}`}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
        />

        <button
          aria-label="Next image"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
