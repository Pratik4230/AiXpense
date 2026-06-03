"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenerateInsightShareImage, useLatestInsight } from "@/services/insights";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/hooks/useCurrency";
import { useUtcCalendarDateFormat } from "@/hooks/useUtcCalendarDateFormat";
import { formatInsightPeriodKey } from "@/lib/utcDates";
import { toast } from "sonner";

function cleanInsightText(text: string) {
  return text
    .replace(/\s*--\s*/g, " ")
    .replace(/\s*—\s*/g, " ")
    .trim();
}

interface CoachInsightCardProps {
  isPremium: boolean;
}

type GeneratedShareState = {
  brandedImageDataUrl: string;
  caption: string;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
}

async function composeBrandedImage(baseImageDataUrl: string) {
  const [baseImage, iconImage] = await Promise.all([loadImage(baseImageDataUrl), loadImage("/icon.png")]);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create image canvas.");
  }

  context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  const iconSize = 64;
  context.shadowColor = "rgba(0, 0, 0, 0.28)";
  context.shadowBlur = 10;
  context.drawImage(iconImage, 24, 24, iconSize, iconSize);

  context.font = "600 28px Inter, system-ui, -apple-system, sans-serif";
  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.shadowColor = "rgba(0, 0, 0, 0.35)";
  context.shadowBlur = 6;
  context.fillText("aixpense.in", canvas.width - 36, canvas.height - 30);

  return canvas.toDataURL("image/png");
}

export function CoachInsightCard({ isPremium }: CoachInsightCardProps) {
  const { data: insight, isLoading } = useLatestInsight(isPremium);
  const { format, symbol, code } = useCurrency();
  const { locale } = useUtcCalendarDateFormat();
  const generateImageMutation = useGenerateInsightShareImage();
  const [generatedShare, setGeneratedShare] = useState<GeneratedShareState | null>(null);

  if (!isPremium) {
    return (
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            AI Coach Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-2 select-none">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/6" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background flex flex-col items-center justify-end pb-4 gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Lock className="size-3.5" />
              Premium feature
            </div>
            <Link href="/premium">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                Upgrade to unlock
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  if (!insight) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            AI Coach Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your first insight will arrive after your weekly or monthly summary is generated. Keep logging!
          </p>
        </CardContent>
      </Card>
    );
  }

  const period = formatInsightPeriodKey(insight.periodKey, locale);
  const canGenerate = Boolean(insight.content?.trim());

  async function handleGenerateImage() {
    if (!insight || !canGenerate) return;
    try {
      const response = await generateImageMutation.mutateAsync({
        insightContent: insight.content,
        periodKey: insight.periodKey,
        totalSpent: insight.totalSpent,
        currencyCode: code,
        currencySymbol: symbol,
      });
      const brandedImageDataUrl = await composeBrandedImage(response.imageDataUrl);
      setGeneratedShare({
        brandedImageDataUrl,
        caption: response.caption,
      });
      toast.success("Instagram card generated");
    } catch {
      toast.error("Failed to generate image. Please retry.");
    }
  }

  function handleDownload() {
    if (!generatedShare) return;
    const anchor = document.createElement("a");
    anchor.href = generatedShare.brandedImageDataUrl;
    anchor.download = `aixpense-coach-${insight?.periodKey ?? "insight"}.png`;
    anchor.click();
  }

  const isGenerating = generateImageMutation.isPending;
  return (
    <Card className="border-amber-500/20 bg-linear-to-br from-amber-950/10 to-background overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              AI Coach Insight
            </CardTitle>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold tracking-tight">{format(insight.totalSpent)}</span>
              <span className="text-xs text-muted-foreground">{period}</span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleGenerateImage}
            disabled={!canGenerate || isGenerating}
            className="shrink-0"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground/80">{cleanInsightText(insight.content)}</p>
        {generatedShare && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border/70">
              <Image
                src={generatedShare.brandedImageDataUrl}
                alt="Aixpense AI coach Instagram card"
                width={1080}
                height={1080}
                unoptimized
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{generatedShare.caption}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
