"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  src: string | null;
  mediaType?: string | null;
  onClose: () => void;
};

export function ChatReceiptLightbox({ src, mediaType, onClose }: Props) {
  const isPdf = mediaType === "application/pdf";

  return (
    <Dialog open={!!src} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={
          isPdf
            ? "max-w-[min(100vw-1rem,64rem)] h-[85vh] border-0 bg-black/95 p-2 sm:p-3"
            : "max-w-[min(100vw-1rem,48rem)] border-0 bg-black/95 p-2 sm:p-3"
        }
      >
        <DialogTitle className="sr-only">Receipt preview</DialogTitle>
        {src ? (
          isPdf ? (
            <iframe
              src={src}
              title="Uploaded PDF preview"
              className="h-full w-full rounded-md bg-white"
            />
          ) : (
            <button
              type="button"
              className="relative block w-full max-h-[85vh] cursor-zoom-out"
              onClick={onClose}
              aria-label="Close receipt preview"
            >
              <Image
                src={src}
                alt="Uploaded receipt"
                width={1200}
                height={1600}
                className="mx-auto h-auto max-h-[85vh] w-full object-contain"
                unoptimized
              />
            </button>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
