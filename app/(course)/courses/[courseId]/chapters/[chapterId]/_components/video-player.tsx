"use client";
import { useState } from "react";
import { Video, Loader2, Lock } from "lucide-react";

interface VideoPlayerProps {
  playbackId?: string | null; // Опционально, поддерживает null
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  isLocked,
  courseId,
  chapterId,
  nextChapterId,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  let videoId = null;
  try {
    videoId = playbackId ? new URL(playbackId).searchParams.get("v") : null;
  } catch {
    videoId = null; // Безопасное значение, если playbackId некорректно
  }

  return (
    <div className="relative aspect-video border bg-slate-100 rounded-md">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      ) : videoId ? (
        <iframe
          className="w-full h-full rounded-md "
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allowFullScreen
          onLoad={() => setIsReady(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-slate-200 rounded-md">
          <div className="flex items-center gap-x-2 text-slate-500">
            <Video className="h-10 w-10" />
            <span>Video not available</span>
          </div>
        </div>
      )}
    </div>
  );
};
