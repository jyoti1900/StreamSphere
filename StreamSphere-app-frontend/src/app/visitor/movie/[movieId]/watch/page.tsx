"use client";

import { useEffect, useRef, useState, Suspense, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Lock, Pause, Play, Maximize, Minimize } from "lucide-react";
import {
  useAuth,
  API_BASE_URL,
  fetchContinueWatching,
  findWatchRecord,
  updateWatchTimeApi,
  isPremiumUser,
} from "@/context/AuthContext";
import {
  clampQualityForUser,
  isPremiumQuality,
  type StreamResolution,
  FREE_MAX_QUALITY,
} from "@/lib/premium";
import { visitorBtnPrimary, visitorBtnOutline, visitorTextAccent } from "@/styles/brandColors";

const QUALITY_OPTIONS = ["Auto", "144p", "240p", "360p", "480p", "720p", "1080p", "2160p"] as const;
type VideoQuality = (typeof QUALITY_OPTIONS)[number];

const QUALITY_STORAGE_KEY = "streamsphere-video-quality";

const QUALITY_MAX_HEIGHT: Record<StreamResolution, number> = {
  "144p": 144,
  "240p": 240,
  "360p": 360,
  "480p": 480,
  "720p": 720,
  "1080p": 1080,
  "2160p": 2160,
};

const RESOLUTION_LABELS: Record<StreamResolution, string> = {
  "144p": "144p",
  "240p": "240p",
  "360p": "360p",
  "480p": "480p",
  "720p": "720p",
  "1080p": "1080p",
  "2160p": "4K",
};

function getQualityDisplayLabel(quality: string | null | undefined): string {
  if (!quality) return "Auto";

  const normalized = quality.trim();
  if (normalized === "Auto") return "Auto";
  if (normalized === "4K" || normalized === "4k" || normalized === "2160") {
    return RESOLUTION_LABELS["2160p"];
  }

  if (normalized in RESOLUTION_LABELS) {
    return RESOLUTION_LABELS[normalized as StreamResolution];
  }

  return normalized;
}

function getStoredQuality(): VideoQuality {
  if (typeof window === "undefined") return "Auto";
  const saved = localStorage.getItem(QUALITY_STORAGE_KEY);

  if (saved === "4K" || saved === "4k" || saved === "2160") {
    return "2160p";
  }

  return QUALITY_OPTIONS.includes(saved as VideoQuality)
    ? (saved as VideoQuality)
    : "Auto";
}

function detectAutoQuality(isPremium: boolean): StreamResolution {
  if (typeof navigator === "undefined") {
    return isPremium ? "1080p" : FREE_MAX_QUALITY;
  }

  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection;
  const effectiveType = connection?.effectiveType;

  let detected: StreamResolution = "1080p";
  if (effectiveType === "slow-2g") detected = "144p";
  else if (effectiveType === "2g") detected = "240p";
  else if (effectiveType === "3g") detected = "480p";
  else if (effectiveType === "4g") detected = "720p";

  return clampQualityForUser(detected, isPremium);
}

function resolveQualityLabel(
  quality: VideoQuality,
  isPremium: boolean
): StreamResolution {
  const resolved = quality === "Auto" ? detectAutoQuality(isPremium) : quality;
  return clampQualityForUser(resolved as StreamResolution, isPremium);
}

/** Keep CloudFront signature intact — only use URL hash for remount hints. */
function withQualityHint(url: string, quality: StreamResolution): string {
  const base = url.split("#")[0];
  return `${base}#ssq=${encodeURIComponent(quality)}&t=${Date.now()}`;
}

function stripQualityHint(url: string): string {
  return url.split("#")[0];
}

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function fetchStreamUrl(
  movieId: string,
  token: string,
  quality: StreamResolution
): Promise<string> {
  const res = await fetch(
    `${API_BASE_URL}/movies/${movieId}/stream?quality=${encodeURIComponent(quality)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    }
  );

  if (res.ok) {
    const data = await res.json();
    const url =
      data?.streamingUrl ||
      data?.url ||
      data?.data?.streamingUrl ||
      data?.data?.url;
    if (typeof url === "string" && url) return url;
  }

  const fallbackRes = await fetch(`${API_BASE_URL}/movies/${movieId}/stream`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  if (fallbackRes.ok) {
    const data = await fallbackRes.json();
    const url =
      data?.streamingUrl ||
      data?.url ||
      data?.data?.streamingUrl ||
      data?.data?.url;
    if (typeof url === "string" && url) return url;
  }

  return "";
}

function extractVideoUrlFromMovie(found: any): string {
  if (typeof found?.video === "object") {
    return found.video?.signedUrl || "";
  }
  if (found?.videoKey) {
    return `https://d1s22etkak2nxm.cloudfront.net/${found.videoKey}`;
  }
  return "";
}

function WatchPlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const movieId = params.movieId as string;
  const restart = searchParams.get("restart") === "true";

  const { token, user } = useAuth();
  const isPremium = isPremiumUser(user);

  const [movie, setMovie] = useState<{ id: string; video: string; duration?: number } | null>(
    null
  );
  const [savedWatchTime, setSavedWatchTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const lastSavedRef = useRef(0);
  const [showQuality, setShowQuality] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("Auto");
  const [activeStreamQuality, setActiveStreamQuality] =
    useState<StreamResolution>(FREE_MAX_QUALITY);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualitySwitching, setQualitySwitching] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const stored = getStoredQuality();
    if (!isPremium && stored !== "Auto" && isPremiumQuality(stored as StreamResolution)) {
      setSelectedQuality("720p");
      localStorage.setItem(QUALITY_STORAGE_KEY, "720p");
    } else {
      setSelectedQuality(stored);
    }
  }, [isPremium]);

  const updateWatchTime = useCallback(
    async (watchTime: number, immediate = false) => {
      if (!token || !movieId) return;

      if (!immediate) {
        const now = Date.now();
        if (now - lastSavedRef.current < 5000) return;
        lastSavedRef.current = now;
      }

      try {
        const res = await updateWatchTimeApi(token, movieId, watchTime);
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          console.error("Watchtime update failed:", err?.message || res.statusText);
        }
      } catch (err) {
        console.error("Failed to update watchtime:", err);
      }
    },
    [token, movieId]
  );

  const loadVideoSource = useCallback(
    async (quality: StreamResolution) => {
      if (!token || !movieId) return;

      const allowedQuality = clampQualityForUser(quality, isPremium);
      let videoUrl = await fetchStreamUrl(movieId, token, allowedQuality);

      if (!videoUrl) {
        const moviesRes = await fetch(`${API_BASE_URL}/movies/grouped`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (moviesRes.ok) {
          const data = await moviesRes.json();
          const categories = data.categories || data.data || data || [];
          const allMovies = categories.flatMap((cat: any) => cat.movies || []);
          const found = allMovies.find((m: any) => m._id === movieId);
          videoUrl = extractVideoUrlFromMovie(found);

          if (found && videoUrl) {
            setMovie((prev) => ({
              id: found._id,
              video: withQualityHint(videoUrl, allowedQuality),
              duration: Number(found.duration) || prev?.duration,
            }));
            return;
          }
        }
      }

      if (videoUrl) {
        const nextUrl = withQualityHint(videoUrl, allowedQuality);
        setMovie((prev) =>
          prev
            ? { ...prev, video: nextUrl }
            : { id: movieId, video: nextUrl }
        );
      }
    },
    [token, movieId, isPremium]
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMovieAndProgress = async () => {
      try {
        const quality = resolveQualityLabel(getStoredQuality(), isPremium);
        setActiveStreamQuality(quality);

        const headers = { Authorization: `Bearer ${token}` };

        const [moviesRes, watchPayload] = await Promise.all([
          fetch(`${API_BASE_URL}/movies/grouped`, { headers }),
          fetchContinueWatching(token),
        ]);

        let found: any = null;
        if (moviesRes.ok) {
          const data = await moviesRes.json();
          const categories = data.categories || data.data || data || [];
          const allMovies = categories.flatMap((cat: any) => cat.movies || []);
          found = allMovies.find((m: any) => m._id === movieId);
        }

        const streamUrl = await fetchStreamUrl(movieId, token, quality);
        const fallbackUrl = extractVideoUrlFromMovie(found);
        const videoUrl = streamUrl || fallbackUrl;

        if (videoUrl) {
          setMovie({
            id: movieId,
            video: withQualityHint(videoUrl, quality),
            duration: found ? Number(found.duration) || undefined : undefined,
          });
        }

        if (watchPayload && !restart) {
          const record = findWatchRecord(watchPayload, movieId);
          if (record?.watchTime > 0 && !record?.completed) {
            setSavedWatchTime(Number(record.watchTime));
          }
        }
      } catch (err) {
        console.error("Video load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndProgress();
  }, [movieId, token, restart, isPremium]);

  const handleQualityChange = async (quality: VideoQuality) => {
    if (
      quality !== "Auto" &&
      isPremiumQuality(quality as StreamResolution) &&
      !isPremium
    ) {
      setShowQuality(false);
      setShowPremiumPrompt(true);
      return;
    }

    const video = videoRef.current;
    const current = video?.currentTime ?? 0;
    const wasPlaying = Boolean(video && !video.paused);

    setSelectedQuality(quality);
    localStorage.setItem(QUALITY_STORAGE_KEY, quality);
    setShowQuality(false);

    const resolved = resolveQualityLabel(quality, isPremium);
    setActiveStreamQuality(resolved);

    if (!token) return;

    setQualitySwitching(true);
    await loadVideoSource(resolved);

    requestAnimationFrame(() => {
      const nextVideo = videoRef.current;
      if (!nextVideo) {
        setQualitySwitching(false);
        return;
      }

      const applyPlaybackState = () => {
        nextVideo.currentTime = current;
        if (wasPlaying) {
          nextVideo.play().catch(() => {});
        }
        setQualitySwitching(false);
      };

      if (nextVideo.readyState >= 1) {
        applyPlaybackState();
      } else {
        nextVideo.addEventListener("loadedmetadata", applyPlaybackState, { once: true });
      }
    });
  };

  const handleVideoReady = async () => {
    const video = videoRef.current;
    if (!video || !movie || !token) return;

    setDuration(video.duration || Number(movie.duration) || 0);

    if (restart) {
      video.currentTime = 0;
      await updateWatchTime(0, true);
    } else if (savedWatchTime > 0) {
      video.currentTime = savedWatchTime;
    }

    video.play().catch(() => {});
  };

  useEffect(() => {
    const handleLeave = () => {
      const video = videoRef.current;
      if (video && token && video.currentTime > 0) {
        updateWatchTime(video.currentTime, true);
      }
    };

    window.addEventListener("beforeunload", handleLeave);
    return () => {
      handleLeave();
      window.removeEventListener("beforeunload", handleLeave);
    };
  }, [token, updateWatchTime]);

  // Client-side quality: draw frames at selected resolution then upscale to fullscreen.
  // Needed because backend currently returns the same master file for every quality param.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !movie?.video) return;

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas");
    }
    const offscreen = offscreenRef.current;
    let frameId = 0;
    let running = true;

    const paint = () => {
      if (!running) return;

      const ctx = canvas.getContext("2d");
      const offCtx = offscreen.getContext("2d");
      if (!ctx || !offCtx) {
        frameId = requestAnimationFrame(paint);
        return;
      }

      const displayW = canvas.clientWidth || window.innerWidth;
      const displayH = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== displayW) canvas.width = displayW;
      if (canvas.height !== displayH) canvas.height = displayH;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, displayW, displayH);

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const targetH = QUALITY_MAX_HEIGHT[activeStreamQuality];
        const aspect = video.videoWidth / video.videoHeight;
        const targetW = Math.max(1, Math.round(targetH * aspect));

        if (offscreen.width !== targetW) offscreen.width = targetW;
        if (offscreen.height !== targetH) offscreen.height = targetH;

        offCtx.drawImage(video, 0, 0, targetW, targetH);

        const scale = Math.min(displayW / targetW, displayH / targetH);
        const drawW = targetW * scale;
        const drawH = targetH * scale;
        const dx = (displayW - drawW) / 2;
        const dy = (displayH - drawH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(offscreen, dx, dy, drawW, drawH);
      }

      frameId = requestAnimationFrame(paint);
    };

    frameId = requestAnimationFrame(paint);
    return () => {
      running = false;
      cancelAnimationFrame(frameId);
    };
  }, [activeStreamQuality, movie?.video]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seekTo = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const toggleFullscreen = async () => {
    const container = playerContainerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      if (container.requestFullscreen) {
        await container.requestFullscreen();
        return;
      }

      const webkitContainer = container as HTMLDivElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      };
      if (webkitContainer.webkitRequestFullscreen) {
        await webkitContainer.webkitRequestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const qualityLabel = useMemo(() => {
    if (selectedQuality === "Auto") {
      return `Auto (${getQualityDisplayLabel(activeStreamQuality)})`;
    }
    return getQualityDisplayLabel(selectedQuality);
  }, [selectedQuality, activeStreamQuality]);

  const isQualityLocked = (quality: VideoQuality) =>
    quality !== "Auto" && isPremiumQuality(quality as StreamResolution) && !isPremium;

  if (!token) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-black text-gray-400">
        <p>Please sign in to watch this movie.</p>
        <button onClick={() => router.push("/login")} className={visitorBtnPrimary}>
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-gray-400">
        Loading Video...
      </div>
    );
  }

  if (!movie?.video) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-gray-400">
        Video not available
      </div>
    );
  }

  return (
    <div ref={playerContainerRef} className="fixed inset-0 z-[100] bg-black">
      <div className="absolute left-6 top-4 z-[110]">
        <button
          onClick={() => router.back()}
          className="cursor-pointer rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black"
        >
          ← Back
        </button>
      </div>

      <div className="absolute right-6 top-4 z-[110] flex items-center gap-3">
        {!isPremium && (
          <span className="hidden rounded-full border border-[rgba(215,55,45,0.35)] bg-[rgba(65,15,15,0.4)] px-3 py-1 text-xs font-semibold text-[rgb(215,55,45)] sm:inline">
            Free · up to 720p
          </span>
        )}
        <div className="relative">
          <button
            onClick={() => setShowQuality(!showQuality)}
            className="cursor-pointer rounded-md border border-white/10 bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black"
          >
            ⚙ {qualityLabel}
          </button>

          {showQuality && (
            <div className="absolute right-0 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-gray-800 bg-[#111622] shadow-2xl">
              {QUALITY_OPTIONS.map((quality) => {
                const locked = isQualityLocked(quality);
                return (
                  <button
                    key={quality}
                    onClick={() => handleQualityChange(quality)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-white/5 ${
                      selectedQuality === quality
                        ? `${visitorTextAccent} font-bold`
                        : locked
                          ? "text-zinc-500"
                          : "text-gray-300"
                    } cursor-pointer`}
                  >
                    <span>
                      {quality === "Auto"
                        ? `Auto (${getQualityDisplayLabel(activeStreamQuality)})`
                        : getQualityDisplayLabel(quality)}
                    </span>
                    {locked && <Lock className="h-3.5 w-3.5 text-[rgb(215,55,45)]" />}
                  </button>
                );
              })}
              {!isPremium && (
                <div className="border-t border-white/10 px-4 py-2 text-xs text-zinc-500">
                  1080p & 4K require Premium
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPremiumPrompt && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border border-[rgba(215,55,45,0.35)] p-6 text-center"
            style={{
              background:
                "linear-gradient(160deg, rgba(65,15,15,0.35) 0%, rgb(18,18,20) 50%, rgb(9,9,11) 100%)",
            }}
          >
            <Lock className="mx-auto mb-4 h-10 w-10 text-[rgb(215,55,45)]" />
            <h3 className="text-xl font-bold text-white">Premium Quality</h3>
            <p className="mt-2 text-sm text-zinc-400">
              1080p and 4K streaming are available with a Premium subscription. Upgrade to unlock
              the best viewing experience.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/visitor/payment")}
                className={visitorBtnPrimary}
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => setShowPremiumPrompt(false)}
                className={visitorBtnOutline}
              >
                Continue at 720p
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-pointer bg-black"
          onClick={togglePlay}
        />

        <video
          key={movie.video}
          ref={videoRef}
          src={stripQualityHint(movie.video)}
          autoPlay
          playsInline
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="pointer-events-none absolute h-px w-px opacity-0"
          onLoadedMetadata={handleVideoReady}
          onPlay={() => setIsPlaying(true)}
          onPause={(e) => {
            setIsPlaying(false);
            const time = e.currentTarget.currentTime;
            if (time > 0) updateWatchTime(time, true);
          }}
          onTimeUpdate={(e) => {
            const time = e.currentTarget.currentTime;
            const total = e.currentTarget.duration;
            setCurrentTime(time);
            if (Number.isFinite(total)) setDuration(total);
            if (time > 0 && total > 0 && time < total - 1) {
              updateWatchTime(time);
            }
          }}
          onEnded={(e) => {
            setIsPlaying(false);
            const total = e.currentTarget.duration || movie.duration || 0;
            updateWatchTime(Math.floor(total), true);
          }}
        />

        {qualitySwitching && (
          <div className="absolute inset-0 z-[105] flex items-center justify-center bg-black/40 text-sm text-white">
            Switching to {getQualityDisplayLabel(activeStreamQuality)}...
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[108] bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-5 pt-10">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <span className="w-14 text-xs text-zinc-300">{formatClock(currentTime)}</span>

            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-[rgb(215,55,45)]"
            />

            <span className="w-14 text-right text-xs text-zinc-300">
              {formatClock(duration)}
            </span>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-gray-500" />
      }
    >
      <WatchPlayer />
    </Suspense>
  );
}
