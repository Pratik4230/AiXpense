"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { upload } from "@imagekit/next";
import { X, Video } from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

interface MediaUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadedMedia {
  url: string;
  type: "image" | "video";
  name: string;
}

async function fetchAuthParams() {
  const res = await fetch("/api/imagekit-auth");
  if (!res.ok) throw new Error("Failed to get upload auth");
  return res.json() as Promise<{
    token: string;
    expire: number;
    signature: string;
    publicKey: string;
  }>;
}

export function MediaUploader({
  value,
  onChange,
  maxFiles = 5,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [media, setMedia] = useState<UploadedMedia[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      if (!remaining || !acceptedFiles.length) return;

      const toUpload = acceptedFiles.slice(0, remaining);

      const oversized = toUpload.filter((f) =>
        f.type.startsWith("video/")
          ? f.size > MAX_VIDEO_SIZE
          : f.size > MAX_IMAGE_SIZE,
      );
      if (oversized.length > 0) {
        oversized.forEach((f) => {
          const isVideo = f.type.startsWith("video/");
          toast.error(
            `"${f.name}" exceeds the ${isVideo ? "50 MB video" : "10 MB image"} limit`,
          );
        });
        return;
      }

      setUploading(true);

      try {
        const authParams = await fetchAuthParams();
        const uploadedUrls: string[] = [];
        const uploadedMedia: UploadedMedia[] = [];

        for (const file of toUpload) {
          const fileId = `${file.name}-${Date.now()}`;
          setProgresses((p) => ({ ...p, [fileId]: 0 }));

          const res = await upload({
            file,
            fileName: file.name,
            folder: "/issues",
            ...authParams,
            onProgress: (e) => {
              setProgresses((p) => ({
                ...p,
                [fileId]: Math.round((e.loaded / e.total) * 100),
              }));
            },
          });

          const url = res.url as string;
          uploadedUrls.push(url);
          uploadedMedia.push({
            url,
            type: file.type.startsWith("video/") ? "video" : "image",
            name: file.name,
          });

          setProgresses((p) => {
            const next = { ...p };
            delete next[fileId];
            return next;
          });
        }

        setMedia((prev) => [...prev, ...uploadedMedia]);
        onChange([...value, ...uploadedUrls]);
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxFiles],
  );

  const removeMedia = (url: string) => {
    setMedia((prev) => prev.filter((m) => m.url !== url));
    onChange(value.filter((u) => u !== url));
  };

  const isUploading = Object.keys(progresses).length > 0;
  const isFull = value.length >= maxFiles;
  const remaining = maxFiles - value.length;

  return (
    <div className="space-y-3">
      {media.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div
              key={m.url}
              className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted"
            >
              {m.type === "image" ? (
                <Image src={m.url} alt={m.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                  <Video className="size-6" />
                  <span className="text-xs text-center px-1 truncate w-full">
                    {m.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeMedia(m.url)}
                className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="space-y-1.5">
          {Object.entries(progresses).map(([id, pct]) => (
            <div
              key={id}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <div className="flex-1 bg-muted rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="tabular-nums w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {!isFull && (
        <UploadDropzone
          isPending={uploading}
          onDrop={onDrop}
          accept={{ "image/*": [], "video/*": [] }}
          maxFiles={remaining}
          description={{
            maxFiles: remaining,
            fileTypes: "images (10 MB) & videos (50 MB)",
          }}
        />
      )}
    </div>
  );
}
