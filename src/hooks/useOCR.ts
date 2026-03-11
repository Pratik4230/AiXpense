import { useState } from "react";

type OcrStatus = "idle" | "scanning" | "error";

export function useOCR() {
  const [status, setStatus] = useState<OcrStatus>("idle");

  const scanBill = async (
    file: File,
    onSuccess: (text: string) => void,
    onError?: (message: string) => void,
  ) => {
    setStatus("scanning");

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Scan failed");

      onSuccess(data.text as string);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      onError?.(err instanceof Error ? err.message : "Bill scan failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return { status, scanBill };
}
