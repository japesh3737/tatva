"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TatvaInteriorScrubProps {
  /**
   * Source path for the interior showcase video.
   * Defaults to "/tatva-showcase.mp4".
   */
  videoSrc?: string;

  /**
   * Scroll input distance (in pixels) to scrub through the walkthrough clip.
   * Defaults to 5600px for a deliberate, fluid 1.5–2 scroll feel.
   */
  scrubDistance?: number;

  /**
   * Section heading. Defaults to "The Interior Sanctuary".
   */
  title?: string;

  /**
   * Subtitle / description. Defaults to "A curated walkthrough of living space, natural courtyard light, and raw materiality."
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
  scrubDistance = 5600,
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
  const [isPlaying, setIsPlaying] = useState(false);

  // Physics & seek queue state
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);
  const isUserScrubbingRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);

  // Cached layout metrics to avoid layout thrashing
  const layoutMetricsRef = useRef<{ top: number; range: number }>({
    top: 0,
    range: 1,
  });

  // Gated seek dispatcher: prevents overlapping seeks and browser decoder stall
  const seekTo = useCallback((t: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const clampedTime = clamp(t, 0, video.duration);

    if (isSeekingRef.current) {
      pendingTimeRef.current = clampedTime;
      return;
    }

    if (Math.abs(video.currentTime - clampedTime) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = clampedTime;
    }
  }, []);

  // Toggle play/pause for hands-free cinematic walkthrough
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

  // Update layout metrics without forced reflow during scroll
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
    };
    if (video.readyState >= 2) {
      setIsReady(true);
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
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver to pause loop/video when section is completely off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0 }
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

      // Return to hands-free playback if user stopped scrolling for > 400ms and video is set to playing
      if (
        isUserScrubbingRef.current &&
        isPlayingRef.current &&
        now - lastScrollTimeRef.current > 400
      ) {
        isUserScrubbingRef.current = false;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }

      if (isUserScrubbingRef.current || !isPlayingRef.current) {
        // Scrubbing mode: lerp towards target scroll position
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0001) {
          // Responsive 0.18 lerp coefficient for snappy yet organic physics
          currentProgressRef.current += diff * 0.18;
          if (video.duration && Number.isFinite(video.duration)) {
            const scrubTime = currentProgressRef.current * video.duration;
            seekTo(scrubTime);
          }
        }

        // Update progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(
            currentProgressRef.current * 100
          ).toFixed(2)}%`;
        }
      } else {
        // Cinema autoplay mode: sync scroll bar with video currentTime
        if (video.duration && Number.isFinite(video.duration)) {
          const videoProgress = video.currentTime / video.duration;
          currentProgressRef.current = videoProgress;
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(videoProgress * 100).toFixed(
              2
            )}%`;
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Tab visibility handling
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
          preload="auto"
          loop
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform"
          style={{
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Cinematic Neutral Dark Gradient Overlay for Typography Contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,7,13,0.4) 0%, rgba(5,7,13,0.05) 30%, rgba(5,7,13,0.15) 70%, rgba(5,7,13,0.6) 100%)",
          }}
        />

        {/* Floating Architectural Annotation */}
        <div className="absolute top-12 left-6 sm:left-12 z-20 max-w-xl">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-2">
            Spatial Walkthrough • Spatial Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-[#F6EAD8] tracking-tight font-serif">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#F6EAD8]/70 mt-1 max-w-md font-sans font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Subtle Bottom Scrub Progress Indicator & Play/Pause Controls */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/50 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#F6EAD8]/70 via-[#F6EAD8] to-[#C59B6D] will-change-[width]"
            style={{ width: "0%" }}
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-12 sm:right-12 flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause cinematic walkthrough" : "Play continuous walkthrough"}
              className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#F6EAD8]/20 text-[#F6EAD8] text-xs font-mono tracking-wider hover:bg-black/60 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
            </button>
            <span className="text-[11px] text-[#F6EAD8]/60 font-mono tracking-widest hidden sm:inline-block">
              SCROLL TO SCRUB • OR LET CINEMA PLAY
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[#F6EAD8]/50">
            <span className="px-2 py-0.5 rounded border border-[#F6EAD8]/15 bg-black/20">
              FULL HD 1080P
            </span>
            <span className="hidden sm:inline-block">
              {isPlaying ? "CONTINUOUS" : "SCRUBBING"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
