"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TatvaInteriorScrubProps {
  /**
   * Source path for the interior showcase video.
   * Defaults to "/tatva-showcase.mp4".
   */
  videoSrc?: string;

  /**
   * Scroll input distance (in pixels) across which the video scrubs end-to-end.
   * Defaults to 2800px for a responsive, fluid, zero-fatigue scroll experience.
   */
  scrubDistance?: number;

  /**
   * Section heading.
   */
  title?: string;

  /**
   * Subtitle / description.
   */
  subtitle?: string;

  /**
   * Optional custom className for outer wrapper.
   */
  className?: string;

  /**
   * Optional inline styles.
   */
  style?: React.CSSProperties;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function TatvaInteriorScrub({
  videoSrc = "/tatva-showcase.mp4",
  scrubDistance = 2800,
  title = "The Interior Sanctuary",
  subtitle = "A curated walkthrough of living space, natural courtyard light, and raw materiality.",
  className = "",
  style = {},
}: TatvaInteriorScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Video ready & playback state
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Physics & seek queue state
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);
  const isUserScrubbingRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const isVisibleRef = useRef<boolean>(true);

  // Cached layout metrics to prevent layout thrashing
  const layoutMetricsRef = useRef<{ top: number; range: number }>({
    top: 0,
    range: 1,
  });

  // Gated seek dispatcher: prevents overlapping seeks and browser decoder queue stalls
  const seekTo = useCallback((t: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const clampedTime = clamp(t, 0, video.duration);

    if (isSeekingRef.current) {
      pendingTimeRef.current = clampedTime;
      return;
    }

    if (Math.abs(video.currentTime - clampedTime) > 0.03) {
      isSeekingRef.current = true;
      video.currentTime = clampedTime;
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      isUserScrubbingRef.current = false;
      isPlayingRef.current = true;
      setIsPlaying(true);
      video.play().catch(() => {});
    } else {
      video.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  // Fast metric computation cached on resize and scroll initiation
  const updateLayoutMetrics = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const top = rect.top + scrollTop;
    const range = Math.max(1, container.offsetHeight - window.innerHeight);
    layoutMetricsRef.current = { top, range };
  }, []);

  // Main scroll & animation controller
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Track when video has first decodable frame ready
    const onLoadedData = () => {
      setIsReady(true);
      updateLayoutMetrics();
      if (isPlayingRef.current && isVisibleRef.current && video.paused) {
        video.play().catch(() => {});
      }
    };
    if (video.readyState >= 2) {
      setIsReady(true);
      if (isPlayingRef.current && isVisibleRef.current && video.paused) {
        video.play().catch(() => {});
      }
    }
    video.addEventListener("loadeddata", onLoadedData);

    // Drain queued seek timestamp when hardware decoder finishes previous seek
    const onSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        seekTo(nextTime);
      }
    };
    video.addEventListener("seeked", onSeeked);

    // Initial metrics
    updateLayoutMetrics();
    window.addEventListener("resize", updateLayoutMetrics, { passive: true });

    // Passive scroll listener: compute normalized progress [0..1]
    const onScroll = () => {
      if (!isVisibleRef.current) return;
      const { top, range } = layoutMetricsRef.current;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = clamp((scrollY - top) / range, 0, 1);
      targetProgressRef.current = progress;
      isUserScrubbingRef.current = true;
      lastScrollTimeRef.current = performance.now();

      if (!video.paused) {
        video.pause();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver: Pause video and RAF when showcase is outside the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          if (!video.paused) video.pause();
        } else {
          updateLayoutMetrics();
          if (isPlayingRef.current && !isUserScrubbingRef.current && video.paused) {
            video.play().catch(() => {});
          }
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(container);

    // 60FPS Lerp loop with sub-frame precision
    let rafId: number;
    const renderLoop = () => {
      if (!isVisibleRef.current) {
        rafId = requestAnimationFrame(renderLoop);
        return;
      }

      const now = performance.now();

      // Return to hands-free cinema playback if user stopped scrolling for > 1200ms and video is playing
      if (
        isUserScrubbingRef.current &&
        isPlayingRef.current &&
        now - lastScrollTimeRef.current > 1200
      ) {
        isUserScrubbingRef.current = false;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }

      if (isUserScrubbingRef.current) {
        // Scrubbing mode: lerp towards target scroll position
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current += diff * 0.22;
          if (video.duration && Number.isFinite(video.duration)) {
            const scrubTime = currentProgressRef.current * video.duration;
            seekTo(scrubTime);
          }
        }

        // Update progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${currentProgressRef.current})`;
        }
      } else {
        // Continuous playback mode: sync progress bar with video currentTime
        if (video.duration && Number.isFinite(video.duration)) {
          const videoProgress = video.currentTime / video.duration;
          currentProgressRef.current = videoProgress;
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${videoProgress})`;
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Tab visibility handling: pause video when backgrounded
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else if (isPlayingRef.current && isVisibleRef.current) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("resize", updateLayoutMetrics);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [seekTo, updateLayoutMetrics]);

  return (
    <section
      ref={containerRef}
      id="interior-showcase"
      aria-label="Tatva Interior Walkthrough Showcase"
      className={`relative w-full bg-[#05070D] ${className}`}
      style={{
        height: `calc(100vh + ${scrubDistance}px)`,
        ...style,
      }}
    >
      {/* Sticky Full-Viewport Native Video Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden select-none bg-[#05070D]"
      >
        {/* Stable Hardware-Accelerated Native Video Player */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          autoPlay
          preload="auto"
          loop
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform transform-gpu"
          style={{
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.5s ease-out",
          }}
        />

        {/* Subtle Architectural Atmosphere Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,7,13,0.35) 0%, rgba(5,7,13,0.05) 35%, rgba(5,7,13,0.15) 70%, rgba(5,7,13,0.5) 100%)",
          }}
        />

        {/* Top Floating Header with Brand Anchor & Skip Action */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 sm:p-10 z-20 pointer-events-auto">
          <a
            href="#tatva-hero"
            className="flex flex-col items-start leading-none group cursor-pointer text-[#F6EAD8]"
          >
            <span
              className="text-2xl sm:text-3xl font-bold tracking-normal drop-shadow-md"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
              }}
            >
              तत्व
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#F6EAD8]/75 font-medium mt-1 uppercase">
              TATVA
            </span>
          </a>

          <a
            href="#tatva-hero"
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-[#F6EAD8]/80 hover:text-[#F6EAD8] border-b border-[#F6EAD8]/30 pb-0.5 transition-colors cursor-pointer"
          >
            Explore Studio ↓
          </a>
        </header>

        {/* Floating Architectural Annotation */}
        <div className="absolute bottom-16 left-6 sm:left-12 z-20 max-w-lg pointer-events-none">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-2">
            Spatial Walkthrough • Spatial Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-[#F6EAD8] tracking-tight font-serif drop-shadow-md">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#F6EAD8]/75 mt-1 max-w-md font-sans font-light leading-relaxed drop-shadow-sm">
            {subtitle}
          </p>
        </div>

        {/* Clean Bottom Scrub Progress Line (GPU accelerated transform) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F6EAD8]/15 z-30 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-[#C59B6D] via-[#F6EAD8] to-[#C59B6D] origin-left transform-gpu will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Minimal Control Pill: Play / Pause Toggle */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 pointer-events-auto">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause walkthrough" : "Play continuous walkthrough"}
            className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#F6EAD8]/20 text-[#F6EAD8] text-xs font-mono tracking-wider hover:bg-black/60 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
